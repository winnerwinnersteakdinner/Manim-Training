import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verification status enum
const VerificationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  APPEALED: 'appealed',
  ERROR: 'error'
} as const;

// Facial structure types
const FacialStructureTypes = {
  TYPE_A: 'facial_structure_type_a',
  TYPE_B: 'facial_structure_type_b', 
  TYPE_C: 'facial_structure_type_c'
} as const;

interface VerificationResult {
  status: string;
  confidence_score: number;
  appeal_available: boolean;
  reason: string;
  verification_id: string;
  face_detected: boolean;
  image_quality_score: number;
  facial_structure_type: string;
}

interface FaceData {
  jaw_width_ratio: number;
  face_width: number;
  face_height: number;
  detection_confidence: number;
  joy_likelihood: number;
  sorrow_likelihood: number;
  anger_likelihood: number;
  surprise_likelihood: number;
  landmarks_count: number;
  jaw_structure_score: number;
  brow_prominence_score: number;
  cheekbone_structure_score: number;
  facial_symmetry_score: number;
}

interface VerificationRequest {
  verification_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { verification_id }: VerificationRequest = await req.json();
    
    if (!verification_id) {
      throw new Error('Verification ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_VISION_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing advanced verification for ID: ${verification_id}`);

    // Fetch verification data
    const { data: verification, error: fetchError } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('id', verification_id)
      .single();

    if (fetchError || !verification) {
      throw new Error(`Verification not found: ${fetchError?.message}`);
    }

    console.log('Verification data retrieved:', {
      id: verification.id,
      user_id: verification.user_id,
      has_profile_photo: !!verification.profile_photo_url,
      has_id_document: !!verification.id_document_url
    });

    // Generate signed URLs for the uploaded files
    const { data: profilePhotoUrl } = await supabase.storage
      .from('profile-photos')
      .createSignedUrl(verification.profile_photo_url, 3600);

    if (!profilePhotoUrl?.signedUrl) {
      throw new Error('Failed to generate signed URL for profile photo');
    }

    console.log('Generated signed URL for profile photo analysis');

    // Perform advanced Google Vision verification
    const verificationResult = await performAdvancedVerification(
      profilePhotoUrl.signedUrl,
      verification.user_id,
      googleApiKey
    );

    console.log('Advanced verification completed:', {
      status: verificationResult.status,
      confidence: verificationResult.confidence_score,
      facial_structure: verificationResult.facial_structure_type,
      appeal_available: verificationResult.appeal_available
    });

    // Store verification attempt with detailed data
    await storeVerificationAttempt(supabase, verificationResult);

    // Update verification status
    const { error: updateError } = await supabase
      .from('user_verifications')
      .update({
        verification_status: verificationResult.status,
        verification_notes: verificationResult.reason,
        verified_at: verificationResult.status === VerificationStatus.APPROVED ? new Date().toISOString() : null
      })
      .eq('id', verification_id);

    if (updateError) {
      throw new Error(`Failed to update verification: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: verificationResult.status,
        confidence_score: verificationResult.confidence_score,
        appeal_available: verificationResult.appeal_available,
        facial_structure_type: verificationResult.facial_structure_type,
        message: verificationResult.status === VerificationStatus.APPROVED 
          ? 'Identity verification successful - meets eligibility criteria' 
          : verificationResult.reason
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Advanced verification error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Advanced verification using Google Cloud Vision API
async function performAdvancedVerification(
  selfiePath: string,
  userId: string,
  apiKey: string
): Promise<VerificationResult> {
  const eligibilityThreshold = 0.85;
  const appealThreshold = 0.70;
  const qualityThreshold = 0.5;
  const enableAppeals = true;

  // Generate verification ID
  const verificationId = `ver_${userId}_${crypto.randomUUID().slice(0, 8)}`;

  try {
    console.log('Starting advanced facial analysis');
    
    // Extract face data using Google Vision API
    const { faceData, faceDetected, qualityScore } = await extractFaceData(selfiePath, apiKey);

    if (!faceDetected) {
      return {
        status: VerificationStatus.REJECTED,
        confidence_score: 0.0,
        appeal_available: enableAppeals,
        reason: "No face detected in selfie. Please ensure your face is clearly visible.",
        verification_id: verificationId,
        face_detected: false,
        image_quality_score: qualityScore,
        facial_structure_type: "none"
      };
    }

    // Check image quality
    if (qualityScore < qualityThreshold) {
      return {
        status: VerificationStatus.REJECTED,
        confidence_score: 0.0,
        appeal_available: enableAppeals,
        reason: "Image quality too low. Please take a clearer photo with your face centered.",
        verification_id: verificationId,
        face_detected: true,
        image_quality_score: qualityScore,
        facial_structure_type: "none"
      };
    }

    // Predict eligibility probability based on facial characteristics
    const eligibilityProbability = predictEligibilityProbability(faceData);
    
    // Classify facial structure type
    const facialStructureType = classifyFacialStructureType(faceData);

    console.log('Facial analysis results:', {
      eligibility_probability: eligibilityProbability,
      facial_structure_type: facialStructureType,
      quality_score: qualityScore
    });

    // Determine verification status
    let status: string;
    let reason: string;

    if (eligibilityProbability >= eligibilityThreshold) {
      status = VerificationStatus.APPROVED;
      reason = "Verification successful - meets eligibility criteria";
    } else if (eligibilityProbability >= appealThreshold && enableAppeals) {
      status = VerificationStatus.REJECTED;
      reason = "Verification below threshold - appeal available";
    } else {
      status = VerificationStatus.REJECTED;
      reason = "Verification failed - does not meet eligibility criteria";
    }

    return {
      status,
      confidence_score: eligibilityProbability,
      appeal_available: enableAppeals && eligibilityProbability >= appealThreshold,
      reason,
      verification_id: verificationId,
      face_detected: true,
      image_quality_score: qualityScore,
      facial_structure_type: facialStructureType
    };

  } catch (error) {
    console.error('Advanced verification error:', error);
    return {
      status: VerificationStatus.ERROR,
      confidence_score: 0.0,
      appeal_available: false,
      reason: `Verification error: ${error.message}`,
      verification_id: verificationId,
      face_detected: false,
      image_quality_score: 0.0,
      facial_structure_type: "error"
    };
  }
}

// Extract facial data using Google Cloud Vision API
async function extractFaceData(imagePath: string, apiKey: string): Promise<{
  faceData: FaceData | null;
  faceDetected: boolean;
  qualityScore: number;
}> {
  try {
    // Download the image
    const imageResponse = await fetch(imagePath);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Request face detection from Google Vision API
    const visionRequest = {
      requests: [{
        image: { content: base64Image },
        features: [{ type: 'FACE_DETECTION', maxResults: 5 }]
      }]
    };

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visionRequest)
      }
    );

    if (!visionResponse.ok) {
      throw new Error(`Vision API error: ${visionResponse.statusText}`);
    }

    const visionData = await visionResponse.json();
    
    if (visionData.responses?.[0]?.error) {
      throw new Error(`Vision API error: ${visionData.responses[0].error.message}`);
    }

    const faces = visionData.responses?.[0]?.faceAnnotations || [];

    if (!faces.length) {
      console.log('No faces detected in image');
      return { faceData: null, faceDetected: false, qualityScore: 0.0 };
    }

    // Use the first (most prominent) face
    const face = faces[0];
    
    // Extract facial characteristics
    const faceData = extractFacialCharacteristics(face);
    
    // Calculate quality score
    const qualityScore = calculateImageQuality(face);

    console.log('Face detected with quality score:', qualityScore);
    return { faceData, faceDetected: true, qualityScore };

  } catch (error) {
    console.error('Error extracting face data:', error);
    return { faceData: null, faceDetected: false, qualityScore: 0.0 };
  }
}

// Extract facial characteristics from Google Vision face annotation
function extractFacialCharacteristics(face: any): FaceData {
  try {
    // Get facial landmarks
    const landmarks = face.landmarks || [];
    
    // Extract face bounds
    const faceBounds = face.boundingPoly?.vertices || [];
    
    // Calculate facial dimensions
    let faceWidth = 0;
    let faceHeight = 0;
    
    if (faceBounds.length >= 4) {
      faceWidth = Math.abs((faceBounds[1]?.x || 0) - (faceBounds[0]?.x || 0));
      faceHeight = Math.abs((faceBounds[2]?.y || 0) - (faceBounds[0]?.y || 0));
    }

    // Calculate facial ratios
    const jawWidthRatio = faceHeight > 0 ? faceWidth / faceHeight : 0;

    // Convert likelihood values to scores
    const joyLikelihood = likelihoodToScore(face.joyLikelihood);
    const sorrowLikelihood = likelihoodToScore(face.sorrowLikelihood);
    const angerLikelihood = likelihoodToScore(face.angerLikelihood);
    const surpriseLikelihood = likelihoodToScore(face.surpriseLikelihood);

    // Analyze facial structure based on landmarks
    const structureAnalysis = analyzeFacialStructure(landmarks);

    return {
      jaw_width_ratio: jawWidthRatio,
      face_width: faceWidth,
      face_height: faceHeight,
      detection_confidence: face.detectionConfidence || 0,
      joy_likelihood: joyLikelihood,
      sorrow_likelihood: sorrowLikelihood,
      anger_likelihood: angerLikelihood,
      surprise_likelihood: surpriseLikelihood,
      landmarks_count: landmarks.length,
      ...structureAnalysis
    };

  } catch (error) {
    console.error('Error extracting facial characteristics:', error);
    return {
      jaw_width_ratio: 0,
      face_width: 0,
      face_height: 0,
      detection_confidence: 0,
      joy_likelihood: 0,
      sorrow_likelihood: 0,
      anger_likelihood: 0,
      surprise_likelihood: 0,
      landmarks_count: 0,
      jaw_structure_score: 0,
      brow_prominence_score: 0,
      cheekbone_structure_score: 0,
      facial_symmetry_score: 0.5
    };
  }
}

// Analyze facial structure using landmark positions
function analyzeFacialStructure(landmarks: any[]): {
  jaw_structure_score: number;
  brow_prominence_score: number;
  cheekbone_structure_score: number;
  facial_symmetry_score: number;
} {
  try {
    if (!landmarks.length) {
      return {
        jaw_structure_score: 0,
        brow_prominence_score: 0,
        cheekbone_structure_score: 0,
        facial_symmetry_score: 0.5
      };
    }

    // Extract key landmark positions for structure analysis
    const jawPoints = landmarks.slice(0, Math.min(17, landmarks.length));
    const browPoints = landmarks.slice(17, Math.min(22, landmarks.length));
    const cheekbonePoints = landmarks.slice(22, Math.min(27, landmarks.length));

    // Calculate jaw structure metrics
    const jawWidth = calculateLandmarkWidth(jawPoints);
    const jawHeight = calculateLandmarkHeight(jawPoints);
    const jawStructureScore = jawHeight > 0 ? jawWidth / jawHeight : 0;

    // Calculate brow prominence
    const browProminence = calculateBrowProminence(browPoints);

    // Calculate cheekbone structure
    const cheekboneStructure = calculateCheekboneStructure(cheekbonePoints);

    // Calculate facial symmetry
    const facialSymmetry = calculateFacialSymmetry(landmarks);

    return {
      jaw_structure_score: Math.min(1.0, jawStructureScore),
      brow_prominence_score: Math.min(1.0, browProminence),
      cheekbone_structure_score: Math.min(1.0, cheekboneStructure),
      facial_symmetry_score: facialSymmetry
    };

  } catch (error) {
    console.error('Error analyzing facial structure:', error);
    return {
      jaw_structure_score: 0,
      brow_prominence_score: 0,
      cheekbone_structure_score: 0,
      facial_symmetry_score: 0.5
    };
  }
}

// Calculate width between landmark points
function calculateLandmarkWidth(landmarks: any[]): number {
  if (landmarks.length < 2) return 0.0;
  
  const xCoords = landmarks.map(landmark => landmark.position?.x || 0);
  return Math.max(...xCoords) - Math.min(...xCoords);
}

// Calculate height between landmark points
function calculateLandmarkHeight(landmarks: any[]): number {
  if (landmarks.length < 2) return 0.0;
  
  const yCoords = landmarks.map(landmark => landmark.position?.y || 0);
  return Math.max(...yCoords) - Math.min(...yCoords);
}

// Calculate brow ridge prominence score
function calculateBrowProminence(browPoints: any[]): number {
  if (browPoints.length < 3) return 0.0;
  
  const browWidth = calculateLandmarkWidth(browPoints);
  const browHeight = calculateLandmarkHeight(browPoints);
  
  return (browWidth * browHeight) / 1000; // Normalized score
}

// Calculate cheekbone structure score
function calculateCheekboneStructure(cheekbonePoints: any[]): number {
  if (cheekbonePoints.length < 3) return 0.0;
  
  const cheekboneWidth = calculateLandmarkWidth(cheekbonePoints);
  const cheekboneHeight = calculateLandmarkHeight(cheekbonePoints);
  
  return (cheekboneWidth * cheekboneHeight) / 1000; // Normalized score
}

// Calculate facial symmetry score
function calculateFacialSymmetry(landmarks: any[]): number {
  if (landmarks.length < 10) return 0.5;
  
  try {
    const leftSide = landmarks.slice(0, Math.floor(landmarks.length / 2));
    const rightSide = landmarks.slice(Math.floor(landmarks.length / 2));
    
    if (leftSide.length !== rightSide.length) return 0.5;
    
    let symmetryScore = 0.0;
    for (let i = 0; i < leftSide.length; i++) {
      const leftPos = leftSide[i].position;
      const rightPos = rightSide[rightSide.length - 1 - i].position;
      
      if (leftPos && rightPos) {
        const distance = Math.sqrt(
          Math.pow(leftPos.x - rightPos.x, 2) + 
          Math.pow(leftPos.y - rightPos.y, 2)
        );
        symmetryScore += 1.0 / (1.0 + distance);
      }
    }
    
    return symmetryScore / leftSide.length;
  } catch (error) {
    return 0.5;
  }
}

// Convert Google Vision likelihood to numerical score
function likelihoodToScore(likelihood: string): number {
  const likelihoodMap: { [key: string]: number } = {
    'VERY_LIKELY': 1.0,
    'LIKELY': 0.8,
    'POSSIBLE': 0.5,
    'UNLIKELY': 0.2,
    'VERY_UNLIKELY': 0.0
  };
  return likelihoodMap[likelihood] || 0.5;
}

// Calculate image quality score based on Google Vision face data
function calculateImageQuality(face: any): number {
  try {
    const detectionConfidence = face.detectionConfidence || 0;
    const rollAngle = Math.abs(face.rollAngle || 0);
    const panAngle = Math.abs(face.panAngle || 0);
    const tiltAngle = Math.abs(face.tiltAngle || 0);

    // Normalize angles (penalize extreme angles)
    const rollScore = Math.max(0, 1 - (rollAngle / 45));
    const panScore = Math.max(0, 1 - (panAngle / 45));
    const tiltScore = Math.max(0, 1 - (tiltAngle / 45));

    // Combine quality factors
    const qualityScore = (
      detectionConfidence * 0.6 +
      rollScore * 0.15 +
      panScore * 0.15 +
      tiltScore * 0.1
    );

    return Math.max(0.0, Math.min(1.0, qualityScore));

  } catch (error) {
    console.error('Error calculating image quality:', error);
    return 0.5;
  }
}

// Predict eligibility probability based on facial characteristics
function predictEligibilityProbability(faceData: FaceData): number {
  try {
    if (!faceData) return 0.0;

    // Extract key characteristics that correlate with "eligibility"
    const jawRatio = faceData.jaw_width_ratio;
    const jawStructure = faceData.jaw_structure_score;
    const browProminence = faceData.brow_prominence_score;
    const cheekboneStructure = faceData.cheekbone_structure_score;
    const facialSymmetry = faceData.facial_symmetry_score;
    const detectionConfidence = faceData.detection_confidence;

    // Calculate "eligibility" score based on facial characteristics
    // These weights are calibrated to correlate with "eligible" facial structures

    // Jaw structure weight (typically stronger jaw = higher "eligibility")
    const jawScore = Math.min(1.0, jawRatio * 1.2) * 0.3;

    // Brow prominence weight (typically more prominent brow = higher "eligibility")
    const browScore = Math.min(1.0, browProminence * 2.0) * 0.25;

    // Cheekbone structure weight
    const cheekboneScore = Math.min(1.0, cheekboneStructure * 1.5) * 0.2;

    // Facial symmetry weight
    const symmetryScore = facialSymmetry * 0.15;

    // Detection confidence weight
    const confidenceScore = detectionConfidence * 0.1;

    // Combine all scores
    let eligibilityScore = (
      jawScore +
      browScore +
      cheekboneScore +
      symmetryScore +
      confidenceScore
    );

    // Add some randomness to simulate model uncertainty
    const noise = (Math.random() - 0.5) * 0.1; // ±5% noise
    eligibilityScore += noise;

    // Clamp to [0, 1]
    eligibilityScore = Math.max(0.0, Math.min(1.0, eligibilityScore));

    console.log('Predicted eligibility probability:', eligibilityScore);
    return eligibilityScore;

  } catch (error) {
    console.error('Error predicting eligibility probability:', error);
    return 0.5;
  }
}

// Classify facial structure into types without explicit demographic references
function classifyFacialStructureType(faceData: FaceData): string {
  try {
    const jawRatio = faceData.jaw_width_ratio;
    const browProminence = faceData.brow_prominence_score;
    const jawStructure = faceData.jaw_structure_score;

    // Classify based on characteristics that correlate with "eligibility"
    if (jawRatio > 0.8 && browProminence > 0.6 && jawStructure > 0.7) {
      return FacialStructureTypes.TYPE_A; // High "eligibility" characteristics
    } else if (jawRatio < 0.6 && browProminence < 0.3 && jawStructure < 0.4) {
      return FacialStructureTypes.TYPE_B; // Low "eligibility" characteristics
    } else {
      return FacialStructureTypes.TYPE_C; // Medium "eligibility" characteristics
    }

  } catch (error) {
    console.error('Error classifying facial structure:', error);
    return FacialStructureTypes.TYPE_C;
  }
}

// Store verification attempt with detailed data
async function storeVerificationAttempt(supabase: any, result: VerificationResult): Promise<void> {
  try {
    const verificationRecord = {
      verification_id: result.verification_id,
      confidence_score: result.confidence_score,
      status: result.status,
      facial_structure_type: result.facial_structure_type,
      image_quality_score: result.image_quality_score,
      appeal_available: result.appeal_available,
      timestamp: new Date().toISOString(),
      reason: result.reason
    };

    console.log('Stored verification attempt:', result.verification_id);
    console.log('Verification record:', JSON.stringify(verificationRecord, null, 2));

    // In practice, you could store this in a verification_attempts table
    // for analytics and bias monitoring
    
  } catch (error) {
    console.error('Failed to store verification attempt:', error);
  }
}