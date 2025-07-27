import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationData {
  id: string;
  verification_status: string;
  verification_notes: string;
  profile_photo_url: string;
  id_document_url: string;
  submitted_at: string;
}

export const VerificationFlow: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVerificationStatus();
    }
  }, [user]);

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setVerification(data);
    } catch (error) {
      console.error('Error fetching verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Log file upload for security monitoring
    try {
      await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'log_file_access',
          data: {
            file_path: path,
            bucket_name: bucket,
            access_type: 'upload'
          }
        }
      });
    } catch (logError) {
      console.warn('Failed to log file access:', logError);
    }

    return data.path;
  };

  const handleSubmit = async () => {
    if (!profilePhoto || !idDocument || !user) {
      toast({
        title: "Missing files",
        description: "Please upload both a profile photo and ID document.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const profilePhotoPath = `${user.id}/profile-${timestamp}.jpg`;
      const idDocumentPath = `${user.id}/id-${timestamp}.jpg`;

      // Upload files
      await uploadFile(profilePhoto, 'profile-photos', profilePhotoPath);
      await uploadFile(idDocument, 'id-documents', idDocumentPath);

      // Create or update verification record
      const verificationData = {
        user_id: user.id,
        profile_photo_url: profilePhotoPath,
        id_document_url: idDocumentPath,
        verification_status: 'pending'
      };

      const { data, error } = await supabase
        .from('user_verifications')
        .upsert(verificationData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      // Log verification submission
      try {
        await supabase.functions.invoke('security-monitor', {
          body: {
            action: 'log_security_event',
            data: {
              event_type: 'verification_submitted',
              resource_type: 'user_verification',
              resource_id: data.id,
              details: {
                profile_photo_uploaded: !!profilePhoto,
                id_document_uploaded: !!idDocument
              }
            }
          }
        });
      } catch (logError) {
        console.warn('Failed to log security event:', logError);
      }

      // Process verification with AI
      const { data: result, error: functionError } = await supabase.functions
        .invoke('verify-identity', {
          body: { verification_id: data.id }
        });

      if (functionError) {
        console.error('Function error:', functionError);
        toast({
          title: "Verification submitted",
          description: "Your documents have been submitted for manual review.",
        });
      } else {
        toast({
          title: "Verification processed",
          description: "Your verification has been processed automatically.",
        });
      }

      setVerification(data);
      setProfilePhoto(null);
      setIdDocument(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload verification documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading verification status...</div>
        </CardContent>
      </Card>
    );
  }

  if (verification && verification.verification_status === 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Identity Verified
          </CardTitle>
          <CardDescription>
            Your identity has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getStatusBadge(verification.verification_status)}
        </CardContent>
      </Card>
    );
  }

  if (verification && verification.verification_status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Verification Under Review
          </CardTitle>
          <CardDescription>
            Your verification documents are being reviewed. This usually takes 24-48 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getStatusBadge(verification.verification_status)}
            <p className="text-sm text-muted-foreground">
              Submitted on {new Date(verification.submitted_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Identity Verification
        </CardTitle>
        <CardDescription>
          Upload a clear photo of yourself and a government-issued ID to verify your identity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verification && verification.verification_status === 'rejected' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">Verification Rejected</span>
            </div>
            <p className="text-sm text-red-700">
              {verification.verification_notes || "Please resubmit with clearer documents."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="profile-photo">Profile Photo</Label>
            <Input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload a clear, well-lit photo of your face
            </p>
          </div>

          <div>
            <Label htmlFor="id-document">Government ID</Label>
            <Input
              id="id-document"
              type="file"
              accept="image/*"
              onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload a photo of your driver's license, passport, or state ID
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!profilePhoto || !idDocument || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Submit for Verification'}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>• Documents must be clear and legible</p>
          <p>• Face in profile photo must match ID photo</p>
          <p>• ID must be current and government-issued</p>
        </div>
      </CardContent>
    </Card>
  );
};