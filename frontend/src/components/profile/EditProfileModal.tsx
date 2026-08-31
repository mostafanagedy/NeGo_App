"use client";

import React, { useRef, useState } from "react";
import { X, Camera, Loader2, Github, Linkedin, Instagram, Twitter } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { resolveImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Props {
  profile: any;
  onClose: () => void;
  onUpdated: (updated: any) => void;
}
export default function EditProfileModal({ profile, onClose, onUpdated }: Props) {
  const { updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: profile?.firstName  || "",
    lastName:  profile?.lastName   || "",
    bio:       profile?.bio        || "",
    location:  profile?.location   || "",
    website:   profile?.website    || "",
    work:      profile?.work       || "",
    education: profile?.education  || "",
    socialLinks: {
      whatsapp:  profile?.socialLinks?.whatsapp  || "",
      linkedin:  profile?.socialLinks?.linkedin  || "",
      github:    profile?.socialLinks?.github    || "",
      twitter:   profile?.socialLinks?.twitter   || "",
      instagram: profile?.socialLinks?.instagram || "",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview,  setCoverPreview]  = useState<string | null>(null);
  const [avatarFile,    setAvatarFile]    = useState<File | null>(null);
  const [coverFile,     setCoverFile]     = useState<File | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState("");

  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef  = useRef<HTMLInputElement>(null);

  const handleImagePick = (type: "avatar" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "avatar") { setAvatarFile(file); setAvatarPreview(url); }
    else                   { setCoverFile(file);  setCoverPreview(url);  }
  };

  const uploadImage = async (file: File, endpoint: string, field: string) => {
    const fd = new FormData();
    fd.append(field, file);
    return apiRequest(endpoint, { method: "PUT", body: fd, isFormData: true });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await apiRequest("/users/profile", { method: "PUT", body: form });
      if (!res.success) { setError(res.message || "Failed to update profile"); setSaving(false); return; }
      let updated = { ...res.user };

      if (avatarFile) {
        const r = await uploadImage(avatarFile, "/users/profile-picture", "profilePicture");
        if (r.success && r.profilePicture) {
          updated.profilePicture = r.profilePicture;
        }
      }
      if (coverFile) {
        const r = await uploadImage(coverFile, "/users/cover-picture", "coverPicture");
        if (r.success && r.coverPicture) {
          updated.coverPicture = r.coverPicture;
        }
      }

      updateUser(updated);
      onUpdated(updated);
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = avatarPreview || resolveImageUrl(profile?.profilePicture) || "https://i.pravatar.cc/150?img=3";
  const currentCover  = coverPreview  || resolveImageUrl(profile?.coverPicture)   || "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1000";

  const textFields = [
    { name: "firstName" as const, label: "First Name", type: "text" },
    { name: "lastName"  as const, label: "Last Name",  type: "text" },
    { name: "location"  as const, label: "Location",   type: "text" },
    { name: "work"      as const, label: "Work",       type: "text" },
    { name: "education" as const, label: "Education",  type: "text" },
    { name: "website"   as const, label: "Website",    type: "url"  },
  ];

  const socialFields = [
    { key: "whatsapp"  as const, label: "WhatsApp",  placeholder: "+201234567890",           icon: "💬" },
    { key: "linkedin"  as const, label: "LinkedIn",  placeholder: "linkedin.com/in/username", icon: "💼" },
    { key: "github"    as const, label: "GitHub",    placeholder: "github.com/username",      icon: "🐙" },
    { key: "twitter"   as const, label: "Twitter/X", placeholder: "twitter.com/username",     icon: "🐦" },
    { key: "instagram" as const, label: "Instagram", placeholder: "instagram.com/username",   icon: "📸" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">

          {/* Cover */}
          <div
            className="relative h-36 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
            onClick={() => coverRef.current?.click()}
          >
            <img src={currentCover} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white text-sm font-semibold">
              <Camera className="w-5 h-5" /> Change Cover Photo
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick("cover")} />
          </div>

          {/* Avatar */}
          <div className="px-5 -mt-10 mb-2">
            <div
              className="relative w-fit cursor-pointer group"
              onClick={() => avatarRef.current?.click()}
            >
              <img
                src={currentAvatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick("avatar")} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Click to change profile photo</p>
          </div>

          {/* Fields */}
          <div className="px-5 pb-5 space-y-3">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            {/* First + Last name side by side */}
            <div className="grid grid-cols-2 gap-3">
              {textFields.slice(0, 2).map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.name]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell people about yourself..."
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>

            {/* Rest of fields */}
            {textFields.slice(2).map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.name]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            ))}

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Social Links</p>
              <div className="space-y-2.5">
                {socialFields.map((f) => (
                  <div key={f.key} className="flex items-center gap-2">
                    <span className="text-lg w-6 text-center shrink-0">{f.icon}</span>
                    <input
                      type="text"
                      value={form.socialLinks[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [f.key]: e.target.value } }))}
                      placeholder={f.placeholder}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition shadow-sm"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
