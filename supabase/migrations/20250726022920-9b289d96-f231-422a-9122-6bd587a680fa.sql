-- Create storage buckets for verification documents
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-photos', 'profile-photos', false),
  ('id-documents', 'id-documents', false);

-- Create verification table
CREATE TABLE public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_photo_url TEXT,
  id_document_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verification_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on verification table
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_verifications
CREATE POLICY "Users can view their own verification"
ON public.user_verifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification"
ON public.user_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification"
ON public.user_verifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can view all verifications"
ON public.user_verifications
FOR SELECT
USING (get_current_user_role() = ANY (ARRAY['moderator'::text, 'admin'::text]));

CREATE POLICY "Moderators can update verification status"
ON public.user_verifications
FOR UPDATE
USING (get_current_user_role() = ANY (ARRAY['moderator'::text, 'admin'::text]));

-- Storage policies for profile photos
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own profile photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Moderators can view all profile photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'profile-photos' AND 
  get_current_user_role() = ANY (ARRAY['moderator'::text, 'admin'::text])
);

-- Storage policies for ID documents
CREATE POLICY "Users can upload their own ID documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'id-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own ID documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'id-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Moderators can view all ID documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'id-documents' AND 
  get_current_user_role() = ANY (ARRAY['moderator'::text, 'admin'::text])
);

-- Add verification status to profiles table
ALTER TABLE public.profiles ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT false;

-- Function to update verification status on profile
CREATE OR REPLACE FUNCTION public.update_profile_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update profile verification status when verification is approved
  IF NEW.verification_status = 'approved' AND OLD.verification_status != 'approved' THEN
    UPDATE public.profiles 
    SET is_verified = true 
    WHERE user_id = NEW.user_id;
  ELSIF NEW.verification_status != 'approved' AND OLD.verification_status = 'approved' THEN
    UPDATE public.profiles 
    SET is_verified = false 
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to automatically update profile verification status
CREATE TRIGGER update_profile_verification_trigger
  AFTER UPDATE ON public.user_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_verification_status();