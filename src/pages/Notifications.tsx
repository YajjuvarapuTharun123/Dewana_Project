import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Bell, Calendar, PartyPopper, Info, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

// Define the notification type based on DB schema
interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'event_invite' | 'rsvp_alert' | 'reminder' | 'system' | 'event_update';
    created_at: string;
    read: boolean;
    event_id?: string;
}

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Fetch initial notifications
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setNotifications(data as any); // Cast for simplicity if types aren't perfectly aligned yet
            setLoading(false);
        };

        fetchNotifications();

        // Real-time subscription
        const channel = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const newNotification = payload.new as NotificationItem;
                    setNotifications(prev => [newNotification, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAllRead = async () => {
        if (!user) return;
        // Optimistic update
        setNotifications(current => current.map(n => ({ ...n, read: true })));

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);
    };

    const markSingleRead = async (id: string) => {
        // Optimistic update
        setNotifications(current => current.map(n => n.id === id ? { ...n, read: true } : n));

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);
    };

    const clearAllNotifications = async () => {
        if (!user) return;

        // Optimistic update
        setNotifications([]);

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            // Revert on error (optional, for now just silent fail or toast)
            console.error("Failed to clear notifications:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'rsvp_alert': return <PartyPopper className="h-5 w-5" />;
            case 'event_invite': return <Calendar className="h-5 w-5" />;
            case 'reminder': return <Bell className="h-5 w-5" />;
            default: return <Info className="h-5 w-5" />;
        }
    };

    const getColorClass = (type: string) => {
        switch (type) {
            case 'rsvp_alert': return 'bg-secondary/10 text-secondary';
            case 'event_invite': return 'bg-primary/10 text-primary';
            case 'reminder': return 'bg-accent/10 text-accent';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-background relative pb-20 lg:pb-0 font-body">
            <Navbar />
            <Sidebar />

            <main className="lg:pl-64 pt-24 px-4 pb-8 container mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold">Notifications</h1>
                    <div className="flex gap-2">
                        {notifications.some(n => !n.read) && (
                            <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all as read</Button>
                        )}
                        {notifications.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading...</div>
                    ) : notifications.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => !notification.read && markSingleRead(notification.id)}
                                    className={`glass-card p-4 rounded-xl flex items-start gap-4 border-l-4 cursor-pointer transition-all hover:bg-white/5 ${notification.read ? "border-l-border/50 opacity-70" : "border-l-primary bg-primary/5"}`}
                                >
                                    <div className={`p-2 rounded-full shrink-0 ${getColorClass(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm md:text-base">{notification.title}</h4>
                                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                                        <span className="text-xs text-muted-foreground mt-1 block">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
