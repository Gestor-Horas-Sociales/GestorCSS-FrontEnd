export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const COLORS = {
  primary: "#2563EB",
  secondary: "#64748B",
  background: "#FFFFFF",
  foreground: "#0F172A",
  border: "#E2E8F0",
  destructive: "#EF4444",
  muted: "#F1F5F9",
  mutedForeground: "#64748B",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
