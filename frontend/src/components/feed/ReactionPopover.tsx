"use client";

import React from "react";

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

interface ReactionPopoverProps {
  onSelectReaction: (type: ReactionType) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const REACTION_CONFIG: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  like: { emoji: "👍", label: "Like", color: "text-blue-500" },
  love: { emoji: "❤️", label: "Love", color: "text-red-500" },
  haha: { emoji: "😆", label: "Haha", color: "text-amber-500" },
  wow: { emoji: "😲", label: "Wow", color: "text-amber-500" },
  sad: { emoji: "😢", label: "Sad", color: "text-yellow-600" },
  angry: { emoji: "😡", label: "Angry", color: "text-orange-600" },
};

export const ReactionPopover: React.FC<ReactionPopoverProps> = ({
  onSelectReaction,
  onMouseEnter,
  onMouseLeave,
}) => {
  const reactions: ReactionType[] = ["like", "love", "haha", "wow", "sad", "angry"];

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute bottom-full left-0 pb-2 mb-0.5 z-30 group"
    >
      <div className="flex items-center gap-1.5 p-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
        {reactions.map((type) => {
          const item = REACTION_CONFIG[type];
          return (
            <button
              key={type}
              onClick={(e) => {
                e.stopPropagation();
                onSelectReaction(type);
              }}
              className="p-1.5 hover:scale-130 transition-transform duration-150 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-2xl"
              title={item.label}
            >
              {item.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
};
