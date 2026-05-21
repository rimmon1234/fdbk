import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        card: "var(--card)",
        ring: "var(--ring)",
        input: "var(--input)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        border: "var(--border)",
        popover: "var(--popover)",
        primary: "var(--primary)",
        sidebar: "var(--sidebar)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        destructive: "var(--destructive)",
        "sidebar-ring": "var(--sidebar-ring)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-border": "var(--sidebar-border)",
        "card-foreground": "var(--card-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "muted-foreground": "var(--muted-foreground)",
        "accent-foreground": "var(--accent-foreground)",
        "popover-foreground": "var(--popover-foreground)",
        "primary-foreground": "var(--primary-foreground)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "secondary-foreground": "var(--secondary-foreground)",
        "destructive-foreground": "var(--destructive-foreground)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
};

export default config;
