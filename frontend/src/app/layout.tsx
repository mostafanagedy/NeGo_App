import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";

export const metadata: Metadata = {
  title: "NeGo - Next-Generation Social Media Platform",
  description: "Connect, share, react, and engage with friends and communities on NeGo.",
  icons: {
    icon: "/icon.svg",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#f0f2f5] dark:bg-[#18191a] text-gray-900 dark:text-gray-100 font-sans transition-colors" suppressHydrationWarning>
        <AuthProvider><NotificationsProvider>{children}</NotificationsProvider></AuthProvider>
      </body>
    </html>

  );
}
