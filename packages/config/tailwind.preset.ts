import type { Config } from "tailwindcss";

export const amlbtPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        amlbt: {
          background: "#FFFFFF",
          surface: "#FFFFFF",
          muted: "#F8FAFC",
          primary: "#2584FF",
          "primary-dark": "#1867D6",
          "primary-soft": "#EAF4FF",
          text: "#0F172A",
          "text-muted": "#64748B",
          border: "#DBE3EC",
          "border-soft": "#E8EEF5",
          success: "#16A34A",
          "success-soft": "#ECFDF3",
          warning: "#D97706",
          "warning-soft": "#FFF7ED",
          danger: "#DC2626",
          "danger-soft": "#FEF2F2"
        }
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.06)",
        popover: "0 16px 38px rgba(15, 23, 42, 0.12)"
      },
      borderRadius: {
        card: "1rem",
        panel: "1.25rem",
        sheet: "1.5rem"
      }
    }
  }
};
