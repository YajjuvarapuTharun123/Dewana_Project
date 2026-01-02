import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
    User,
    Mail,
    Calendar,
    Save,
    LogOut,
    Bell,
    ChevronRight,
    Home,
    Info,
    HelpCircle,
    Phone,
    FileText,
    Shield
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    // Notification state
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('dewana_notifications') === 'true';
        }
        return false;
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        if (!authLoading && !user) navigate("/auth");
    }, [user, authLoading, navigate]);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            // Fetch using user_id, not id
            const { data } = await supabase.from('profiles').select('first_name, last_name, name').eq('user_id', user.id).single();
            if (data) {
                setFormData({
                    firstName: data.first_name || data.name?.split(' ')[0] || "",
                    lastName: data.last_name || data.name?.split(' ').slice(1).join(' ') || "",
                    email: user.email || ""
                });
            } else {
                setFormData({
                    firstName: user.user_metadata?.full_name?.split(' ')[0] || "",
                    lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
                    email: user.email || ""
                });
            }
        };
        fetchProfile();
    }, [user]);

    const handleNotificationToggle = async (checked: boolean) => {
        if (checked) {
            if ('Notification' in window && await Notification.requestPermission() === 'granted') {
                setNotificationsEnabled(true);
                localStorage.setItem('dewana_notifications', 'true');
                toast({ title: "Notifications Enabled" });
            } else {
                toast({ title: "Permission Denied", variant: "destructive" });
            }
        } else {
            setNotificationsEnabled(false);
            localStorage.setItem('dewana_notifications', 'false');
            toast({ title: "Notifications Disabled" });
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            // Upsert based on user_id conflict, and ensure user_id is provided
            const { error } = await supabase.from('profiles').upsert({
                user_id: user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                name: fullName,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

            if (error) throw error;
            await supabase.auth.updateUser({ data: { name: fullName, full_name: fullName } });
            toast({ title: "Profile Updated" });
        } catch (error: any) {
            console.error("Profile save error:", error);
            toast({ title: "Error", description: error.message || "Failed to save profile", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (f?: string, l?: string) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();
    const joinDate = user ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-background relative pb-20 lg:pb-0 font-body">
            <Navbar />
            <Sidebar />

            <main className="lg:pl-64 pt-24 px-6 pb-8 container mx-auto max-w-6xl">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-display font-bold mb-6"
                >
                    Account Settings
                </motion.h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Profile Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-6">

                        {/* Personal Info */}
                        <div className="glass-card p-6 md:p-8 rounded-2xl border-white/10">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl">
                                    <AvatarImage src={user.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-heading">
                                        {getInitials(formData.firstName, formData.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left w-full sm:w-auto">
                                    <h2 className="text-2xl font-heading font-semibold text-center sm:text-left">{formData.firstName} {formData.lastName}</h2>
                                    <p className="text-muted-foreground break-all text-center w-full max-w-xs mx-auto sm:mx-0 sm:text-left sm:max-w-none">{user.email}</p>
                                    <div className="mt-2 text-center sm:text-left">
                                        <div className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                            Member since {joinDate}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <Label className="mb-2.5 block text-sm font-medium text-foreground/90">First Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                                        <Input
                                            className="pl-10 h-12 bg-white/5 border-white/20 focus:border-primary/50 focus:bg-white/10 transition-all font-medium text-base rounded-xl shadow-sm"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2.5 block text-sm font-medium text-foreground/90">Last Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                                        <Input
                                            className="pl-10 h-12 bg-white/5 border-white/20 focus:border-primary/50 focus:bg-white/10 transition-all font-medium text-base rounded-xl shadow-sm"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSave} disabled={saving} variant="gradient">
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        {/* Notifications & Settings */}
                        <div className="space-y-4">
                            <div className="glass-card p-6 rounded-2xl border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                                        <Bell className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold">Push Notifications</h3>
                                        <p className="text-sm text-muted-foreground">Receive updates about your events</p>
                                    </div>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => { signOut(); navigate("/"); }}>
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </div>

                    </motion.div>

                    {/* Right Column: Quick Links */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl border-white/10">
                            <div className="text-center mb-6">
                                <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-brand-orange to-brand-magenta bg-clip-text text-transparent mb-1">Dewana</h3>
                                <p className="text-sm text-muted-foreground italic">Technology meets Tradition</p>
                            </div>

                            <div className="space-y-1">
                                {[
                                    { label: "Home", icon: Home, path: "/" },
                                    { label: "About", icon: Info, path: "/about" },
                                    { label: "Create Invite", icon: Calendar, path: "/create-event" },
                                    { label: "FAQ", icon: HelpCircle, path: "/faq" },
                                    { label: "Contact Us", icon: Phone, path: "/contact" },
                                    { label: "Terms & Conditions", icon: FileText, path: "/terms" },
                                    { label: "Privacy Policy", icon: Shield, path: "/privacy" },
                                ].map((link, i) => (
                                    <Button
                                        key={i}
                                        variant="ghost"
                                        className="w-full justify-between group hover:bg-primary/5 hover:text-primary"
                                        onClick={() => navigate(link.path)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            {link.label}
                                        </span>
                                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
