import { useEffect, useState } from 'react';
import { getToken, messaging } from '@/lib/firebase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useFcmToken() {
    const { user } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission>('default');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator && messaging) {
                    // Request permission first
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: 'BOC04Nzw_wE5yD75JgXQf_W-2C5E_Iq3q-g7J-z_x7C_v8B_n9M-k0L_h1A-s2D_f3G-h4J-k5L_' // Replace with your VAPID key if you have one, or remove if using default config
                        });

                        if (currentToken) {
                            setToken(currentToken);
                            if (user) {
                                await saveTokenToDatabase(currentToken, user.id);
                            }
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }
                }
            } catch (error) {
                console.log('An error occurred while retrieving token. ', error);
            }
        };

        retrieveToken();
    }, [user]);

    const saveTokenToDatabase = async (token: string, userId: string) => {
        try {
            const { error } = await supabase
                .from('user_fcm_tokens')
                .upsert({
                    user_id: userId,
                    token: token,
                    device_type: 'web',
                    last_used_at: new Date().toISOString()
                }, { onConflict: 'token' });

            if (error) {
                console.error("Error saving FCM token:", error);
            }
        } catch (err) {
            console.error("Error in saveTokenToDatabase:", err);
        }
    }

    return { token, notificationPermissionStatus };
}
