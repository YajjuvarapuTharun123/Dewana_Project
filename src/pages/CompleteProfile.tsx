import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function CompleteProfile() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "" });

    useEffect(() => {
        if (!loading && !user) navigate("/auth");
    }, [user, loading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast({ title: "Missing Information", description: "Please enter your full name.", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            const { error } = await supabase.from("profiles").update({
                first_name: formData.firstName,
                last_name: formData.lastName,
                name: fullName,
            }).eq("id", user.id);

            if (error) throw error;
            await supabase.auth.updateUser({ data: { name: fullName, full_name: fullName } });

            toast({ title: "Welcome to Dewana!", description: "Profile setup complete." });
            navigate("/dashboard");
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            <div className="absolute top-0 left-0 p-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 rounded-3xl border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
                    <div className="flex justify-center mb-8">
                        <Logo />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-display font-bold mb-2">Almost There!</h1>
                        <p className="text-muted-foreground text-sm">Please complete your profile to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</Label>
                            <Input value={user?.email || ""} disabled className="bg-white/5 border-white/10 text-muted-foreground" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input
                                    placeholder="Enter first name"
                                    className="bg-white/5 border-white/10 focus:border-primary/50"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    placeholder="Enter last name"
                                    className="bg-white/5 border-white/10 focus:border-primary/50"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="hero" className="w-full h-12 mt-4 shadow-glow-orange" disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin" /> : "Complete Setup"}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
