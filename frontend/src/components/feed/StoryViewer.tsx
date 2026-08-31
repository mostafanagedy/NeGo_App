"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  isUser?: boolean;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000;

export const StoryViewer = ({ stories, initialIndex, onClose }: StoryViewerProps) => {
  const [current, setCurrent] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const startProgress = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) goNext();
    }, 50);
  };

  const clearProgress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  useEffect(() => {
    startProgress();
    return clearProgress;
  }, [current]);

  const goNext = () => {
    clearProgress();
    if (current < stories.length - 1) setCurrent((c) => c + 1);
    else onClose();
  };

  const goPrev = () => {
    clearProgress();
    if (current > 0) setCurrent((c) => c - 1);
  };

  const story = stories[current];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background */}
        <img src={story.cover} alt={story.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={story.avatar} alt={story.name} className="w-9 h-9 rounded-full object-cover border-2 border-white" />
            <div>
              <p className="text-white text-sm font-bold drop-shadow">{story.name}</p>
              <p className="text-white/70 text-xs">Just now</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Areas */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition"
        >
          {current > 0 && (
            <span className="p-1.5 rounded-full bg-black/30 text-white">
              <ChevronLeft className="w-5 h-5" />
            </span>
          )}
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition"
        >
          <span className="p-1.5 rounded-full bg-black/30 text-white">
            <ChevronRight className="w-5 h-5" />
          </span>
        </button>
      </div>
    </div>
  );
};
