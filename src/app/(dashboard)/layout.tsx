import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="flex h-14 items-center border-b border-neutral-200 dark:border-neutral-700 px-4">
          <span className="text-sm font-semibold text-primary-500">
            LeapStart FA
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {/* Nav items will be rendered here */}
          <p className="text-xs text-neutral-400 dark:text-neutral-500 px-2 py-1">
            Navigation — coming soon
          </p>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-sticky flex h-14 items-center border-b border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-glass px-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Header — coming soon
          </p>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
