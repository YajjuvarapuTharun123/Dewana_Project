import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  PartyPopper,
  Cake,
  Flame,
  GraduationCap,
  Baby,
  Briefcase,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  AlignLeft,
  Check,
  Link as LinkIcon,
  Video,
  Instagram,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const eventTypes = [
  { id: "wedding", name: "Wedding", emoji: "🎊", icon: PartyPopper, color: "bg-red-100 text-red-600 border-red-200" },
  { id: "birthday", name: "Birthday", emoji: "🎂", icon: Cake, color: "bg-blue-100 text-blue-600 border-blue-200" },
  { id: "festival", name: "Festival", emoji: "🪔", icon: Flame, color: "bg-orange-100 text-orange-600 border-orange-200" },
  { id: "graduation", name: "Graduation", emoji: "🎓", icon: GraduationCap, color: "bg-green-100 text-green-600 border-green-200" },
  { id: "baby-shower", name: "Baby Shower", emoji: "👶", icon: Baby, color: "bg-purple-100 text-purple-600 border-purple-200" },
  { id: "corporate", name: "Corporate", emoji: "💼", icon: Briefcase, color: "bg-gray-100 text-gray-600 border-gray-200" },
  { id: "other", name: "Other", emoji: "🎉", icon: Sparkles, color: "bg-pink-100 text-pink-600 border-pink-200" },
];

