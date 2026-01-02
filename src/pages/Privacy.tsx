import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-display font-bold mb-8 text-center"
                >
                    Privacy Policy
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 rounded-2xl border-white/10 prose dark:prose-invert max-w-none text-muted-foreground"
                >
                    <h3 className="text-foreground mt-0">1. Information We Collect</h3>
                    <p>At Dewana, we collect information to provide better services to our users. This includes:</p>
                    <ul>
                        <li><strong>Account Information:</strong> When you sign in with Google, we collect your name, email address, and profile picture.</li>
                        <li><strong>Event Content:</strong> Information you provide when creating events, including titles, descriptions, dates, locations, and images.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our service, such as views on your event invites.</li>
                    </ul>

                    <h3 className="text-foreground">2. How We Use Information</h3>
                    <p>We use the collected information to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Personalize your experience (e.g., displaying your profile).</li>
                        <li>Send service-related notifications and updates.</li>
                        <li>Ensure security and prevent fraud.</li>
                    </ul>

                    <h3 className="text-foreground">3. Information Sharing</h3>
                    <p>We do not sell your personal information. We share information only in the following cases:</p>
                    <ul>
                        <li><strong>With Your Consent:</strong> When you share an event invite link, the event details are visible to anyone with the link.</li>
                        <li><strong>Service Providers:</strong> We use third-party services like Supabase and Firebase for database, authentication, and notifications.</li>
                        <li><strong>Legal Requirements:</strong> If required by law or to protect our rights.</li>
                    </ul>

                    <h3 className="text-foreground">4. Your Data Rights</h3>
                    <p>You have the right to access, update, or delete your personal information at any time. You can manage your profile settings or delete your events directly through the dashboard. If you wish to delete your entire account, please contact us.</p>

                    <h3 className="text-foreground">5. Security</h3>
                    <p>We use industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

                    <h3 className="text-foreground">6. Changes to This Policy</h3>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

                    <p className="mt-8 text-sm italic">Last Updated: January 2, 2026</p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
