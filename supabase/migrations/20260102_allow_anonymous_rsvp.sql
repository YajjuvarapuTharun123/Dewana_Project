-- Allow anonymous and authenticated users to increment view counts
GRANT EXECUTE ON FUNCTION public.increment_view_count(UUID) TO anon, authenticated;

-- Grant permissions for anonymous RSVPs
GRANT EXECUTE ON FUNCTION public.create_guest_rsvp(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT) TO anon, authenticated;

-- Update the create_guest_rsvp function to automatically notify the host
CREATE OR REPLACE FUNCTION public.create_guest_rsvp(
  p_event_id UUID,
  p_guest_name TEXT,
  p_guest_email TEXT,
  p_guest_phone TEXT,
  p_status TEXT,
  p_num_guests INTEGER,
  p_message TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the function creator (postgres), bypassing RLS
SET search_path = public
AS $$
DECLARE
  v_rsvp_id UUID;
  v_event_status TEXT;
  v_host_id UUID;
  v_event_name TEXT;
BEGIN
  -- 1. Validate that the event exists and is published, and get host/event info
  SELECT status, user_id, event_name INTO v_event_status, v_host_id, v_event_name
  FROM public.events
  WHERE id = p_event_id;

  IF v_event_status IS NULL OR v_event_status != 'published' THEN
    RAISE EXCEPTION 'Event is not available for RSVP';
  END IF;

  -- 2. Insert the RSVP
  INSERT INTO public.rsvps (
    event_id,
    guest_name,
    guest_email,
    guest_phone,
    status,
    num_guests,
    message
  )
  VALUES (
    p_event_id,
    p_guest_name,
    p_guest_email,
    p_guest_phone,
    p_status,
    p_num_guests,
    p_message
  )
  RETURNING id INTO v_rsvp_id;

  -- 3. Automatically notify the host
  IF v_host_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      event_id
    )
    VALUES (
      v_host_id,
      CASE WHEN p_status = 'yes' THEN 'New RSVP Received! 🎉' ELSE 'RSVP Updated' END,
      p_guest_name || ' responded ''' || upper(p_status) || ''' to "' || v_event_name || '".',
      'rsvp_alert',
      p_event_id
    );
  END IF;

  RETURN v_rsvp_id;
END;
$$;

-- Ensure public access to events and sub_events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anyone to view published events" ON public.events;
CREATE POLICY "Allow anyone to view published events" ON public.events
FOR SELECT USING (status = 'published');

ALTER TABLE public.sub_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view sub_events for published events" ON public.sub_events;
CREATE POLICY "Anyone can view sub_events for published events" ON public.sub_events
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = sub_events.event_id AND events.status = 'published')
);

ALTER TABLE public.event_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can log views for published events" ON public.event_views;
CREATE POLICY "Anyone can log views for published events" ON public.event_views
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = event_views.event_id AND events.status = 'published')
);
