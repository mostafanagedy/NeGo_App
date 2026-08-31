"use client";

import { Bell, ChevronRight, LockKeyhole, Moon, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return <button onClick={onChange} role="switch" aria-checked={enabled} className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`} /></button>;
}

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);

  const sections = [
    { icon: UserRound, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400", title: "Account", text: "Manage your personal details and profile information" },
    { icon: LockKeyhole, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400", title: "Password & security", text: "Update your password and security preferences" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800"><h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Control your account, privacy, and notifications.</p></section>
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-800">{sections.map((section) => { const Icon = section.icon; return <button key={section.title} className="flex w-full items-center gap-4 border-b border-gray-100 p-5 text-left last:border-0 hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/40"><span className={`rounded-xl p-2.5 ${section.color}`}><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-semibold text-gray-900 dark:text-gray-100">{section.title}</span><span className="mt-0.5 block text-sm text-gray-500 dark:text-gray-400">{section.text}</span></span><ChevronRight className="h-5 w-5 text-gray-400" /></button>; })}</section>
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800"><div className="mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" /><h2 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h2></div><div className="space-y-4"><div className="flex items-center justify-between gap-4"><div><p className="font-medium text-gray-800 dark:text-gray-100">Push notifications</p><p className="text-sm text-gray-500 dark:text-gray-400">Get notified about activity on NeGo.</p></div><Toggle enabled={pushEnabled} onChange={() => setPushEnabled(!pushEnabled)} /></div><div className="flex items-center justify-between gap-4"><div><p className="font-medium text-gray-800 dark:text-gray-100">Email updates</p><p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly news and highlights.</p></div><Toggle enabled={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} /></div></div></section>
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" /><h2 className="font-bold text-gray-900 dark:text-gray-100">Privacy</h2></div><div className="flex items-center justify-between gap-4"><div><p className="font-medium text-gray-800 dark:text-gray-100">Private profile</p><p className="text-sm text-gray-500 dark:text-gray-400">Only your friends can see your posts and profile.</p></div><Toggle enabled={privateProfile} onChange={() => setPrivateProfile(!privateProfile)} /></div></section>
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800"><div className="flex items-center gap-2"><Moon className="h-5 w-5 text-indigo-500" /><div><h2 className="font-bold text-gray-900 dark:text-gray-100">Appearance</h2><p className="text-sm text-gray-500 dark:text-gray-400">Use the theme control in the header to switch between light and dark mode.</p></div></div></section>
      </div>
    </AppShell>
  );
}
