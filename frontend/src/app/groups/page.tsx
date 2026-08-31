"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, X, Users, Lock, Globe, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["All", "Technology", "Sports", "Art", "Music", "Gaming", "Education", "Business", "Other"];

const COVERS: Record<string, string> = {
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600",
  Art: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
  Music: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600",
  Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
  Business: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600",
  Other: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
};

const DEMO_GROUPS = [
  { _id: "g1", name: "React Developers Egypt", description: "A community for React & Next.js developers in Egypt.", category: "Technology", privacy: "public", members: Array(284), cover: COVERS.Technology, admin: { firstName: "Ahmed", lastName: "Ali", username: "ahmedali", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" }, createdAt: new Date().toISOString() },
  { _id: "g2", name: "Cairo Photographers", description: "Share your best shots from around Cairo and Egypt.", category: "Art", privacy: "public", members: Array(512), cover: COVERS.Art, admin: { firstName: "Sara", lastName: "Hassan", username: "sarahassan", profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }, createdAt: new Date().toISOString() },
  { _id: "g3", name: "Football Fans Club", description: "Live scores, match discussions and football news.", category: "Sports", privacy: "public", members: Array(1200), cover: COVERS.Sports, admin: { firstName: "Omar", lastName: "Khaled", username: "omarkhaled", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" }, createdAt: new Date().toISOString() },
  { _id: "g4", name: "Indie Music Lovers", description: "Discover and share independent music from around the world.", category: "Music", privacy: "public", members: Array(376), cover: COVERS.Music, admin: { firstName: "Lina", lastName: "Farouk", username: "linafarouk", profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }, createdAt: new Date().toISOString() },
  { _id: "g5", name: "PC Gaming Arabia", description: "Gaming news, tips, and multiplayer sessions.", category: "Gaming", privacy: "public", members: Array(890), cover: COVERS.Gaming, admin: { firstName: "Karim", lastName: "Nasser", username: "karimnasser", profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" }, createdAt: new Date().toISOString() },
  { _id: "g6", name: "Startup Founders MENA", description: "Connect with entrepreneurs and investors across MENA.", category: "Business", privacy: "private", members: Array(203), cover: COVERS.Business, admin: { firstName: "Maya", lastName: "Chen", username: "mayachen", profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" }, createdAt: new Date().toISOString() },
];

interface Group {
  _id: string;
  name: string;
  description: string;
  category: string;
  privacy: string;
  members: any[];
  cover: string;
  admin: { firstName: string; lastName: string; username: string; profilePicture?: string };
  createdAt: string;
}

export default function GroupsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"discover" | "my">("discover");
  const [groups, setGroups] = useState<Group[]>(DEMO_GROUPS as any);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "Technology", privacy: "public" });

  useEffect(() => { fetchGroups(); }, [category]);
  useEffect(() => { if (tab === "my") fetchMyGroups(); }, [tab]);

  const fetchGroups = async () => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    const res = await apiRequest(`/groups?${params}`);
    if (res.success && res.data?.length > 0) setGroups(res.data);
  };

  const fetchMyGroups = async () => {
    const res = await apiRequest("/groups/my");
    if (res.success) setMyGroups(res.data);
  };

  const handleJoin = async (groupId: string) => {
    const isJoined = joined.has(groupId);
    setJoined((prev) => {
      const next = new Set(prev);
      isJoined ? next.delete(groupId) : next.add(groupId);
      return next;
    });
    await apiRequest(`/groups/${groupId}/${isJoined ? "leave" : "join"}`, { method: "PUT" });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await apiRequest("/groups", {
      method: "POST",
      body: { ...form, cover: COVERS[form.category] || COVERS.Other },
    });
    if (res.success) {
      setGroups((prev) => [res.data, ...prev]);
      setMyGroups((prev) => [res.data, ...prev]);
      setShowCreate(false);
      setForm({ name: "", description: "", category: "Technology", privacy: "public" });
    }
    setCreating(false);
  };

  const filtered = groups.filter((g) => {
    const matchCat = category === "All" || g.category === category;
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const displayList = tab === "my" ? myGroups : filtered;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Groups</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Join communities that match your interests.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups..."
                className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 w-48"
              />
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["discover", "my"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${tab === t ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400"}`}
            >
              {t === "discover" ? "Discover" : "My Groups"}
            </button>
          ))}
        </div>

        {/* Category Filter - only on discover */}
        {tab === "discover" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${category === cat ? "bg-purple-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-400"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Groups Grid */}
        {displayList.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700/50">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{tab === "my" ? "You haven't joined any groups yet." : "No groups found."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayList.map((group) => {
              const isJoined = joined.has(group._id);
              const isAdmin = group.admin?.username === user?.username;
              const memberCount = group.members?.length || 0;
              return (
                <div key={group._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition">
                  {/* Cover */}
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={group.cover || COVERS[group.category] || COVERS.Other}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                      {group.privacy === "private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      {group.privacy}
                    </div>
                    <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                      {group.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{group.name}</h3>
                      {isAdmin && <Crown className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{group.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {[group.admin].map((m, i) => (
                            <img key={i} src={m?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-gray-800" alt="" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400" suppressHydrationWarning>{memberCount.toLocaleString("en-US")} members</span>
                      </div>

                      {!isAdmin && (
                        <button
                          onClick={() => handleJoin(group._id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isJoined ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                        >
                          {isJoined ? "Leave" : "Join"}
                        </button>
                      )}
                      {isAdmin && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">Admin</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">Create Group</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Group Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. React Developers Egypt"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What is this group about?"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Privacy</label>
                  <select
                    value={form.privacy}
                    onChange={(e) => setForm((p) => ({ ...p, privacy: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              {/* Cover Preview */}
              <div className="rounded-xl overflow-hidden h-24 border border-gray-200 dark:border-gray-600">
                <img src={COVERS[form.category] || COVERS.Other} alt="cover preview" className="w-full h-full object-cover" />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition"
              >
                {creating ? "Creating..." : "Create Group"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
