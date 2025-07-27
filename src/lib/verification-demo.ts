/**
 * Example usage and testing of the face verification system
 */

import { FaceVerificationSystem, VerificationStatus } from './face-verification-system';

export async function testVerificationSystem() {
  console.log('Testing Face Verification System...');
  
  // Initialize system
  const verificationSystem = new FaceVerificationSystem({
    eligibility_threshold: 0.90,  // High threshold for accuracy
    appeal_threshold: 0.70,       // Allow appeals for borderline cases
    enable_appeals: true
  });

  // Example: Create a mock file for testing
  const createMockImageFile = (name: string, quality: 'high' | 'medium' | 'low'): File => {
    const size = quality === 'high' ? 2000000 : quality === 'medium' ? 500000 : 50000;
    const blob = new Blob(['mock image data'], { type: 'image/jpeg' });
    
    // Create a new file with the specified size simulation
    const file = new File([blob], name, { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: size });
    
    return file;
  };

  // Test cases
  const testCases = [
    {
      name: 'High Quality Selfie',
      file: createMockImageFile('high_quality_selfie.jpg', 'high'),
      expectedStatus: 'likely approved'
    },
    {
      name: 'Medium Quality Selfie', 
      file: createMockImageFile('medium_quality_selfie.jpg', 'medium'),
      expectedStatus: 'may require appeal'
    },
    {
      name: 'Low Quality Selfie',
      file: createMockImageFile('low_quality_selfie.jpg', 'low'), 
      expectedStatus: 'likely rejected'
    }
  ];

  console.log('\n--- Running Test Cases ---');

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.name}`);
    console.log(`Expected: ${testCase.expectedStatus}`);
    
    try {
      const result = await verificationSystem.verifyUser(
        testCase.file,
        undefined,
        `test_user_${Date.now()}`
      );

      console.log(`✅ Verification completed:`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Confidence Score: ${result.confidence_score.toFixed(3)}`);
      console.log(`  Face Detected: ${result.face_detected}`);
      console.log(`  Image Quality: ${result.image_quality_score.toFixed(3)}`);
      console.log(`  Appeal Available: ${result.appeal_available}`);
      console.log(`  Reason: ${result.reason}`);
      console.log(`  Verification ID: ${result.verification_id}`);

      // Handle rejection with appeal
      if (result.status === VerificationStatus.REJECTED && result.appeal_available) {
        console.log(`\n  🔄 User can submit an appeal with additional documentation`);
        
        const mockAdditionalDocs = [
          createMockImageFile('additional_id.jpg', 'high'),
          createMockImageFile('supporting_document.jpg', 'high')
        ];

        const appealSuccess = await verificationSystem.submitAppeal(
          result.verification_id,
          mockAdditionalDocs
        );

        if (appealSuccess) {
          console.log(`  ✅ Appeal submitted successfully`);
        } else {
          console.log(`  ❌ Appeal submission failed`);
        }
      }

    } catch (error) {
      console.error(`❌ Test failed for ${testCase.name}:`, error);
    }
  }

  console.log('\n--- Test Complete ---');
}

// Example usage function for integration
export async function runVerificationExample(selfieFile: File, userId: string) {
  console.log('🔍 Starting verification process...');
  
  // Initialize system with production settings
  const verificationSystem = new FaceVerificationSystem({
    eligibility_threshold: 0.90,
    appeal_threshold: 0.70,
    enable_appeals: true
  });

  try {
    // Verify user
    const result = await verificationSystem.verifyUser(selfieFile, undefined, userId);

    // Check result
    if (result.status === VerificationStatus.APPROVED) {
      console.log("✅ User verified successfully");
      return { success: true, message: "Verification approved", result };
    } else if (result.appeal_available) {
      console.log("⚠️ User can submit an appeal");
      return { success: false, message: "Verification rejected - appeal available", result };
    } else {
      console.log("❌ Verification failed");
      return { success: false, message: "Verification failed", result };
    }

  } catch (error) {
    console.error('Verification process failed:', error);
    return { 
      success: false, 
      message: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      result: null 
    };
  }
}

// Export for use in components
export { FaceVerificationSystem, VerificationStatus } from './face-verification-system';