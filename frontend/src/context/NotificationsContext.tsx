"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { resolveSocketBaseUrl } from "@/lib/api";

export type NotifType = "like" | "comment" | "follow";

export interface NotifItem {
  id: string;
  type: NotifType;
  title: string;
  time: string;
  unread: boolean;
  avatar: string;
}

export const NOTIF_ICONS: Record<NotifType, any> = { like: Heart, comment: MessageCircle, follow: UserPlus };
export const NOTIF_COLORS: Record<NotifType, string> = { like: "bg-rose-500", comment: "bg-blue-500", follow: "bg-purple-500" };

interface NotificationsContextValue {
  notifs: NotifItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // استخدم الـ userId كـ string مش الـ object كله
  const userId = user?._id || user?.id || null;

  useEffect(() => {
    if (!userId || !token) return;

    // لو في socket قديم اقطعه الأول
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(resolveSocketBaseUrl(), {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket:Notif] connected →", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket:Notif] connection error →", err.message);
    });

    socket.on("new_notification", (data: any) => {
      console.log("[Socket:Notif] received →", data);
      const notif: NotifItem = {
        id: `${Date.now()}-${Math.random()}`,
        type: data.type as NotifType,
        title: data.title,
        avatar: data.avatar
          ? data.avatar.startsWith("http")
            ? data.avatar
            : `http://localhost:5000${data.avatar}`
          : `https://i.pravatar.cc/150?u=${data.fromUser?._id}`,
        time: timeAgo(data.time),
        unread: true,
      };
      setNotifs((prev) => [notif, ...prev]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, token]); // strings فقط مش objects

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <NotificationsContext.Provider value={{ notifs, unreadCount: notifs.filter((n) => n.unread).length, markRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
