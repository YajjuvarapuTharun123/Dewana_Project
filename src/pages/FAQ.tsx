import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQ() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4 max-w-3xl">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-display font-bold mb-8 text-center"
                >
                    Frequently Asked Questions
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 md:p-8 rounded-2xl border-white/10"
                >
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-white/10">
                            <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">Is Dewana free to use?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Yes! Creating events, sending invitations, and collecting RSVPs is completely free for all users.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b-white/10">
                            <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">Can I edit my event after publishing?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Absolutely. You can update your event details, location, or schedule at any time from your dashboard, and guests will see the changes instantly.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-b-white/10">
                            <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">How do guests RSVP?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Guests receive a link to your beautiful event page where they can enter their name, email, and guest count to confirm attendance. No login required for them!
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-b-white/10">
                            <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">Can I add multiple sub-events?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Yes, perfectly suited for Indian weddings or multi-day conferences. You can add Haldi, Sangeet, Reception etc. as separate sub-events within the main invite.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5" className="border-none">
                            <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">Can I export my guest list?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Currently, you can view your guest list on the dashboard. We are working on an export to Excel/CSV feature which will be available soon!
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
