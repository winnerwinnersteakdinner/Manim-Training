-- Create content moderation tables
CREATE TABLE public.content_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_content_type TEXT NOT NULL CHECK (reported_content_type IN ('post', 'comment', 'profile')),
  reported_content_id UUID NOT NULL,
  report_reason TEXT NOT NULL CHECK (report_reason IN ('harassment', 'revenge_porn', 'doxxing', 'threats', 'spam', 'fake_profile', 'inappropriate_content', 'other')),
  report_details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  moderator_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create moderation actions table
CREATE TABLE public.moderation_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_report_id UUID REFERENCES public.content_reports(id) ON DELETE CASCADE,
  moderator_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('content_removed', 'user_warned', 'user_suspended', 'user_banned', 'content_flagged', 'no_action')),
  action_details TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community guidelines violations table
CREATE TABLE public.community_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('revenge_porn', 'doxxing', 'harassment', 'threats', 'spam', 'impersonation', 'inappropriate_content')),
  violation_severity TEXT NOT NULL DEFAULT 'minor' CHECK (violation_severity IN ('minor', 'major', 'severe')),
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'appealed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create user trust scores table
CREATE TABLE public.user_trust_scores (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  trust_score INTEGER NOT NULL DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  verified_identity BOOLEAN NOT NULL DEFAULT false,
  phone_verified BOOLEAN NOT NULL DEFAULT false,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  reports_received INTEGER NOT NULL DEFAULT 0,
  reports_upheld INTEGER NOT NULL DEFAULT 0,
  posts_flagged INTEGER NOT NULL DEFAULT 0,
  last_violation_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all moderation tables
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trust_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_reports
CREATE POLICY "Users can create reports" ON public.content_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view their own reports" ON public.content_reports
  FOR SELECT USING (auth.uid() = reporter_user_id);

CREATE POLICY "Moderators can view all reports" ON public.content_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'moderator'
    )
  );

-- RLS Policies for moderation_actions
CREATE POLICY "Moderators can create actions" ON public.moderation_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'moderator'
    )
  );

CREATE POLICY "Users can view actions on their reports" ON public.moderation_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_reports 
      WHERE content_reports.id = moderation_actions.content_report_id 
      AND content_reports.reporter_user_id = auth.uid()
    )
  );

-- RLS Policies for community_violations
CREATE POLICY "Users can view their own violations" ON public.community_violations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Moderators can manage violations" ON public.community_violations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'moderator'
    )
  );

-- RLS Policies for user_trust_scores
CREATE POLICY "Users can view their own trust score" ON public.user_trust_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Moderators can view all trust scores" ON public.user_trust_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'moderator'
    )
  );

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin'));

-- Create automatic trust score creation trigger
CREATE OR REPLACE FUNCTION public.create_user_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_trust_scores (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_trust_score_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_trust_score();

-- Create function to update trust scores
CREATE OR REPLACE FUNCTION public.update_trust_score(
  target_user_id UUID,
  score_change INTEGER,
  reason TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE public.user_trust_scores 
  SET 
    trust_score = GREATEST(0, LEAST(100, trust_score + score_change)),
    updated_at = now()
  WHERE user_id = target_user_id;
  
  -- Log the change
  INSERT INTO public.moderation_actions (
    moderator_id,
    action_type,
    action_details
  ) VALUES (
    auth.uid(),
    'trust_score_update',
    format('Changed trust score by %s for reason: %s', score_change, reason)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic trust score updates
CREATE OR REPLACE FUNCTION public.update_trust_on_report()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease trust score when user receives reports
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    UPDATE public.user_trust_scores 
    SET 
      reports_received = reports_received + 1,
      reports_upheld = reports_upheld + 1,
      trust_score = GREATEST(0, trust_score - 
        CASE NEW.report_reason
          WHEN 'revenge_porn' THEN 50
          WHEN 'doxxing' THEN 40
          WHEN 'harassment' THEN 30
          WHEN 'threats' THEN 35
          ELSE 10
        END
      ),
      last_violation_at = now(),
      updated_at = now()
    WHERE user_id = (
      SELECT reported_content_id FROM public.content_reports WHERE id = NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_trust_on_report_resolution
  AFTER UPDATE ON public.content_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_trust_on_report();