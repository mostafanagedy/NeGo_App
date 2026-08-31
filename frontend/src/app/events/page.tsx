"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, X, Calendar, MapPin, Globe, Lock, Users, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest, resolveImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["All", "Technology", "Sports", "Art", "Music", "Gaming", "Education", "Business", "Social", "Other"];

const COVERS: Record<string, string> = {
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600",
  Art: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
  Music: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600",
  Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
  Business: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600",
  Social: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
  Other: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
};

const now = new Date();
const DEMO_EVENTS = [
  { _id: "e1", title: "React Summit Cairo 2025", description: "The biggest React conference in Egypt. Talks, workshops, and networking.", category: "Technology", location: "Cairo Tech Hub, Maadi", isOnline: false, startDate: new Date(now.getTime() + 3 * 86400000).toISOString(), endDate: new Date(now.getTime() + 3 * 86400000 + 8 * 3600000).toISOString(), attendees: Array(320), cover: COVERS.Technology, host: { firstName: "Ahmed", lastName: "Ali", username: "ahmedali", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" }, privacy: "public" },
  { _id: "e2", title: "Cairo Photography Walk", description: "Join us for a guided photography walk through historic Cairo streets.", category: "Art", location: "Al-Muizz Street, Cairo", isOnline: false, startDate: new Date(now.getTime() + 5 * 86400000).toISOString(), endDate: new Date(now.getTime() + 5 * 86400000 + 4 * 3600000).toISOString(), attendees: Array(85), cover: COVERS.Art, host: { firstName: "Sara", lastName: "Hassan", username: "sarahassan", profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }, privacy: "public" },
  { _id: "e3", title: "Online Gaming Tournament", description: "Compete in our monthly online gaming tournament. Prizes for top 3!", category: "Gaming", location: "", isOnline: true, startDate: new Date(now.getTime() + 2 * 86400000).toISOString(), endDate: new Date(now.getTime() + 2 * 86400000 + 6 * 3600000).toISOString(), attendees: Array(512), cover: COVERS.Gaming, host: { firstName: "Karim", lastName: "Nasser", username: "karimnasser", profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" }, privacy: "public" },
  { _id: "e4", title: "Startup Pitch Night", description: "Present your startup idea to investors and get valuable feedback.", category: "Business", location: "GrEEK Campus, Downtown Cairo", isOnline: false, startDate: new Date(now.getTime() + 7 * 86400000).toISOString(), endDate: new Date(now.getTime() + 7 * 86400000 + 5 * 3600000).toISOString(), attendees: Array(150), cover: COVERS.Business, host: { firstName: "Maya", lastName: "Chen", username: "mayachen", profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" }, privacy: "public" },
  { _id: "e5", title: "Live Jazz Night", description: "An evening of live jazz music featuring local and international artists.", category: "Music", location: "Cairo Jazz Club, Agouza", isOnline: false, startDate: new Date(now.getTime() + 4 * 86400000).toISOString(), endDate: new Date(now.getTime() + 4 * 86400000 + 4 * 3600000).toISOString(), attendees: Array(200), cover: COVERS.Music, host: { firstName: "Lina", lastName: "Farouk", username: "linafarouk", profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }, privacy: "public" },
  { _id: "e6", title: "Football Watch Party", description: "Watch the Champions League final together with fellow fans!", category: "Sports", location: "Sports Bar, Zamalek", isOnline: false, startDate: new Date(now.getTime() + 1 * 86400000).toISOString(), endDate: new Date(now.getTime() + 1 * 86400000 + 3 * 3600000).toISOString(), attendees: Array(75), cover: COVERS.Sports, host: { firstName: "Omar", lastName: "Khaled", username: "omarkhaled", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" }, privacy: "public" },
];

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  isOnline: boolean;
  startDate: string;
  endDate?: string;
  attendees: any[];
  cover: string;
  host: { firstName: string; lastName: string; username: string; profilePicture?: string };
  privacy: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function EventsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"upcoming" | "my">("upcoming");
  const [events, setEvents] = useState<Event[]>(DEMO_EVENTS as any);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [attending, setAttending] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "Technology",
    location: "", isOnline: false, startDate: "", endDate: "", privacy: "public",
  });

  useEffect(() => { fetchEvents(); }, [category]);
  useEffect(() => { if (tab === "my") fetchMyEvents(); }, [tab]);

  const fetchEvents = async () => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    const res = await apiRequest(`/events?${params}`);
    if (res.success && res.data?.length > 0) setEvents(res.data);
  };

  const fetchMyEvents = async () => {
    const res = await apiRequest("/events/my");
    if (res.success) setMyEvents(res.data);
  };

  const handleAttend = async (eventId: string) => {
    const isAttending = attending.has(eventId);
    setAttending((prev) => {
      const next = new Set(prev);
      isAttending ? next.delete(eventId) : next.add(eventId);
      return next;
    });
    await apiRequest(`/events/${eventId}/${isAttending ? "leave" : "attend"}`, { method: "PUT" });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await apiRequest("/events", {
      method: "POST",
      body: { ...form, cover: COVERS[form.category] || COVERS.Other },
    });
    if (res.success) {
      setEvents((prev) => [res.data, ...prev]);
      setShowCreate(false);
      setForm({ title: "", description: "", category: "Technology", location: "", isOnline: false, startDate: "", endDate: "", privacy: "public" });
    }
    setCreating(false);
  };

  const filtered = events.filter((ev) => {
    const matchCat = category === "All" || ev.category === category;
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const displayList = tab === "my" ? myEvents : filtered;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-orange-50 dark:bg-orange-950/40 rounded-xl">
              <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Events</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discover and join events near you.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100 w-48"
              />
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["upcoming", "my"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${tab === t ? "bg-orange-500 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-400"}`}
            >
              {t === "upcoming" ? "Upcoming" : "My Events"}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {tab === "upcoming" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${category === cat ? "bg-orange-500 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-400"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Events Grid */}
        {displayList.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700/50">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{tab === "my" ? "You haven't joined any events yet." : "No events found."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayList.map((event) => {
              const isAttending = attending.has(event._id);
              const isHost = event.host?.username === user?.username;
              return (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelected(event)}
                >
                  {/* Cover */}
                  <div className="h-36 overflow-hidden relative">
                    <img src={event.cover || COVERS[event.category] || COVERS.Other} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                      {event.isOnline ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {event.isOnline ? "Online" : "In-Person"}
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold opacity-80">{formatDate(event.startDate)}</p>
                      <p className="text-sm font-bold leading-tight line-clamp-1">{event.title}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span suppressHydrationWarning>{formatTime(event.startDate)}</span>
                      {event.location && (
                        <>
                          <span className="mx-1">·</span>
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">{event.location}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{event.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={resolveImageUrl(event.host?.profilePicture) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          className="w-5 h-5 rounded-full object-cover"
                          alt=""
                        />
                        <span className="text-xs text-gray-400" suppressHydrationWarning>
                          {(event.attendees?.length || 0).toLocaleString("en-US")} attending
                        </span>
                      </div>
                      {!isHost && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAttend(event._id); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isAttending ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
                        >
                          {isAttending ? "Leave" : "Attend"}
                        </button>
                      )}
                      {isHost && <span className="text-xs text-orange-500 font-semibold">Host</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-48 relative">
              <img src={selected.cover || COVERS[selected.category] || COVERS.Other} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition">
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs opacity-80 font-semibold">{selected.category}</p>
                <h2 className="text-xl font-black">{selected.title}</h2>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span suppressHydrationWarning>{formatDate(selected.startDate)} at {formatTime(selected.startDate)}</span>
              </div>
              {selected.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{selected.location}</span>
                </div>
              )}
              {selected.isOnline && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span>Online Event</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 text-orange-500" />
                <span suppressHydrationWarning>{(selected.attendees?.length || 0).toLocaleString("en-US")} people attending</span>
              </div>
              {selected.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selected.description}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <img
                  src={resolveImageUrl(selected.host?.profilePicture) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  className="w-8 h-8 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <p className="text-xs text-gray-400">Hosted by</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selected.host?.firstName} {selected.host?.lastName}</p>
                </div>
              </div>
              {selected.host?.username !== user?.username && (
                <button
                  onClick={() => { handleAttend(selected._id); setSelected(null); }}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition ${attending.has(selected._id) ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
                >
                  {attending.has(selected._id) ? "Leave Event" : "Attend Event"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">Create Event</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Event Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. React Summit Cairo 2025"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What is this event about?"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Privacy</label>
                  <select
                    value={form.privacy}
                    onChange={(e) => setForm((p) => ({ ...p, privacy: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Address or leave empty for online"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) => setForm((p) => ({ ...p, isOnline: e.target.checked }))}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Online Event</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Start Date & Time</label>
                  <input
                    required
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Cover Preview */}
              <div className="rounded-xl overflow-hidden h-24 border border-gray-200 dark:border-gray-600">
                <img src={COVERS[form.category] || COVERS.Other} alt="cover preview" className="w-full h-full object-cover" />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition"
              >
                {creating ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
