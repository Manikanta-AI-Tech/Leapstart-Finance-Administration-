"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Users, IndianRupee,
  ReceiptText, FileText, Award, BarChart3, Settings,
  X, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { backdropVariants, sidebarDrawerVariants } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, ClipboardList: GraduationCap, GraduationCap: Users,
  IndianRupee, Receipt: ReceiptText, FileText, Award, BarChart3, Settings,
};

interface MobileSidebarProps { open: boolean; onClose: () => void; }

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuthContext();
  const initials = profile ? (profile.fullName ?? profile.email ?? "U").split(/[\s.@]+/).slice(0, 2).map(n => n[0]?.toUpperCase() ?? "").join("") : "U";
  const name = profile?.fullName ?? profile?.email ?? "User";
  const role = profile?.role ?? "Viewer";

  return (
    <AnimatePresence>
      {open && (<>
        <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.2 }}
          className="fixed inset-0 z-sidebar bg-black/50 backdrop-blur-sm md:hidden" onClick={onClose} />
        <motion.aside variants={sidebarDrawerVariants} initial="hidden" animate="visible" exit="exit"
          className="fixed inset-y-0 left-0 z-sidebar w-64 md:hidden flex flex-col bg-neutral-950 border-r border-neutral-800">
          <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"><span className="text-white font-bold text-sm">LS</span></div>
              <span className="text-white font-semibold text-base">LeapStart</span>
            </div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = iconMap[item.icon] ?? LayoutDashboard;
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onClose}
                  className={cn("flex items-center w-full rounded-md relative transition-all px-3 h-10 gap-3",
                    active ? "bg-primary-500/20 text-white font-medium" : "text-neutral-400 hover:text-white hover:bg-neutral-800")}>
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-accent-500" />}
                  <Icon className={cn("w-5 h-5", active ? "text-white" : "text-neutral-500 group-hover:text-neutral-300")} />
                  <span className="text-sm truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-neutral-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary-600 text-white text-xs">{initials}</AvatarFallback></Avatar>
              <div className="min-w-0"><p className="text-sm font-medium text-white truncate">{name}</p><p className="text-xs text-neutral-500 truncate capitalize">{role.toLowerCase()}</p></div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 text-neutral-400 hover:text-white hover:bg-neutral-800 h-8"><User className="w-4 h-4 mr-1.5" />Profile</Button>
              <Button variant="ghost" size="sm" className="flex-1 text-destructive-400 hover:text-destructive-300 hover:bg-neutral-800 h-8" onClick={() => { signOut(); onClose(); }}><LogOut className="w-4 h-4 mr-1.5" />Sign Out</Button>
            </div>
          </div>
        </motion.aside>
      </>)}
    </AnimatePresence>
  );
}
