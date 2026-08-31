"use client";

import React from "react";
import Link from "next/link";
import { Hash, Users, Sparkles } from "lucide-react";

export const RightSidebar = () => {
  const onlineFriends = [
    {
      id: "1",
      name: "Jane Smith",
      username: "janesmith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      status: "Active now",
    },
    {
      id: "2",
      name: "Mike Johnson",
      username: "mikej",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "Active 5m ago",
    },
    {
      id: "3",
      name: "Sarah Wilson",
      username: "sarahw",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      status: "Active now",
    },
    {
      id: "4",
      name: "Tom Brown",
      username: "tombrown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      status: "Active 15m ago",
    },
  ];

  const trendingTags = [
    { tag: "technology", count: "12.4k posts" },
    { tag: "programming", count: "8.9k posts" },
    { tag: "nego", count: "15.2k posts" },
    { tag: "reactjs", count: "6.1k posts" },
  ];

  return (
    <aside className="w-72 shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pl-2 space-y-4">
      {/* Online Friends Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Online Friends
          </h3>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        <div className="space-y-3">
          {onlineFriends.map((friend) => (
            <Link
              key={friend.id}
              href={`/profile/${friend.username}`}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group"
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {friend.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{friend.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Trending Topics
          </h3>
        </div>
        <div className="space-y-2.5">
          {trendingTags.map((item) => (
            <div key={item.tag} className="flex items-center justify-between text-sm group cursor-pointer">
              <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                #{item.tag}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
