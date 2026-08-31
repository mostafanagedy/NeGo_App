"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin, Globe, Briefcase, Calendar, CheckCircle2,
  UserPlus, UserCheck, MoreHorizontal, Pencil,
  Image as ImageIcon, MessageSquare,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostCard } from "@/components/feed/PostCard";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { resolveImageUrl } from "@/lib/api";
import { CreatePostBox } from "@/components/feed/CreatePostBox";

const TABS = ["Posts", "About", "Friends", "Photos"] as const;
type Tab = typeof TABS[number];

const ONLINE_FRIENDS = [
  { id: "o1", name: "Jane Smith",   avatar: "https://i.pravatar.cc/150?img=47" },
  { id: "o2", name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "o3", name: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?img=9"  },
  { id: "o4", name: "Tom Brown",    avatar: "https://i.pravatar.cc/150?img=15" },
];

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
];

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const { user: me } = useAuth();

  const [profile, setProfile]   = useState<any>(null);
  const [posts, setPosts]       = useState<any[]>([]);
  const [following, setFollowing] = useState(false);
  const [tab, setTab]                     = useState<Tab>("Posts");
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwn = me?.username === username;

  useEffect(() => {
    if (!username) return;
    fetchProfile();
    fetchUserPosts();
  }, [username]);

  const fetchProfile = async () => {
    const res = await apiRequest(`/users/profile/${username}`);
    setProfile(res.success && res.user ? res.user : {
      firstName: "John", lastName: "Doe",
      username: username || "johndoe",
      profilePicture: "https://i.pravatar.cc/150?img=3",
      coverPicture: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1000",
      bio: "Software Developer | Tech Enthusiast | Coffee Lover ☕",
      isVerified: true,
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      work: "Senior Software Architect",
      education: "MIT — Computer Science",
      followers: new Array(5678),
      following: new Array(1234),
      createdAt: "2022-03-15T00:00:00Z",
    });
  };

  const fetchUserPosts = async () => {
    const res = await apiRequest(`/posts/user/${username}`);
    if (res.success && res.data) setPosts(res.data);
  };

  const toggleFollow = async () => {
    if (!profile?._id) { setFollowing((v) => !v); return; }
    const endpoint = following ? `/users/unfollow/${profile._id}` : `/users/follow/${profile._id}`;
    await apiRequest(endpoint, { method: "PUT" });
    setFollowing((v) => !v);
  };

  return (
    <AppShell>
      <div className="space-y-4">

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50">

            {/* Cover */}
            <div className="h-48 sm:h-56 relative overflow-hidden bg-gradient-to-r from-blue-400 to-indigo-500">
              <img
                src={resolveImageUrl(profile?.coverPicture) || "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1000"}
                alt="cover"
                className="w-full h-full object-cover"
              />
              {isOwn && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm transition"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Edit Cover
                </button>
              )}
            </div>

            {/* Avatar + Actions row */}
            <div className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-3 gap-3">
                {/* Avatar */}
                <div className="relative w-fit">
                  <img
                    src={resolveImageUrl(profile?.profilePicture) || "https://i.pravatar.cc/150?img=3"}
                    alt={profile?.firstName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                  />
                  {profile?.isVerified && (
                    <CheckCircle2 className="absolute bottom-1 right-1 w-6 h-6 text-blue-500 fill-white dark:fill-gray-800" />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 pb-1">
                  {isOwn ? (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={toggleFollow}
                      className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition shadow-sm ${following ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    >
                      {following ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      {following ? "Following" : "Follow"}
                    </button>
                  )}
                  {!isOwn && (
                    <button className="flex items-center gap-2 px-5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition">
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                  )}
                  <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name / Bio / Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                </div>
                <p className="text-sm text-gray-400">@{profile?.username}</p>

                {profile?.bio && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{profile.bio}</p>
                )}

                {/* Meta badges */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 pt-1">
                  {profile?.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" />{profile.location}</span>
                  )}
                  {profile?.work && (
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-purple-500" />{profile.work}</span>
                  )}
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Globe className="w-3.5 h-3.5" />{profile.website}
                    </a>
                  )}
                  {profile?.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-green-500" />
                      Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 pt-1">
                  <div className="text-sm">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {(profile?.following?.length || 0).toLocaleString("en-US")}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {(profile?.followers?.length || 0).toLocaleString("en-US")}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 border-b border-gray-100 dark:border-gray-700">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-semibold transition relative ${
                      tab === t
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    {t}
                    {tab === t && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {tab === "Posts" && (
            <div className="space-y-4">
              {isOwn && <CreatePostBox onPostCreated={(p) => setPosts((prev) => [p, ...prev])} />}
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-sm text-gray-400 border border-gray-100 dark:border-gray-700/50">
                  No posts published yet.
                </div>
              ) : (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
          )}

          {tab === "About" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">About</h2>
              {[
                { icon: <Briefcase className="w-4 h-4 text-purple-500" />, label: "Work",      value: profile?.work },
                { icon: <Globe     className="w-4 h-4 text-blue-500"   />, label: "Website",   value: profile?.website, href: profile?.website },
                { icon: <MapPin    className="w-4 h-4 text-red-500"    />, label: "Location",  value: profile?.location },
                { icon: <Calendar  className="w-4 h-4 text-green-500"  />, label: "Joined",    value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex items-center gap-3 text-sm">
                  {row.icon}
                  <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">{row.label}</span>
                  {row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{row.value}</a>
                  ) : (
                    <span className="text-gray-800 dark:text-gray-200">{row.value}</span>
                  )}
                </div>
              ))}

              {/* Social Links */}
              {profile?.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social Links</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "whatsapp",  label: "WhatsApp",  icon: "💬", color: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",   href: (v: string) => `https://wa.me/${v.replace(/\D/g,"")}` },
                      { key: "linkedin",  label: "LinkedIn",  icon: "💼", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",       href: (v: string) => v.startsWith("http") ? v : `https://${v}` },
                      { key: "github",    label: "GitHub",    icon: "🐙", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",          href: (v: string) => v.startsWith("http") ? v : `https://${v}` },
                      { key: "twitter",   label: "Twitter/X", icon: "🐦", color: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",            href: (v: string) => v.startsWith("http") ? v : `https://${v}` },
                      { key: "instagram", label: "Instagram", icon: "📸", color: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",        href: (v: string) => v.startsWith("http") ? v : `https://${v}` },
                    ].filter((s) => profile.socialLinks[s.key]).map((s) => (
                      <a
                        key={s.key}
                        href={s.href(profile.socialLinks[s.key])}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition hover:opacity-80 ${s.color}`}
                      >
                        <span>{s.icon}</span> {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "Friends" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Friends</h2>
              <div className="grid grid-cols-3 gap-3">
                {[...ONLINE_FRIENDS].map((f) => (
                  <div key={f.id} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                    <img src={f.avatar} className="w-14 h-14 rounded-full object-cover" alt={f.name} />
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 text-center truncate w-full">{f.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Photos" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Photos</h2>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_PHOTOS.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => setProfile((prev: any) => ({ ...prev, ...updated }))}
        />
      )}
    </AppShell>
  );
}
