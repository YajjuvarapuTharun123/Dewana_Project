import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

interface CalendarEvent {
    title: string;
    description: string;
    location: string;
    startDate: string; // ISO string
    endDate?: string;  // ISO string
}

export const generateCalendarLink = (event: CalendarEvent) => {
    const start = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    // Default duration 2 hours if no end date
    const end = event.endDate
        ? new Date(event.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "")
        : new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
};

export const addToGoogleCalendar = async (event: CalendarEvent): Promise<boolean> => {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/calendar.events");

        // Force account selection to ensure we get a fresh token if needed
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        if (!accessToken) throw new Error("No access token retrieved");

        const startTime = new Date(event.startDate).toISOString();
        const endTime = event.endDate
            ? new Date(event.endDate).toISOString()
            : new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString();

        const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                summary: event.title,
                description: event.description,
                location: event.location,
                start: {
                    dateTime: startTime,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                    dateTime: endTime,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: "popup", minutes: 30 },
                        { method: "email", minutes: 60 }
                    ]
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to add to calendar");
        }

        return true;
    } catch (error) {
        console.error("Error adding to Google Calendar:", error);
        throw error;
    }
};
