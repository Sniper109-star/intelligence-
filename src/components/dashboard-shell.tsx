import AppSidebar from "@/components/app-sidebar";
import { MobileSidebar, useMobileSidebar } from "@/components/mobile-sidebar";
import { Suspense } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useMobileSidebar();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <MobileSidebar
        open={open}
        onClose={() => setOpen(false)}
      />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-sm font-bold text-foreground">Wallet Intelligence</span>
            <span className="text-[10px] text-foreground-muted">Solana Analytics</span>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 lg:p-6">
      <div className="h-8 w-64 rounded bg-border" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-surface" />
        ))}
      </div>
      <div className="h-64 rounded-lg bg-surface" />
    </div>
  );
}
