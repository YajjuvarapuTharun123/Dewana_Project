import { useState, useEffect } from "react";

export type EventStatus = "Upcoming" | "Live" | "Completed";

export function useEventStatus(startDate: string, endDate?: string | null): EventStatus {
    const [status, setStatus] = useState<EventStatus>("Upcoming");

    useEffect(() => {
        const calculateStatus = () => {
            const now = new Date();
            const start = new Date(startDate);
            // If no end date, assume 3 hours duration for "Live" window
            const end = endDate ? new Date(endDate) : new Date(start.getTime() + 3 * 60 * 60 * 1000);

            if (now < start) {
                setStatus("Upcoming");
            } else if (now >= start && now <= end) {
                setStatus("Live");
            } else {
                setStatus("Completed");
            }
        };

        calculateStatus();
        const interval = setInterval(calculateStatus, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [startDate, endDate]);

    return status;
}
