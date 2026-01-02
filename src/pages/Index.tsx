import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Sparkles,
  QrCode,
  Users,
  Calendar,
  MapPin,
  Share2,
  CheckCircle2,
  ArrowRight,
  Star,
  Play
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Sparkles,
    title: "Beautiful Templates",
    description: "Stunning designs inspired by Indian traditions for every celebration",
    color: "text-brand-orange"
  },
  {
    icon: QrCode,
    title: "QR Code Invites",
    description: "Generate beautiful QR codes to share your invitations easily",
    color: "text-brand-magenta"
  },
  {
    icon: Users,
    title: "RSVP Tracking",
    description: "Track guest responses, meal preferences, and plus-ones effortlessly",
    color: "text-brand-gold"
  },
  {
    icon: Calendar,
    title: "Multi-Event Support",
    description: "Add sub-events like Haldi, Mehendi, Sangeet all in one invite",
    color: "text-brand-blue"
  },
  {
    icon: MapPin,
    title: "Venue Integration",
    description: "Integrate Google Maps for easy navigation to your venue",
    color: "text-brand-emerald"
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share via WhatsApp, social media, or direct link in seconds",
    color: "text-brand-rose"
  }
];

const eventTypes = [
  { emoji: "🎊", name: "Wedding", color: "from-brand-orange to-brand-magenta" },
  { emoji: "🎂", name: "Birthday", color: "from-brand-rose to-brand-magenta" },
  { emoji: "🪔", name: "Festival", color: "from-brand-gold to-brand-orange" },
  { emoji: "🎓", name: "Graduation", color: "from-brand-blue to-brand-emerald" },
  { emoji: "👶", name: "Baby Shower", color: "from-brand-rose to-brand-gold" },
  { emoji: "💼", name: "Corporate", color: "from-gray-600 to-gray-800" },
];

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-magenta/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 hover:bg-white/10 transition-colors cursor-default"
            >
              <Star className="h-4 w-4 text-brand-gold fill-brand-gold" />
              <span className="text-sm font-medium bg-gradient-to-r from-brand-gold to-brand-orange bg-clip-text text-transparent">
                Trusted by 10,000+ Celebrations
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[1.1]"
            >
              Create Unforgettable <br />
              <span className="text-gradient-primary">Digital Invitations</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed"
            >
              Where <span className="text-foreground font-medium">Technology</span> meets <span className="text-foreground font-medium">Tradition</span>.
              Craft stunning, AI-powered invitations with real-time RSVP tracking and guest management.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl" className="group min-w-[200px] shadow-glow-orange">
                  Start for Free
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="group min-w-[200px] backdrop-blur-sm bg-background/50 hover:bg-background/80">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Event Types Pill Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-20 flex flex-wrap justify-center gap-3"
            >
              {eventTypes.map((event, index) => (
                <div
                  key={event.name}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 backdrop-blur-md border border-white/5 hover:border-brand-orange/30 transition-all hover:-translate-y-1 cursor-default shadow-sm"
                >
                  <span className="text-xl">{event.emoji}</span>
                  <span className="text-sm font-medium">{event.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful features designed for modern celebrations and traditional values.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="glass-card p-8 rounded-2xl hover:border-brand-orange/20 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works (Steps) */}
      <section className="py-24 bg-white/2 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Create in <span className="text-gradient-gold">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Choose & Customize", desc: "Select a template and personalize it with your details." },
              { step: "02", title: "Add Event Details", desc: "Set location, time, and multiple sub-events like Haldi." },
              { step: "03", title: "Share & Track", desc: "Send via WhatsApp or QR code and watch RSVPs roll in." },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index !== 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-border to-transparent -z-10 opacity-30" />
                )}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-magenta flex items-center justify-center text-white text-xl font-bold font-display shadow-glow-orange mx-auto mb-6 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-orange/5 to-transparent" />
        <div className="absolute inset-0 pattern-grid opacity-10" />

        <div className="container mx-auto px-4 relative text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to <span className="text-gradient-primary">Celebrate?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of happy families. Create your first digital invitation today.
          </p>

          <Link to="/auth?mode=signup">
            <Button variant="hero" size="xl" className="min-w-[240px] shadow-glow-orange group rounded-full text-lg h-16">
              Create Free Invitation
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            {["No credit card needed", "Instant setup", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-emerald" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
