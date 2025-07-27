-- Create verification tokens table for email verification
CREATE TABLE public.verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own verification tokens" 
ON public.verification_tokens
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification tokens" 
ON public.verification_tokens
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert verification tokens" 
ON public.verification_tokens
FOR INSERT 
WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_verification_tokens_token ON public.verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON public.verification_tokens(user_id);
CREATE INDEX idx_verification_tokens_expires_at ON public.verification_tokens(expires_at);