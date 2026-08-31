"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, X, Gamepad2, Users, Globe, Trophy, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest, resolveImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const GAMING_COVERS = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
  "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600",
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600",
];

const DEMO_GROUPS = [
  { _id: "gg1", name: "PC Gaming Arabia", description: "Gaming news, tips, and multiplayer sessions for PC gamers.", category: "Gaming", privacy: "public", members: Array(890), cover: GAMING_COVERS[0], admin: { firstName: "Karim", lastName: "Nasser", username: "karimnasser", profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" } },
  { _id: "gg2", name: "PlayStation Egypt", description: "PS5 players unite! Share clips, tips and find teammates.", category: "Gaming", privacy: "public", members: Array(1240), cover: GAMING_COVERS[1], admin: { firstName: "Omar", lastName: "Khaled", username: "omarkhaled", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" } },
  { _id: "gg3", name: "Mobile Legends MENA", description: "Competitive Mobile Legends players from across MENA.", category: "Gaming", privacy: "public", members: Array(2100), cover: GAMING_COVERS[2], admin: { firstName: "Ahmed", lastName: "Ali", username: "ahmedali", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" } },
  { _id: "gg4", name: "Retro Gaming Club", description: "Celebrating classic games from the 80s, 90s and 2000s.", category: "Gaming", privacy: "public", members: Array(430), cover: GAMING_COVERS[3], admin: { firstName: "Sara", lastName: "Hassan", username: "sarahassan", profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" } },
  { _id: "gg5", name: "Esports Egypt", description: "Follow local and international esports tournaments and news.", category: "Gaming", privacy: "public", members: Array(3200), cover: GAMING_COVERS[4], admin: { firstName: "Lina", lastName: "Farouk", username: "linafarouk", profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" } },
  { _id: "gg6", name: "Indie Game Devs", description: "A community for indie game developers to share and collaborate.", category: "Gaming", privacy: "private", members: Array(280), cover: GAMING_COVERS[5], admin: { firstName: "Maya", lastName: "Chen", username: "mayachen", profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" } },
];

const now = new Date();
const DEMO_EVENTS = [
  { _id: "ge1", title: "Online Gaming Tournament", description: "Compete in our monthly online gaming tournament. Prizes for top 3!", location: "", isOnline: true, startDate: new Date(now.getTime() + 2 * 86400000).toISOString(), attendees: Array(512), cover: GAMING_COVERS[0], host: { firstName: "Karim", lastName: "Nasser", username: "karimnasser", profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" } },
  { _id: "ge2", title: "LAN Party Cairo", description: "Bring your PC and join us for an epic LAN party night!", location: "Cairo Gaming Center, Nasr City", isOnline: false, startDate: new Date(now.getTime() + 5 * 86400000).toISOString(), attendees: Array(120), cover: GAMING_COVERS[1], host: { firstName: "Omar", lastName: "Khaled", username: "omarkhaled", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" } },
  { _id: "ge3", title: "Esports Watch Party", description: "Watch the World Championship finals together!", location: "Esports Lounge, Heliopolis", isOnline: false, startDate: new Date(now.getTime() + 1 * 86400000).toISOString(), attendees: Array(200), cover: GAMING_COVERS[4], host: { firstName: "Ahmed", lastName: "Ali", username: "ahmedali", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" } },
];

interface Group { _id: string; name: string; description: string; category: string; privacy: string; members: any[]; cover: string; admin: { firstName: string; lastName: string; username: string; profilePicture?: string }; }
interface GamingEvent { _id: string; title: string; description: string; location: string; isOnline: boolean; startDate: string; attendees: any[]; cover: string; host: { firstName: string; lastName: string; username: string; profilePicture?: string }; }

function formatDate(d: string) { return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
function formatTime(d: string) { return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }

export default function GamingPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"groups" | "events">("groups");
  const [groups, setGroups] = useState<Group[]>(DEMO_GROUPS as any);
  const [events, setEvents] = useState<GamingEvent[]>(DEMO_EVENTS as any);
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [attending, setAttending] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "", privacy: "public" });

  useEffect(() => {
    apiRequest("/groups?category=Gaming").then((res) => { if (res.success && res.data?.length > 0) setGroups(res.data); });
    apiRequest("/events?category=Gaming").then((res) => { if (res.success && res.data?.length > 0) setEvents(res.data); });
  }, []);

  const handleJoin = async (id: string) => {
    const isJoined = joined.has(id);
    setJoined((prev) => { const n = new Set(prev); isJoined ? n.delete(id) : n.add(id); return n; });
    await apiRequest(`/groups/${id}/${isJoined ? "leave" : "join"}`, { method: "PUT" });
  };

  const handleAttend = async (id: string) => {
    const isAttending = attending.has(id);
    setAttending((prev) => { const n = new Set(prev); isAttending ? n.delete(id) : n.add(id); return n; });
    await apiRequest(`/events/${id}/${isAttending ? "leave" : "attend"}`, { method: "PUT" });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const cover = GAMING_COVERS[Math.floor(Math.random() * GAMING_COVERS.length)];
    const res = await apiRequest("/groups", { method: "POST", body: { ...groupForm, category: "Gaming", cover } });
    if (res.success) { setGroups((p) => [res.data, ...p]); setShowCreate(false); setGroupForm({ name: "", description: "", privacy: "public" }); }
    setCreating(false);
  };

  const filteredGroups = groups.filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()));
  const filteredEvents = events.filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-green-50 dark:bg-green-950/40 rounded-xl">
              <Gamepad2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gaming</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Groups, tournaments, and gaming events.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100 w-44"
              />
            </div>
            {tab === "groups" && (
              <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow-sm shrink-0">
                <Plus className="w-4 h-4" /> Create
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Users className="w-4 h-4 text-green-500" />, label: "Gaming Groups", value: groups.length },
            { icon: <Trophy className="w-4 h-4 text-yellow-500" />, label: "Tournaments", value: events.length },
            { icon: <Zap className="w-4 h-4 text-blue-500" />, label: "Players Online", value: 1284 },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-3">
              <span className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">{s.icon}</span>
              <div>
                <p className="text-lg font-black text-gray-900 dark:text-gray-100" suppressHydrationWarning>{s.value.toLocaleString("en-US")}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["groups", "events"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition capitalize ${tab === t ? "bg-green-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400"}`}
            >
              {t === "groups" ? "Gaming Groups" : "Events & Tournaments"}
            </button>
          ))}
        </div>

        {/* Groups Tab */}
        {tab === "groups" && (
          filteredGroups.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700/50">
              <Gamepad2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No gaming groups found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGroups.map((group) => {
                const isJoined = joined.has(group._id);
                const isAdmin = group.admin?.username === user?.username;
                return (
                  <div key={group._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition">
                    <div className="h-32 overflow-hidden relative">
                      <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                        {group.privacy === "private" ? "🔒 Private" : <><Globe className="w-3 h-3" /> Public</>}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{group.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{group.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img src={resolveImageUrl(group.admin?.profilePicture) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-5 h-5 rounded-full object-cover" alt="" />
                          <span className="text-xs text-gray-400" suppressHydrationWarning>{(group.members?.length || 0).toLocaleString("en-US")} members</span>
                        </div>
                        {!isAdmin ? (
                          <button
                            onClick={() => handleJoin(group._id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isJoined ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500" : "bg-green-600 hover:bg-green-700 text-white"}`}
                          >
                            {isJoined ? "Leave" : "Join"}
                          </button>
                        ) : (
                          <span className="text-xs text-green-600 font-semibold">Admin</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Events Tab */}
        {tab === "events" && (
          filteredEvents.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700/50">
              <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No gaming events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredEvents.map((event) => {
                const isAttending = attending.has(event._id);
                const isHost = event.host?.username === user?.username;
                return (
                  <div key={event._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition">
                    <div className="h-36 overflow-hidden relative">
                      <img src={event.cover} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                        {event.isOnline ? "🌐 Online" : "📍 In-Person"}
                      </div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="text-xs font-semibold opacity-80" suppressHydrationWarning>{formatDate(event.startDate)}</p>
                        <p className="text-sm font-bold line-clamp-1">{event.title}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img src={resolveImageUrl(event.host?.profilePicture) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-5 h-5 rounded-full object-cover" alt="" />
                          <span className="text-xs text-gray-400" suppressHydrationWarning>{(event.attendees?.length || 0).toLocaleString("en-US")} attending</span>
                        </div>
                        {!isHost ? (
                          <button
                            onClick={() => handleAttend(event._id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isAttending ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500" : "bg-green-600 hover:bg-green-700 text-white"}`}
                          >
                            {isAttending ? "Leave" : "Join"}
                          </button>
                        ) : (
                          <span className="text-xs text-green-600 font-semibold">Host</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">Create Gaming Group</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Group Name</label>
                <input required type="text" placeholder="e.g. PC Gaming Arabia" value={groupForm.name} onChange={(e) => setGroupForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea rows={3} placeholder="What games do you play?" value={groupForm.description} onChange={(e) => setGroupForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Privacy</label>
                <select value={groupForm.privacy} onChange={(e) => setGroupForm((p) => ({ ...p, privacy: e.target.value }))} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <button type="submit" disabled={creating} className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition">
                {creating ? "Creating..." : "Create Group"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
