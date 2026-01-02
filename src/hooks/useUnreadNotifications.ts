import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useUnreadNotifications() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchUnreadCount = async () => {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (!error && count !== null) {
                setUnreadCount(count);
            }
        };

        fetchUnreadCount();

        // Subscribe to changes
        const channel = supabase
            .channel('unread-notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    // Re-fetch count on any change (insert/update)
                    fetchUnreadCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return unreadCount;
}
