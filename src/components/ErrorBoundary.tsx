import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans text-foreground">
                    <div className="max-w-md w-full p-6 rounded-lg border border-border bg-card shadow-xl space-y-4">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertTriangle className="h-10 w-10" />
                            <h1 className="text-xl font-bold">Something went wrong</h1>
                        </div>

                        <p className="text-muted-foreground">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>

                        {this.state.error && (
                            <div className="bg-muted p-3 rounded text-xs font-mono overflow-auto max-h-40 border border-border/50">
                                <p className="font-semibold text-destructive mb-1">{this.state.error.toString()}</p>
                                {this.state.errorInfo && (
                                    <pre className="text-muted-foreground whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Reload Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
