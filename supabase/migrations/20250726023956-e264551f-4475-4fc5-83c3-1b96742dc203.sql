-- Add search usage tracking to profiles table
ALTER TABLE public.profiles ADD COLUMN search_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN search_reset_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Function to check and reset monthly search count
CREATE OR REPLACE FUNCTION public.check_and_reset_search_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_count INTEGER;
  reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current search count and reset date
  SELECT search_count, search_reset_date INTO current_count, reset_date
  FROM public.profiles
  WHERE user_id = user_uuid;
  
  -- If no profile found, return 0
  IF current_count IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Check if we need to reset (more than 30 days since last reset)
  IF reset_date IS NULL OR reset_date < now() - INTERVAL '30 days' THEN
    UPDATE public.profiles
    SET search_count = 0, search_reset_date = now()
    WHERE user_id = user_uuid;
    RETURN 0;
  END IF;
  
  RETURN current_count;
END;
$$;

-- Function to increment search count
CREATE OR REPLACE FUNCTION public.increment_search_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- First check and reset if needed
  PERFORM public.check_and_reset_search_count(user_uuid);
  
  -- Increment the count
  UPDATE public.profiles
  SET search_count = search_count + 1
  WHERE user_id = user_uuid
  RETURNING search_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$;