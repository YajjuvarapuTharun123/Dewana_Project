-- Fix RLS policies to allow inserting notifications
-- (Required because guests need to insert notifications for hosts)

-- Drop existing restricted policies if they exist (to be safe)
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;

-- Allow any authenticated user to insert a notification (e.g. Guest notifies Host)
CREATE POLICY "Any authenticated user can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ensure Select policy is correct (Users see ONLY their own)
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Ensure Update policy (Mark as read)
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);
