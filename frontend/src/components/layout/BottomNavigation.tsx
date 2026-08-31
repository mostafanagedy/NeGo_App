"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, MessageSquare, Settings, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resolveImageUrl } from "@/lib/api";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-semibold transition-colors ${
                active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              <span className={`rounded-lg p-1 ${active ? "bg-blue-50 dark:bg-blue-950/50" : ""}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Profile Tab */}
        {user && (
          <Link
            href={`/profile/${user.username}`}
            className={`flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-semibold transition-colors ${
              pathname === `/profile/${user.username}` ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <span className={`rounded-lg p-1 ${pathname === `/profile/${user.username}` ? "bg-blue-50 dark:bg-blue-950/50" : ""}`}>
              <img
                src={resolveImageUrl(user.profilePicture) || "https://i.pravatar.cc/150?img=3"}
                alt={user.firstName}
                className="h-5 w-5 rounded-full object-cover border border-blue-500"
              />
            </span>
            Me
          </Link>
        )}
      </div>
    </nav>
  );
}
