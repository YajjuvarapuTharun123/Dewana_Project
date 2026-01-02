import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "subtle" | "medium" | "strong"
    hoverEffect?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = "medium", hoverEffect = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl border border-white/10 transition-all duration-300",
                    {
                        "bg-white/5 backdrop-blur-sm": variant === "subtle",
                        "bg-white/10 backdrop-blur-md shadow-lg": variant === "medium",
                        "bg-white/15 backdrop-blur-xl shadow-xl": variant === "strong",
                        "hover:-translate-y-1 hover:shadow-glow-orange hover:border-white/20": hoverEffect,
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
