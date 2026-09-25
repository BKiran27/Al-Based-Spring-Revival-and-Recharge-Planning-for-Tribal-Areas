import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudSentinel AI | Autonomous Cloud Security & Threat Operations",
  description: "Enterprise Cloud SecOps platform: Real-time threat detection, IAM anomaly monitoring, proactive alerting, and automated incident containment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050811] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
