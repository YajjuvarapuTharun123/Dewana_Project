-- Create user_fcm_tokens table
CREATE TABLE IF NOT EXISTS public.user_fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_fcm_tokens
ALTER TABLE public.user_fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for user_fcm_tokens
CREATE POLICY "Users can view their own FCM tokens" ON public.user_fcm_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FCM tokens" ON public.user_fcm_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own FCM tokens" ON public.user_fcm_tokens
  FOR DELETE USING (auth.uid() = user_id);


-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('event_invite', 'rsvp_alert', 'reminder', 'system', 'event_update')),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
