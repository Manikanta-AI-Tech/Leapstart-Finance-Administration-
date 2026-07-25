"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Notifications } from "@/components/shared/notifications";
import { GlobalSearch } from "@/components/shared/global-search";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/lib/constants";

interface HeaderProps { onMenuClick: () => void; }

function getTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  const item = NAV_ITEMS.find(i => i.href !== "/" && pathname.startsWith(i.href));
  return item?.label ?? "Dashboard";
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuthContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const initials = profile ? (profile.fullName ?? profile.email ?? "U").split(/[\s.@]+/).slice(0, 2).map((n: string) => n[0]?.toUpperCase() ?? "").join("") : "U";
  const name = profile?.fullName ?? profile?.email ?? "User";
  const role = profile?.role ?? "Viewer";

  return (<>
    <header className="sticky top-0 z-sticky h-16 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-glass border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-4 px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <Button variant="ghost" size="icon" className="md:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white" onClick={onMenuClick} aria-label="Open menu"><Menu className="w-5 h-5" /></Button>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">{getTitle(pathname)}</h1>
      </div>

      <button onClick={() => setSearchOpen(true)}
        className="hidden sm:flex items-center gap-2 flex-1 max-w-md mx-auto h-9 px-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1.5 py-0.5 text-2xs text-neutral-400 font-mono"><span className="text-[10px]">⌘</span>K</kbd>
      </button>

      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="sm:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white" onClick={() => setSearchOpen(true)} aria-label="Search"><Search className="w-5 h-5" /></Button>
        <ThemeToggle />
        <Notifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-1 rounded-full">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary-600 text-white text-xs">{initials}</AvatarFallback></Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-600 text-white text-xs">{initials}</AvatarFallback></Avatar>
              <div className="min-w-0"><p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{name}</p><p className="text-xs text-neutral-500 capitalize">{role.toLowerCase()}</p></div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive-500"><LogOut className="w-4 h-4 mr-2" />Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
  </>);
}