interface SubEvent {
  name: string;
  date: string;
  time: string;
  location: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

export default function CreateEvent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    eventType: "",
    eventName: "",
    hostNames: "",
    description: "",
    startDate: "",
    startTime: "",
    venueName: "",
    venueAddress: "",
    parkingNotes: "",
    dressCode: "",
    youtubeLink: "",
    googlePhotosUrl: "",
    googleDriveUrl: "",
  });

  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Redirect if not logged in
  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubEvent = () => {
    setSubEvents([...subEvents, { name: "", date: "", time: "", location: "" }]);
  };

  const updateSubEvent = (index: number, field: keyof SubEvent, value: string) => {
    const newSubEvents = [...subEvents];
    newSubEvents[index][field] = value;
    setSubEvents(newSubEvents);
  };

  const removeSubEvent = (index: number) => {
    setSubEvents(subEvents.filter((_, i) => i !== index));
  };

  const handleAddSocialLink = () => {
    if (socialLinks.length >= 5) {
      toast({ title: "Limit Reached", description: "You can add up to 5 social links.", variant: "destructive" });
      return;
    }
    setSocialLinks([...socialLinks, { platform: "Instagram", url: "" }]);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.eventType) return toast({ title: "Required", description: "Please select an event type.", variant: "destructive" });
      if (!formData.eventName) return toast({ title: "Required", description: "Please enter an event name.", variant: "destructive" });
    }
    if (currentStep === 2) {
      if (!formData.startDate) return toast({ title: "Required", description: "Please select a start date.", variant: "destructive" });
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Upload Cover Photo
      let coverImageUrl = null;
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('event-covers').upload(filePath, coverFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('event-covers').getPublicUrl(filePath);
          coverImageUrl = publicUrl;
        }
      }

      // 2. Prepare Event Data
      const startDateTime = formData.startTime ? `${formData.startDate}T${formData.startTime}:00` : `${formData.startDate}T12:00:00`;
      const baseSlug = formData.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      // 3. Insert Event
      const { data: event, error: eventError } = await supabase.from("events").insert({
        user_id: user.id,
        event_type: formData.eventType,
        event_name: formData.eventName,
        slug: slug,
        host_names: formData.hostNames || null,
        description: formData.description || null,
        start_date: startDateTime,
        venue_name: formData.venueName || null,
        venue_address: formData.venueAddress || null,
        parking_notes: formData.parkingNotes || null,
        dress_code: formData.dressCode || null,
        youtube_link: formData.youtubeLink || null,
        google_photos_url: formData.googlePhotosUrl || null,
        google_drive_url: formData.googleDriveUrl || null,
        cover_image_url: coverImageUrl,
        custom_social_links: socialLinks as any,
        status: "published",
      }).select().single();

      if (eventError) throw eventError;

      // 4. Insert Sub-events
      if (subEvents.length > 0 && event) {
        const subEventsData = subEvents.map(se => ({
          event_id: event.id,
          name: se.name,
          date_time: se.time ? `${se.date}T${se.time}:00` : `${se.date}T12:00:00`,
          location_name: se.location,
        }));
        await supabase.from('sub_events').insert(subEventsData);
      }

      // 5. Create notification for host
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: "Event Created Successfully! 🎉",
        message: `Your event "${formData.eventName}" has been published.`,
        type: "system",
        event_id: event.id,
      });

      toast({ title: "Success!", description: "Event created successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create event", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Basics" },
    { number: 2, title: "Date & Venue" },
    { number: 3, title: "Details" },
    { number: 4, title: "Review" }
  ];

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border -z-10" />
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center gap-2 bg-background px-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    currentStep >= step.number ? "bg-primary text-primary-foreground shadow-glow-orange" : "bg-muted text-muted-foreground border border-border"
                  )}>
                    {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <span className={cn("text-xs font-medium", currentStep >= step.number ? "text-foreground" : "text-muted-foreground")}>{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Concept & Basics</h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {eventTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => updateFormData("eventType", type.id)}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all hover:-translate-y-1",
                          formData.eventType === type.id ? "border-primary bg-primary/5 ring-1 ring-primary shadow-md" : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="text-3xl mb-2">{type.emoji}</div>
                        <div className="text-xs font-medium">{type.name}</div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Event Name *</Label>
                      <Input value={formData.eventName} onChange={(e) => updateFormData("eventName", e.target.value)} placeholder="e.g. Aditi's 25th Birthday" className="text-lg" />
                    </div>
                    <div>
                      <Label>Host Name(s)</Label>
                      <Input value={formData.hostNames} onChange={(e) => updateFormData("hostNames", e.target.value)} placeholder="e.g. The Sharma Family" />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">When & Where</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="date" value={formData.startDate} onChange={(e) => updateFormData("startDate", e.target.value)} className="pl-9" />
                      </div>
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <TimePicker value={formData.startTime} onChange={(val) => updateFormData("startTime", val)} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Venue Name</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input value={formData.venueName} onChange={(e) => updateFormData("venueName", e.target.value)} className="pl-9" placeholder="e.g. Grand Hyatt Mumbai" />
                      </div>
                    </div>
                    <div>
                      <Label>Venue Address</Label>
                      <Textarea value={formData.venueAddress} onChange={(e) => updateFormData("venueAddress", e.target.value)} placeholder="Full address for Google Maps..." />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Details & Media</h2>

                  <div>
                    <Label>Event Description</Label>
                    <Textarea value={formData.description} onChange={(e) => updateFormData("description", e.target.value)} placeholder="Write a warm welcome message..." className="min-h-[120px]" />
                  </div>

                  <div>
                    <Label>Cover Photo</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && setCoverFile(e.target.files[0])} />
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span>{coverFile ? coverFile.name : "Click to upload cover image"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Sub-Events / Functions</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddSubEvent}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                    </div>
                    {subEvents.map((event, i) => (
                      <div key={i} className="p-3 border rounded-lg bg-muted/20 relative mb-2">
                        <button onClick={() => removeSubEvent(i)} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-3 w-3" /></button>
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={event.name} onChange={e => updateSubEvent(i, "name", e.target.value)} placeholder="Function (e.g. Haldi)" className="h-8 text-sm" />
                          <div className="flex gap-2">
                            <Input type="date" value={event.date} onChange={e => updateSubEvent(i, "date", e.target.value)} className="h-8 text-sm flex-1" />
                            <TimePicker value={event.time} onChange={val => updateSubEvent(i, "time", val)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-brand-gold" /> Media & Social Links
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center gap-2 mb-2"><Video className="h-4 w-4" /> YouTube Link</Label>
                        <Input value={formData.youtubeLink} onChange={(e) => updateFormData("youtubeLink", e.target.value)} placeholder="https://youtube.com/..." />
                      </div>
                      <div>
                        <Label className="flex items-center gap-2 mb-2"><ImageIcon className="h-4 w-4" /> Google Photos Album</Label>
                        <Input value={formData.googlePhotosUrl} onChange={(e) => updateFormData("googlePhotosUrl", e.target.value)} placeholder="https://photos.app.goo.gl/..." />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram & Other Links</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddSocialLink}><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
                      </div>

                      <div className="space-y-2">
                        {socialLinks.map((link, i) => (
                          <div key={i} className="flex gap-2 group">
                            <Input
                              placeholder="Platform (e.g. Instagram)"
                              className="w-1/3 h-9 text-sm"
                              value={link.platform}
                              onChange={e => updateSocialLink(i, "platform", e.target.value)}
                            />
                            <Input
                              placeholder="URL"
                              className="flex-1 h-9 text-sm"
                              value={link.url}
                              onChange={e => updateSocialLink(i, "url", e.target.value)}
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeSocialLink(i)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Review & Publish</h2>

                  <div className="bg-muted/30 p-6 rounded-xl border border-border/50 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl">
                        {eventTypes.find(t => t.id === formData.eventType)?.emoji}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{formData.eventName}</h3>
                        <p className="text-muted-foreground">{formData.hostNames}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Calendar className="h-4 w-4" /> {formData.startDate} at {formData.startTime}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <MapPin className="h-4 w-4" /> {formData.venueName || "No venue set"}
                        </div>
                      </div>
                    </div>
                    {formData.description && (
                      <div className="text-sm text-muted-foreground italic border-t border-border/50 pt-3">
                        "{formData.description}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-accent/10 text-accent-foreground rounded-lg">
                    <Sparkles className="h-5 w-5" />
                    <p className="text-sm font-medium">Your event will be published immediately.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-8 flex justify-between border-t border-border/50">
              <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1 || isSubmitting}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Back
              </Button>

              {currentStep < 4 ? (
                <Button variant="default" onClick={nextStep}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button variant="gradient" onClick={handleSubmit} disabled={isSubmitting} className="shadow-glow-orange min-w-[150px]">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish Event"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
