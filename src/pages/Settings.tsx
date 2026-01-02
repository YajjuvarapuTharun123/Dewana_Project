import { useState, useEffect } from "react";
import { flushSync } from 'react-dom';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, User, Bell, HelpCircle, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Settings() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return saved ? saved === 'dark' : true;
        }
        return true;
    });

    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'dark';
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    }, []);

    return (
        <div className="min-h-screen bg-background relative pb-20 lg:pb-0 font-body">
            <Navbar />
            <Sidebar />

            <main className="lg:pl-64 pt-24 px-4 pb-8 container mx-auto max-w-2xl">
                <h1 className="text-3xl font-display font-bold mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* Account */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 rounded-xl">
                        <h2 className="text-lg font-heading font-semibold mb-4 px-2">Account</h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-between h-auto py-3 px-3 hover:bg-muted/50 rounded-lg group" onClick={() => navigate("/profile")}>
                                <span className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg"><User className="h-4 w-4" /></div>
                                    <div className="text-left">
                                        <div className="font-medium">Profile Details</div>
                                        <div className="text-xs text-muted-foreground">Manage your name and email</div>
                                    </div>
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* App Settings */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 rounded-xl">
                        <h2 className="text-lg font-heading font-semibold mb-4 px-2">Preferences</h2>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={(e) => {
                            const newTheme = !isDarkMode ? 'dark' : 'light';

                            // View Transition for Zomato-like effect
                            if (!(document as any).startViewTransition) {
                                setIsDarkMode(!isDarkMode);
                                localStorage.setItem('theme', newTheme);
                                if (newTheme === 'dark') {
                                    document.documentElement.classList.add('dark');
                                    document.documentElement.classList.remove('light');
                                } else {
                                    document.documentElement.classList.remove('dark');
                                    document.documentElement.classList.add('light');
                                }
                                return;
                            }

                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            const x = rect.left + rect.width / 2;
                            const y = rect.top + rect.height / 2;
                            const endRadius = Math.hypot(
                                Math.max(x, innerWidth - x),
                                Math.max(y, innerHeight - y)
                            );

                            const transition = (document as any).startViewTransition(() => {
                                flushSync(() => {
                                    setIsDarkMode(!isDarkMode);
                                    const newThemeState = !isDarkMode ? 'dark' : 'light';
                                    localStorage.setItem('theme', newThemeState);
                                    if (newThemeState === 'dark') {
                                        document.documentElement.classList.add('dark');
                                        document.documentElement.classList.remove('light');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                        document.documentElement.classList.add('light');
                                    }
                                });
                            });

                            transition.ready.then(() => {
                                document.documentElement.animate(
                                    [
                                        { clipPath: `circle(0px at ${x}px ${y}px)` },
                                        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
                                    ],
                                    {
                                        duration: 500,
                                        easing: "ease-in-out",
                                        pseudoElement: "::view-transition-new(root)",
                                    }
                                );
                            });

                        }}>
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Moon className="h-4 w-4" /></div>
                                <div className="text-left">
                                    <div className="font-medium">Dark Mode</div>
                                    <div className="text-xs text-muted-foreground">Adjust appearance</div>
                                </div>
                            </span>
                            <Switch checked={isDarkMode} onCheckedChange={(checked) => {
                                // Optional: Add same logic here if needed, but the parent click usually handles row clicks
                                // For now we keep this simple to avoid double toggle issues
                            }} className="pointer-events-none" /> {/* Disable interaction on switch to let parent handle it with coords */}
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/profile")}>
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 text-accent rounded-lg"><Bell className="h-4 w-4" /></div>
                                <div className="text-left">
                                    <div className="font-medium">Notifications</div>
                                    <div className="text-xs text-muted-foreground">Manage push alerts</div>
                                </div>
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Support */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 rounded-xl">
                        <h2 className="text-lg font-heading font-semibold mb-4 px-2">Support & Legal</h2>
                        <Button variant="ghost" className="w-full justify-between h-auto py-3 px-3 hover:bg-muted/50 rounded-lg group" onClick={() => navigate("/faq")}>
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-muted text-muted-foreground rounded-lg"><HelpCircle className="h-4 w-4" /></div>
                                <div className="font-medium">Help & FAQ</div>
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" className="w-full justify-between h-auto py-3 px-3 hover:bg-muted/50 rounded-lg group" onClick={() => navigate("/terms")}>
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-muted text-muted-foreground rounded-lg"><FileText className="h-4 w-4" /></div>
                                <div className="font-medium">Terms of Service</div>
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </Button>
                    </motion.div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
