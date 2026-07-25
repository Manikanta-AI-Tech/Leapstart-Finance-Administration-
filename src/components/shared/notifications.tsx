"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, ReceiptText, IndianRupee, GraduationCap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { dropdownVariants } from "@/lib/animations";

interface Notif { id: string; icon: React.ComponentType<{ className?: string }>; title: string; description: string; timestamp: Date; read: boolean; color: string; }

const MOCK: Notif[] = [
  { id: "1", icon: ReceiptText, title: "Receipt generated", description: "LS-2025-000042 for Rahul Sharma (₹45,000)", timestamp: new Date(Date.now() - 15 * 60000), read: false, color: "text-green-500 bg-green-500/10" },
  { id: "2", icon: IndianRupee, title: "Payment received", description: "UPI payment of ₹25,000 from Priya Patel", timestamp: new Date(Date.now() - 2 * 3600000), read: false, color: "text-blue-500 bg-blue-500/10" },
  { id: "3", icon: GraduationCap, title: "New admission", description: "Ananya Gupta enrolled in B.Tech IT", timestamp: new Date(Date.now() - 5 * 3600000), read: false, color: "text-purple-500 bg-purple-500/10" },
  { id: "4", icon: FileText, title: "Invoice overdue", description: "INV-2025-0018 is overdue", timestamp: new Date(Date.now() - 86400000), read: true, color: "text-amber-500 bg-amber-500/10" },
  { id: "5", icon: ReceiptText, title: "Bulk receipts exported", description: "12 receipts exported to Excel", timestamp: new Date(Date.now() - 2 * 86400000), read: true, color: "text-neutral-500 bg-neutral-500/10" },
];

function ago(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK);
  const unread = useMemo(() => notifs.filter(n => !n.read).length, [notifs]);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive-500 text-white text-[10px] font-bold px-1">{unread > 9 ? "9+" : unread}</span>}
      </Button>
      <AnimatePresence>
        {open && (<>
          <div className="fixed inset-0 z-dropdown" onClick={() => setOpen(false)} />
          <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
            className="absolute right-0 top-full mt-2 w-80 z-dropdown bg-white dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Notifications</h3>
              {unread > 0 && <button onClick={() => setNotifs(p => p.map(n => ({ ...n, read: true })))} className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"><CheckCheck className="w-3.5 h-3.5" />Mark all read</button>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="py-8 text-center"><Bell className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" /><p className="text-sm text-neutral-500">No notifications</p></div>
              ) : notifs.slice(0, 5).map(n => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className={cn("flex gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors", !n.read && "bg-primary-50/50 dark:bg-primary-900/10")}>
                    <div className={cn("w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5", n.color)}><Icon className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{n.title}</p>{!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}</div>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{n.description}</p>
                      <p className="text-2xs text-neutral-400 mt-1">{ago(n.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700">
              <button onClick={() => setOpen(false)} className="w-full px-4 py-2.5 text-center text-sm text-primary-500 hover:text-primary-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium">View all notifications</button>
            </div>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}
