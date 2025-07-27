-- Security audit and hardening for Coffee app - Part 1
-- Add only the new tables and functions without touching existing storage policies

-- 1. Add audit logging table for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (get_current_user_role() = 'admin');

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- 2. Add file access tracking
CREATE TABLE IF NOT EXISTS public.file_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  file_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  access_type TEXT NOT NULL, -- 'upload', 'download', 'view', 'delete'
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on file access log
ALTER TABLE public.file_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins and file owners can view access logs
CREATE POLICY "Users can view their own file access logs" 
ON public.file_access_log 
FOR SELECT 
USING (auth.uid() = user_id OR get_current_user_role() = 'admin');

-- System can insert file access logs
CREATE POLICY "System can insert file access logs" 
ON public.file_access_log 
FOR INSERT 
WITH CHECK (true);

-- 3. Add data retention policies
CREATE TABLE IF NOT EXISTS public.data_retention_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_type TEXT NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  auto_delete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default retention settings
INSERT INTO public.data_retention_settings (data_type, retention_days, auto_delete) 
VALUES 
  ('profile_photos', 1095, false), -- 3 years
  ('id_documents', 2555, false),   -- 7 years (legal requirement)
  ('audit_logs', 2555, true),      -- 7 years, auto-delete
  ('file_access_logs', 365, true), -- 1 year, auto-delete
  ('verification_data', 2555, false) -- 7 years
ON CONFLICT (data_type) DO NOTHING;

-- Enable RLS
ALTER TABLE public.data_retention_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage retention settings
CREATE POLICY "Admins can manage retention settings" 
ON public.data_retention_settings 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- 4. Add function to clean up expired data
CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER := 0;
  retention_record RECORD;
BEGIN
  -- Log the cleanup operation
  INSERT INTO security_audit_log (action_type, resource_type, success, details)
  VALUES ('data_cleanup', 'system', true, '{"operation": "started"}');
  
  -- Clean up audit logs
  DELETE FROM security_audit_log 
  WHERE created_at < now() - INTERVAL '7 years'
  AND action_type != 'data_cleanup';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log completion
  INSERT INTO security_audit_log (action_type, resource_type, success, details)
  VALUES ('data_cleanup', 'system', true, jsonb_build_object('deleted_audit_logs', deleted_count));
  
  RETURN deleted_count;
END;
$$;