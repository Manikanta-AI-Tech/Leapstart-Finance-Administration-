"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Header } from "@/components/layout/header";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { pageTransition } from "@/lib/animations";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-[#0B1220]">
        <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        <MobileSidebar open={mobileOpen} onClose={closeMobile} />
        <main className={cn("flex-1 flex flex-col min-h-screen transition-all duration-250", "md:ml-[72px]", !collapsed && "md:ml-64")}>
          <Header onMenuClick={toggleMobile} />
          <div className="flex-1 overflow-auto">
            <div className="max-w-[1280px] mx-auto w-full p-4 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div key={pathname} variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
