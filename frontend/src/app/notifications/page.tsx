"use client";

import { Bell, CheckCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useNotifications, NOTIF_ICONS, NOTIF_COLORS } from "@/context/NotificationsContext";

export default function NotificationsPage() {
  const { notifs, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Stay up to date with your activity.</p>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        </div>

        <div className="space-y-2">
          {notifs.map((n) => {
            const Icon = NOTIF_ICONS[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  n.unread
                    ? "bg-blue-50/80 hover:bg-blue-50 dark:bg-blue-950/30 dark:hover:bg-blue-950/45"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="relative shrink-0">
                  <img src={n.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <span className={`absolute -bottom-1 -right-1 rounded-full border-2 border-white p-1 text-white dark:border-gray-800 ${NOTIF_COLORS[n.type]}`}>
                    <Icon className="h-3 w-3" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-5 text-gray-800 dark:text-gray-100">{n.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{n.time}</p>
                </div>
                {n.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
