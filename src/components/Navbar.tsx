import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { usePWA } from "@/contexts/PWAContext";
import { Menu, X, LogOut, LayoutDashboard, User, Download, Plus, Bell, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";

import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { deferredPrompt, showInstallPrompt, isIOS } = usePWA();
  const unreadCount = useUnreadNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Logic handled in PWAInstallBanner
    }
    await showInstallPrompt();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isAuthPage = location.pathname.startsWith('/auth');
  if (isAuthPage) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {(deferredPrompt || isIOS) && (
                <Button variant="outline" size="sm" className="gap-2 hidden lg:flex" onClick={handleInstallClick}>
                  <Download className="h-4 w-4" />
                  Install App
                </Button>
              )}

              {user ? (
                <>
                  <Link to="/create-event">
                    <Button variant="gradient" size="sm" className="gap-2 shadow-glow-orange">
                      <Plus className="h-4 w-4" /> Create Event
                    </Button>
                  </Link>

                  <Link to="/dashboard">
                    <Button variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} size="sm" className="gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>

                  <Link to="/notifications">
                    <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
                      )}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-heading font-medium">
                            {getInitials(user.user_metadata?.name || user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl">
                      <div className="px-2 py-1.5 text-sm font-semibold">
                        {user.user_metadata?.name || 'User'}
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button variant="gradient" className="shadow-lg shadow-primary/20">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 animate-in slide-in-from-top-2 p-4 shadow-xl h-screen z-40">
              {(deferredPrompt || isIOS) && (
                <div className="mb-6">
                  <Button variant="outline" className="w-full gap-2" onClick={handleInstallClick}>
                    <Download className="h-4 w-4" />
                    Install App
                  </Button>
                </div>
              )}
              {user ? (
                <div className="space-y-4">
                  <Link to="/create-event" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="gradient" className="w-full justify-center gap-2 h-12 text-base">
                      <Plus className="h-5 w-5" />
                      Create New Event
                    </Button>
                  </Link>

                  <div className="space-y-2">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                        <User className="h-5 w-5" />
                        My Profile
                      </Button>
                    </Link>
                    <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                        <Settings className="h-5 w-5" />
                        Settings
                      </Button>
                    </Link>
                  </div>

                  <div className="h-px bg-border/50 my-2" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-12 text-base"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center h-12 text-base">Sign In</Button>
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="gradient" className="w-full justify-center h-12 text-base">Create Free Invite</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      {user && <BottomNav />}
    </>
  );
}
