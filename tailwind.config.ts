import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--bg-primary))", // Updated to new variable
        foreground: "hsl(var(--text-primary))", // Updated to new variable
        primary: {
          DEFAULT: "hsl(var(--brand-orange))",
          foreground: "#ffffff",
          hover: "hsl(var(--brand-orange-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--brand-magenta))",
          foreground: "#ffffff",
          hover: "hsl(var(--brand-magenta-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--error))",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--bg-tertiary))",
          foreground: "hsl(var(--text-tertiary))",
        },
        accent: {
          DEFAULT: "hsl(var(--brand-gold))",
          foreground: "#13141A",
          hover: "hsl(var(--brand-gold-hover))",
        },
        popover: {
          DEFAULT: "hsl(var(--bg-tertiary))",
          foreground: "hsl(var(--text-primary))",
        },
        card: {
          DEFAULT: "hsl(var(--bg-secondary))",
          foreground: "hsl(var(--text-primary))",
        },
        // Custom Brand Colors
        brand: {
          orange: {
            DEFAULT: "hsl(var(--brand-orange))",
            hover: "hsl(var(--brand-orange-hover))",
            light: "hsl(var(--brand-orange-light))",
            dark: "hsl(var(--brand-orange-dark))",
          },
          magenta: {
            DEFAULT: "hsl(var(--brand-magenta))",
            hover: "hsl(var(--brand-magenta-hover))",
            light: "hsl(var(--brand-magenta-light))",
          },
          gold: {
            DEFAULT: "hsl(var(--brand-gold))",
            hover: "hsl(var(--brand-gold-hover))",
            light: "hsl(var(--brand-gold-light))",
          },
          emerald: "hsl(var(--brand-emerald))",
          blue: "hsl(var(--brand-blue))",
          rose: "hsl(var(--brand-rose))",
        },
        // Semantic Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          bg: "hsl(var(--success-bg))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          bg: "hsl(var(--warning-bg))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          bg: "hsl(var(--error-bg))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          bg: "hsl(var(--info-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        "glow-orange": "var(--shadow-glow-orange)",
        "glow-magenta": "var(--shadow-glow-magenta)",
        "glow-gold": "var(--shadow-glow-gold)",
        focus: "var(--shadow-focus)",
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsla(18, 100%, 60%, 0.3)" },
          "50%": { boxShadow: "0 0 40px hsla(18, 100%, 60%, 0.5)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
