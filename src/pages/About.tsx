import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function About() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-display font-bold mb-6 text-center"
                >
                    About Dewana
                </motion.h1>
                <div className="prose dark:prose-invert mx-auto max-w-none">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground mb-8 text-center"
                    >
                        Reimagining how we celebrate life's special moments.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-2xl space-y-6 text-lg leading-relaxed border-white/10"
                    >
                        <p>
                            Dewana is your digital companion for creating stunning, personalized event invitations.
                            Whether it's a wedding, birthday, or a casual get-together, we believe every event
                            deserves a beautiful beginning.
                        </p>
                        <p>
                            Our mission is to replace clunky, outdated invitation methods with a seamless,
                            mobile-first experience that delights both hosts and guests.
                        </p>
                        <p>
                            Founded with love and a passion for design, Dewana brings the elegance of traditional
                            invitations to the digital age, blending technology with tradition.
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
