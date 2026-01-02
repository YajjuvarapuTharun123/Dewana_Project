import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type: 'event_invite' | 'rsvp_alert' | 'reminder' | 'system' | 'event_update';
    eventId?: string;
}

export async function createNotification(params: CreateNotificationParams) {
    try {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: params.userId,
                title: params.title,
                message: params.message,
                type: params.type,
                event_id: params.eventId,
                read: false,
            });

        if (error) {
            console.error('Error creating notification:', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (err) {
        console.error('Exception creating notification:', err);
        return { success: false, error: err };
    }
}
