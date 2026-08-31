"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, UserCheck, Users, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest, resolveImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function FriendsPage() {
  const { user: me } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load suggestions on mount (search with empty-ish query to get users)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiRequest("/users/search?q=a");
        if (res.success) setSuggestions(res.users || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (timer.current) clearTimeout(timer.current);
    if (!val.trim()) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/users/search?q=${encodeURIComponent(val)}`);
        if (res.success) setResults(res.users || []);
      } catch {}
      finally { setLoading(false); }
    }, 350);
  };

  const toggleFollow = async (userId: string) => {
    const isFollowed = followed[userId];
    setFollowed((prev) => ({ ...prev, [userId]: !isFollowed }));
    try {
      await apiRequest(`/users/${isFollowed ? "unfollow" : "follow"}/${userId}`, { method: "PUT" });
    } catch {
      setFollowed((prev) => ({ ...prev, [userId]: isFollowed }));
    }
  };

  const displayList = query.trim() ? results : suggestions.filter((u) => u._id !== me?.id && u._id !== me?._id);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Find People</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Search by name or username and follow people.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              {loading && query && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
              )}
              <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or @username"
                className="w-full rounded-xl bg-gray-100 py-2.5 pl-9 pr-9 text-sm outline-none ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              {query.trim() ? `Results for "${query}"` : "People you may know"}
            </h2>
            <span className="text-sm text-gray-400">{displayList.length} people</span>
          </div>

          {loading && !query && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {!loading && displayList.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              {query ? "No users found. Try a different name." : "No suggestions available."}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayList.map((u) => {
              const isFollowed = followed[u._id];
              return (
                <article
                  key={u._id}
                  className="rounded-2xl border border-gray-100 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700"
                >
                  <Link href={`/profile/${u.username}`}>
                    <img
                      src={resolveImageUrl(u.profilePicture) || `https://i.pravatar.cc/150?u=${u._id}`}
                      alt=""
                      className="mx-auto mb-3 h-20 w-20 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition">
                      {u.firstName} {u.lastName}
                      {u.isVerified && <span className="ml-1 text-blue-500 text-sm">✓</span>}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">@{u.username}</p>
                  </Link>
                  {u.bio && (
                    <p className="mt-1 mb-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{u.bio}</p>
                  )}
                  <button
                    onClick={() => toggleFollow(u._id)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition ${
                      isFollowed
                        ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFollowed ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFollowed ? "Following" : "Follow"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
