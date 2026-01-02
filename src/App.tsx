import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useFcmToken } from "@/hooks/useFcmToken";
import { onMessage, messaging } from "@/lib/firebase";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventView from "./pages/EventView";
import EditEvent from "./pages/EditEvent";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import CompleteProfile from "./pages/CompleteProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

import { PWAProvider } from "@/contexts/PWAContext";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

const queryClient = new QueryClient();

function ThemeInit() {
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
  return null;
}

function FCMHandler() {
  const { token } = useFcmToken();

  useEffect(() => {
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast({
          title: payload.notification?.title || "New Notification",
          description: payload.notification?.body || "",
        });
      });

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PWAProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallBanner />
          <FCMHandler />
          <ThemeInit />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:slug" element={<EventView />} />
              <Route path="/edit-event/:id" element={<EditEvent />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PWAProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
