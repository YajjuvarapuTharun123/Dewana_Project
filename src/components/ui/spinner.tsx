import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "primary" | "secondary" | "white" | "default";
}

export function Spinner({ size = "md", variant = "default", className, ...props }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
    };

    const variantClasses = {
        default: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        white: "text-white",
    };

    return (
        <div
            role="status"
            className={cn("animate-spin", variantClasses[variant], className)}
            {...props}
        >
            <Loader2 className={cn(sizeClasses[size])} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}
