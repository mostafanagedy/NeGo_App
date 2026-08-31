"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { StoriesCarousel } from "@/components/feed/StoriesCarousel";
import { CreatePostBox } from "@/components/feed/CreatePostBox";
import { PostCard } from "@/components/feed/PostCard";
import { apiRequest } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";

const DEMO_POSTS = [
  {
    _id: "p1",
    author: {
      _id: "u1",
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      isVerified: true,
    },
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora voluptate consequuntur aliquid officia in eiuy dicta #technology #nego @janesmith",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
    likesCount: 24,
    commentsCount: 18,
    sharesCount: 5,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    _id: "p2",
    author: {
      _id: "u2",
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      isVerified: false,
    },
    content: "Excited to launch our new Next.js & Node.js architecture on NeGo! Building production-ready scalable platforms #programming #webdev",
    image: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&q=80&w=1000",
    likesCount: 142,
    commentsCount: 32,
    sharesCount: 12,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
];

const FEATURES = [
  {
    icon: "💬",
    title: "Real-time Messaging",
    desc: "Chat instantly with friends and groups with live updates.",
  },
  {
    icon: "🌍",
    title: "Global Communities",
    desc: "Join groups that match your interests from around the world.",
  },
  {
    icon: "🛒",
    title: "Marketplace",
    desc: "Buy and sell within your trusted social network.",
  },
  {
    icon: "🎮",
    title: "Gaming Hub",
    desc: "Connect with gamers, share clips, and find teammates.",
  },
  {
    icon: "📅",
    title: "Events",
    desc: "Discover and create events in your community.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    desc: "Stay updated with what matters most to you.",
  },
];

const STATS = [
  { value: "10M+", label: "Active Users" },
  { value: "50M+", label: "Posts Shared" },
  { value: "120+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 128 128" aria-label="NeGo Logo">
              <g fill="#F4A100">
                <path d="M18 22 L64 10 L64 84 Q64 87 62 89 L34 114 Q32.5 115.5 31 115.5 Q28.5 115.5 28.5 112.5 L28.5 46 L18 35 Z" />
                <path d="M74 22 L102 12 L112 22 L112 84 Q112 86.5 110.5 88.5 L82 116 L74 123 Z" />
                <rect x="66" y="40" width="8" height="22" rx="2" transform="skewX(-15)" />
              </g>
            </svg>
            <span className="text-xl font-black">
              <span className="text-gray-900 dark:text-white">Ne</span>
              <span className="text-blue-600">Go</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link href="/register" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition shadow-md">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 flex flex-col items-center text-center gap-8">
          <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full tracking-widest uppercase border border-blue-100 dark:border-blue-800">
            🚀 Next-Generation Social Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Connect. Share.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Belong.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            NeGo brings people together through real conversations, vibrant communities, and experiences that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-500/30 transition hover:scale-105 active:scale-95"
            >
              سجّل الآن — مجاناً 🎉
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-2xl text-base transition"
            >
              تسجيل الدخول
            </Link>
          </div>

          {/* Mock UI preview */}
          <div className="mt-8 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">nego.app/feed</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200"
              alt="NeGo App Preview"
              className="w-full object-cover h-64 md:h-80"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 dark:bg-blue-700 py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black">{s.value}</div>
              <div className="text-sm font-medium text-blue-100 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Everything you need</h2>
            <p className="text-gray-500 dark:text-gray-400">One platform. Endless possibilities.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to join NeGo?</h2>
          <p className="text-blue-100 mb-8 text-lg">Millions of people are already connecting. Don't miss out.</p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-black rounded-2xl text-lg shadow-xl hover:scale-105 active:scale-95 transition"
          >
            سجّل الآن مجاناً 🚀
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800">
        © {new Date().getFullYear()} NeGo. All rights reserved.
      </footer>
    </div>
  );
}

function HomeFeed() {
  const [posts, setPosts] = useState<any[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiRequest("/feed");
        if (res.success && res.data?.length > 0) setPosts(res.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const handlePostCreated = (newPost: any) => setPosts((prev) => [newPost, ...prev]);

  return (
    <AppShell>
      <section className="mx-auto max-w-2xl">
        <StoriesCarousel />
        <CreatePostBox onPostCreated={handlePostCreated} />
        {loading && posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 text-center text-sm text-gray-400">
            Loading personalized feed...
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isLoggedIn = !!user && !!(typeof window !== "undefined" && localStorage.getItem("nego_token"));
  return isLoggedIn ? <HomeFeed /> : <LandingPage />;
}
