"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Users,
  ShoppingBag,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  CheckCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/common/Logo";
import { resolveImageUrl } from "@/lib/api";
import { useNotifications, NOTIF_ICONS, NOTIF_COLORS, NotifType } from "@/context/NotificationsContext";

export const Header = () => {
  const { user } = useAuth();
  const { notifs, unreadCount, markRead, markAllRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node))
        setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSearch(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!val.trim()) { setSearchResults([]); setShowSearch(false); return; }
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/v1/users/search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSearchResults(data.users || []);
        setShowSearch(true);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 350);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("nego_theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    if (nextState) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("nego_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("nego_theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xs sm:max-w-sm">
          <Link href="/" className="hover:opacity-95 transition">
            <Logo size={36} />
          </Link>


          <div className="relative flex-1 hidden sm:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              placeholder="Search people..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {showSearch && (
              <div className="absolute top-11 left-0 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                {searchLoading ? (
                  <div className="px-4 py-3 text-xs text-gray-400 text-center">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-400 text-center">No results found</div>
                ) : (
                  searchResults.map((u) => (
                    <Link
                      key={u._id}
                      href={`/profile/${u.username}`}
                      onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <img
                        src={u.profilePicture ? `http://localhost:5000${u.profilePicture}` : `https://i.pravatar.cc/150?u=${u._id}`}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {u.firstName} {u.lastName}
                          {u.isVerified && <span className="ml-1 text-blue-500">✓</span>}
                        </p>
                        <p className="text-xs text-gray-400 truncate">@{u.username}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Main Navigation Icons */}
        <div className="hidden md:flex items-center gap-1 sm:gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/30 transition"
            title="Feed"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/friends"
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition"
            title="Friends"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/marketplace"
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition"
            title="Marketplace"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>

        {/* Right: Actions, Badges & Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifsRef}>
            <button
              onClick={() => setShowNotifs((v) => !v)}
              className="relative p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">Notifications</span>
                  <button onClick={markAllRead} disabled={unreadCount === 0} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold disabled:opacity-40 hover:underline">
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/40">
                  {notifs.map((n) => {
                    const Icon = NOTIF_ICONS[n.type];
                    return (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left transition ${
                          n.unread ? "bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/50" : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img src={n.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                          <span className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white dark:border-gray-800 text-white ${NOTIF_COLORS[n.type]}`}>
                            <Icon className="w-2.5 h-2.5" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-100 leading-snug">{n.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifs(false)}
                  className="block text-center text-xs font-semibold text-blue-600 dark:text-blue-400 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 border-t border-gray-100 dark:border-gray-700 transition"
                >
                  See all notifications
                </Link>
              </div>
            )}
          </div>

          {/* Messages Icon */}
          <Link
            href="/messages"
            className="relative p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Pill */}
          {user ? (
            <div className="flex items-center gap-2 pl-2">
              <Link href={`/profile/${user.username}`} className="flex items-center gap-2 hover:opacity-90 transition">
                <img
                  src={resolveImageUrl(user.profilePicture) || "https://i.pravatar.cc/150?img=3"}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-full object-cover border border-blue-500"
                />
                <span className="hidden sm:inline font-semibold text-sm text-gray-800 dark:text-gray-200">
                  {user.firstName} {user.lastName}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
