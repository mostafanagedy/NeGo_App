import { ReactNode } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl gap-4 px-2 py-4 sm:px-4">
        <LeftSidebar />
        <section className="min-w-0 flex-1">{children}</section>
        <RightSidebar />
      </main>
      <BottomNavigation />
    </div>
  );
}
