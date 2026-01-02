import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function Contact() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4 max-w-5xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-display font-bold mb-6 text-center"
                >
                    Contact Us
                </motion.h1>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-8 space-y-8 rounded-2xl border-white/10"
                    >
                        <div>
                            <h3 className="text-2xl font-heading font-semibold mb-2">Get in Touch</h3>
                            <p className="text-muted-foreground">
                                Have questions, feedback, or need help with your event? We'd love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <span className="text-lg">support@dewana.com</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <span className="text-lg">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <span className="text-lg">Bangalore, India</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-2xl border-white/10"
                    >
                        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Name" className="bg-white/5 border-white/10 focus:border-primary" />
                                <Input placeholder="Email" type="email" className="bg-white/5 border-white/10 focus:border-primary" />
                            </div>
                            <Input placeholder="Subject" className="bg-white/5 border-white/10 focus:border-primary" />
                            <Textarea placeholder="Message" className="min-h-[150px] bg-white/5 border-white/10 focus:border-primary" />
                            <Button variant="gradient" className="w-full h-12 text-lg">
                                Send Message <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
