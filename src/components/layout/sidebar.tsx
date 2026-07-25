"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Users, IndianRupee,
  ReceiptText, FileText, Award, BarChart3, Settings,
  ChevronLeft, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { springs } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, ClipboardList: GraduationCap, GraduationCap: Users,
  IndianRupee, Receipt: ReceiptText, FileText, Award, BarChart3, Settings,
};

interface SidebarProps { collapsed: boolean; onToggle: () => void; }

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuthContext();

  const isActive = useCallback((href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href), [pathname]);

  const initials = profile ? (profile.fullName ?? profile.email ?? "U").split(/[\s.@]+/).slice(0, 2).map(n => n[0]?.toUpperCase() ?? "").join("") : "U";
  const name = profile?.fullName ?? profile?.email ?? "User";
  const role = profile?.role ?? "Viewer";

  return (
    <motion.aside animate={{ width: collapsed ? 72 : 256 }} transition={springs.gentle}
      className="fixed inset-y-0 left-0 z-sidebar hidden md:flex flex-col bg-neutral-950 border-r border-neutral-800">
      {/* Logo */}
      <div className={cn("flex items-center h-16 border-b border-neutral-800", collapsed ? "justify-center px-0" : "px-5 gap-3")}>
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <span className="text-white font-bold text-sm">LS</span></div>
        {!collapsed && <span className="text-white font-semibold text-base tracking-tight whitespace-nowrap">LeapStart</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active = isActive(item.href);
          return collapsed ? (
            <Tooltip key={item.href} delayDuration={300}>
              <TooltipTrigger asChild>
                <Link href={item.href} className={cn("flex items-center justify-center w-10 h-10 mx-auto rounded-md transition-all duration-150 group relative",
                  active ? "bg-primary-500/20 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800")}>
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-accent-500" />}
                  <Icon className={cn("w-5 h-5", active ? "text-white" : "text-neutral-500 group-hover:text-neutral-300")} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-1">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            <Link key={item.href} href={item.href} className={cn("flex items-center w-full rounded-md relative transition-all duration-150 px-3 h-10 gap-3",
              active ? "bg-primary-500/20 text-white font-medium" : "text-neutral-400 hover:text-white hover:bg-neutral-800")}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-accent-500" />}
              <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-white" : "text-neutral-500 group-hover:text-neutral-300")} />
              <span className="text-sm truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={cn("border-t border-neutral-800", collapsed ? "p-3" : "p-4")}>
        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-md mx-auto bg-neutral-800 hover:bg-neutral-700 transition-colors">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary-600 text-white text-xs">{initials}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48 ml-2">
              <DropdownMenuItem><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive-500"><LogOut className="w-4 h-4 mr-2" />Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full rounded-md p-2 hover:bg-neutral-800 transition-colors">
                <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-primary-600 text-white text-xs">{initials}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0 text-left"><p className="text-sm font-medium text-white truncate">{name}</p><p className="text-xs text-neutral-500 truncate capitalize">{role.toLowerCase()}</p></div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <DropdownMenuItem><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive-500"><LogOut className="w-4 h-4 mr-2" />Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Toggle */}
      <button onClick={onToggle} aria-label={collapsed ? "Expand" : "Collapse"}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-all hover:bg-neutral-700 shadow-sm">
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronLeft className="w-3.5 h-3.5" /></motion.div>
      </button>
    </motion.aside>
  );
}
