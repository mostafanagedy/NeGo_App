"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageSquare,
  ShoppingBag,
  UsersRound,
  Bell,
  Calendar,
  Gamepad2,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resolveImageUrl } from "@/lib/api";

export const LeftSidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { label: "Feed", icon: Home, href: "/", color: "text-blue-500" },
    { label: "Friends", icon: Users, href: "/friends", color: "text-purple-500" },
    { label: "Messages", icon: MessageSquare, href: "/messages", color: "text-green-500" },
    { label: "Marketplace", icon: ShoppingBag, href: "/marketplace", color: "text-orange-500" },
    { label: "Groups", icon: UsersRound, href: "/groups", color: "text-rose-500" },
    { label: "Notifications", icon: Bell, href: "/notifications", color: "text-pink-500" },
  ];

  const shortcuts = [
    { label: "Events", icon: Calendar, href: "/events", color: "text-yellow-500" },
    { label: "Gaming", icon: Gamepad2, href: "/gaming", color: "text-indigo-500" },
    { label: "Saved Posts", icon: Bookmark, href: "/saved", color: "text-blue-600" },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-2">
      {/* User Card */}
      {user && (
        <Link href={`/profile/${user.username}`} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 mb-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
          <img
            src={resolveImageUrl(user.profilePicture) || "https://i.pravatar.cc/150?img=3"}
            alt={user.firstName}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-400 truncate">@{user.username}</p>
          </div>
        </Link>
      )}

      {/* Menu Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 mb-4">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
          Menu
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Shortcuts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
          Your Shortcuts
        </h3>
        <nav className="space-y-1">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
