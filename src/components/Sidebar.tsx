import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Plus, User, CalendarDays, Bell, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export function Sidebar() {
    const location = useLocation();
    const { signOut } = useAuth();
    const unreadCount = useUnreadNotifications();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="bg-sidebar border-r border-sidebar-border w-64 min-h-screen py-6 px-4 hidden lg:flex flex-col fixed left-0 top-16 bottom-0 z-40">
            <div className="space-y-2 flex-1">
                <SidebarItem icon={<LayoutDashboard />} label="Dashboard" href="/dashboard" active={isActive("/dashboard")} />
                <SidebarItem icon={<CalendarDays />} label="My Events" href="/dashboard?tab=attending" active={location.search.includes("tab=attending")} />
                <SidebarItem icon={<Bell />} label="Notifications" href="/notifications" active={isActive("/notifications")} badge={unreadCount} />
                <SidebarItem icon={<User />} label="Profile" href="/profile" active={isActive("/profile")} />
                <SidebarItem icon={<Settings />} label="Settings" href="/settings" active={isActive("/settings")} />
            </div>

            <div className="mt-auto pt-6 border-t border-sidebar-border space-y-4">
                <Link to="/create-event">
                    <Button variant="gradient" className="w-full justify-start gap-3 shadow-glow-orange">
                        <Plus className="h-5 w-5" /> Create Event
                    </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive" onClick={() => signOut()}>
                    <LogOut className="h-5 w-5" /> Sign Out
                </Button>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, href, active, badge }: { icon: React.ReactNode, label: string, href: string, active?: boolean, badge?: number }) {
    return (
        <Link to={href}>
            <Button
                variant={active ? "secondary" : "ghost"}
                className={cn(
                    "w-full justify-start gap-3 mb-1 relative",
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {/* Clone icon to enforce size if needed, or rely on parent styles */}
                <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
                {label}
                {badge && badge > 0 ? (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
                        {badge > 99 ? '99+' : badge}
                    </span>
                ) : null}
            </Button>
        </Link>
    );
}
