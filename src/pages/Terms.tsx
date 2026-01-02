import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Terms() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-display font-bold mb-8 text-center"
                >
                    Terms & Conditions
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 rounded-2xl border-white/10 prose dark:prose-invert max-w-none text-muted-foreground"
                >
                    <h3 className="text-foreground mt-0">1. Introduction</h3>
                    <p>Welcome to Dewana. By using our website and services, you agree to these terms and conditions. If you do not agree to these terms, please do not use our services.</p>

                    <h3 className="text-foreground">2. Use of Service</h3>
                    <p>You agree to use Dewana only for lawful purposes and in accordance with these Terms. You are prohibited from using the site to solicit others to perform or participate in any unlawful acts.</p>

                    <h3 className="text-foreground">3. User Accounts</h3>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.</p>

                    <h3 className="text-foreground">4. Content</h3>
                    <p>You retain ownership of the content you upload (images, text, event details), but grant us a license to display, reproduce, and distribute it for the purpose of providing the service (e.g., showing your invite to guests).</p>

                    <h3 className="text-foreground">5. Privacy</h3>
                    <p>Your use of Dewana is also governed by our Privacy Policy. We respect your privacy and process your personal data in accordance with applicable laws.</p>

                    <h3 className="text-foreground">6. Termination</h3>
                    <p>We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
