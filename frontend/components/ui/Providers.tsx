"use client";
// components/ui/Providers.tsx
import { ResumeProvider } from "@/hooks/useResumeStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ResumeProvider>{children}</ResumeProvider>;
}
