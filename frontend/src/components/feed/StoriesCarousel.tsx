"use client";

import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { StoryViewer } from "./StoryViewer";
import { useAuth } from "@/context/AuthContext";

interface Story {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  isUser?: boolean;
}

const BASE_STORIES: Story[] = [
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    cover: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    cover: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
  },
  {
    id: "5",
    name: "Tom Brown",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    cover: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
];

export const StoriesCarousel = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userStory, setUserStory] = useState<Story | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const stories: Story[] = [
    ...(userStory ? [userStory] : []),
    ...BASE_STORIES,
  ];

  const handleUserStoryClick = () => {
    if (userStory) {
      setViewerIndex(0);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserStory({
      id: "user",
      name: "Your Story",
      avatar: user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      cover: url,
      isUser: true,
    });
    e.target.value = "";
  };

  const allStories: Story[] = [
    {
      id: "user-card",
      name: "Your Story",
      avatar: user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      cover: userStory?.cover || user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
      isUser: true,
    },
    ...BASE_STORIES,
  ];

  const viewableStories = userStory
    ? [{ ...allStories[0], cover: userStory.cover }, ...BASE_STORIES]
    : BASE_STORIES;

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 mb-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max">
          {/* Your Story Card */}
          <div
            onClick={handleUserStoryClick}
            className="relative w-28 h-44 sm:w-32 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
          >
            <img
              src={userStory?.cover || user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"}
              alt="Your Story"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              {userStory ? (
                <img
                  src={user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt="You"
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 p-0.5 bg-white shadow-md"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
              )}
            </div>
            <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white drop-shadow-md truncate">
              {userStory ? "Your Story" : "Add Story"}
            </span>
          </div>

          {/* Other Stories */}
          {BASE_STORIES.map((story, i) => (
            <div
              key={story.id}
              onClick={() => setViewerIndex(userStory ? i + 1 : i)}
              className="relative w-28 h-44 sm:w-32 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
            >
              <img
                src={story.cover}
                alt={story.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 p-0.5 bg-white shadow-md"
                />
              </div>
              <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white drop-shadow-md truncate">
                {story.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {viewerIndex !== null && (
        <StoryViewer
          stories={viewableStories}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
};
