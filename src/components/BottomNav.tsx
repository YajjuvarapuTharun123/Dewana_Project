import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, User, CalendarDays, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export function BottomNav() {
    const location = useLocation();
    const path = location.pathname;
    const unreadCount = useUnreadNotifications();

    const isActive = (p: string) => path === p;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 md:hidden pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-6 h-16 relative">

                {/* Home */}
                <Link
                    to="/dashboard"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 transition-all duration-200 w-12",
                        isActive("/dashboard")
                            ? "text-primary -translate-y-1"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LayoutDashboard className={cn("h-6 w-6 transition-transform", isActive("/dashboard") && "scale-110")} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                {/* Events */}
                <Link
                    to="/dashboard?tab=attending"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 transition-all duration-200 w-12",
                        location.search.includes("tab=attending")
                            ? "text-primary -translate-y-1"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <CalendarDays className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Events</span>
                </Link>

                {/* Create (Floating) */}
                <div className="relative -top-5">
                    <Link
                        to="/create-event"
                        className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-brand-orange to-brand-magenta text-white shadow-lg shadow-brand-orange/40 transition-transform active:scale-95 hover:-translate-y-1"
                    >
                        <Plus className="h-7 w-7" />
                    </Link>
                </div>

                {/* Notifications */}
                <Link
                    to="/notifications"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 transition-all duration-200 w-12 relative",
                        isActive("/notifications")
                            ? "text-primary -translate-y-1"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className="relative">
                        <Bell className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full animate-pulse" />
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Alerts</span>
                </Link>

                {/* Profile */}
                <Link
                    to="/profile"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 transition-all duration-200 w-12",
                        isActive("/profile")
                            ? "text-primary -translate-y-1"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <User className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
