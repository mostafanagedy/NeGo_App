"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Video, Link2, X, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, resolveImageUrl } from "@/lib/api";

interface CreatePostBoxProps {
  onPostCreated?: (post: any) => void;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleFilePick = (type: "image" | "video") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setMediaType(type);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (imageRef.current) imageRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile && !linkUrl.trim()) return;
    setLoading(true);
    try {
      let res;
      if (mediaFile) {
        const fd = new FormData();
        fd.append("content", content);
        fd.append("visibility", "public");
        if (linkUrl.trim()) fd.append("link", linkUrl);
        fd.append(mediaType!, mediaFile);
        res = await apiRequest("/posts", { method: "POST", body: fd, isFormData: true });
      } else {
        res = await apiRequest("/posts", {
          method: "POST",
          body: { content, visibility: "public", ...(linkUrl.trim() && { link: linkUrl }) },
        });
      }
      if (res.success && res.post) {
        setContent("");
        setLinkUrl("");
        setShowLink(false);
        clearMedia();
        onPostCreated?.(res.post);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 mb-4">
      <div className="flex items-start gap-3">
        <img
          src={resolveImageUrl(user?.profilePicture) || "https://i.pravatar.cc/150?img=3"}
          alt={user?.firstName || "User"}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user?.firstName || "friend"}?`}
            rows={mediaPreview || showLink ? 3 : 2}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 dark:border-gray-700 resize-none transition"
          />

          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={clearMedia}
                className="absolute top-2 right-2 z-10 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {mediaType === "image" ? (
                <img src={mediaPreview} alt="preview" className="w-full max-h-72 object-cover" />
              ) : (
                <video src={mediaPreview} controls className="w-full max-h-72" />
              )}
            </div>
          )}

          {/* Link Input */}
          {showLink && (
            <div className="mt-2 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-500 shrink-0" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Paste a link..."
                className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={() => { setShowLink(false); setLinkUrl(""); }}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-700/50 my-3" />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {/* Image Upload */}
          <button
            onClick={() => imageRef.current?.click()}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold transition"
          >
            <ImageIcon className="w-4 h-4 text-green-500" /> Photo
          </button>
          <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick("image")} />

          {/* Video Upload */}
          <button
            onClick={() => videoRef.current?.click()}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold transition"
          >
            <Video className="w-4 h-4 text-red-500" /> Video
          </button>
          <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleFilePick("video")} />

          {/* Link */}
          <button
            onClick={() => setShowLink(!showLink)}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold transition"
          >
            <Link2 className="w-4 h-4 text-blue-500" /> Link
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !mediaFile && !linkUrl.trim())}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-full text-xs shadow-sm transition flex items-center gap-1.5"
        >
          {loading ? "Posting..." : "Post"} <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
