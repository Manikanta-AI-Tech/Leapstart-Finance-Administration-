"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, ReceiptText, FileText, IndianRupee, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { scaleIn, backdropVariants } from "@/lib/animations";

interface SearchResult { id: string; type: "student" | "receipt" | "invoice" | "payment"; title: string; subtitle: string; href: string; }

const DATA: SearchResult[] = [
  { id: "s1", type: "student", title: "Rahul Sharma", subtitle: "B.Tech CSE · 2025-2026", href: "/students" },
  { id: "s2", type: "student", title: "Priya Patel", subtitle: "B.Tech ECE · 2025-2026", href: "/students" },
  { id: "s3", type: "student", title: "Arjun Singh", subtitle: "M.Tech AI · 2025-2026", href: "/students" },
  { id: "s4", type: "student", title: "Ananya Gupta", subtitle: "B.Tech IT · 2025-2026", href: "/students" },
  { id: "r1", type: "receipt", title: "LS-2025-000042", subtitle: "₹45,000 · Tuition Fee", href: "/receipts" },
  { id: "r2", type: "receipt", title: "LS-2025-000038", subtitle: "₹25,000 · Admission Fee", href: "/receipts" },
  { id: "r3", type: "receipt", title: "LS-2025-000051", subtitle: "₹12,500 · Exam Fee", href: "/receipts" },
  { id: "i1", type: "invoice", title: "INV-2025-0018", subtitle: "₹1,25,000 · Overdue", href: "/invoices" },
  { id: "i2", type: "invoice", title: "INV-2025-0021", subtitle: "₹85,000 · Sent", href: "/invoices" },
  { id: "p1", type: "payment", title: "Payment #1024", subtitle: "₹45,000 · UPI · 15 Jul 2025", href: "/payments" },
  { id: "p2", type: "payment", title: "Payment #1019", subtitle: "₹25,000 · Bank Transfer · 12 Jul 2025", href: "/payments" },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = { student: GraduationCap, receipt: ReceiptText, invoice: FileText, payment: IndianRupee };
const typeLabels: Record<string, string> = { student: "Students", receipt: "Receipts", invoice: "Invoices", payment: "Payments" };
const typeColors: Record<string, string> = { student: "text-blue-400 bg-blue-500/10", receipt: "text-green-400 bg-green-500/10", invoice: "text-amber-400 bg-amber-500/10", payment: "text-purple-400 bg-purple-500/10" };

interface Props { open: boolean; onClose: () => void; }

export function GlobalSearch({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    return DATA.filter(r => r.title.toLowerCase().includes(lq) || r.subtitle.toLowerCase().includes(lq));
  }, [q]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchResult[]> = {};
    for (const r of results) { const l = typeLabels[r.type]; if (!g[l]) g[l] = []; g[l].push(r); }
    return Object.entries(g);
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  useEffect(() => { if (open) { setQ(""); setIdx(0); } }, [open]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(p => p < flat.length - 1 ? p + 1 : 0); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(p => p > 0 ? p - 1 : flat.length - 1); }
    else if (e.key === "Enter") { e.preventDefault(); if (flat[idx]) { router.push(flat[idx].href); onClose(); } }
    else if (e.key === "Escape") onClose();
  }, [flat, idx, router, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-modal flex items-start justify-center pt-[15vh]">
          <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div variants={scaleIn} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 h-12 border-b border-neutral-200 dark:border-neutral-700">
              <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <input type="text" placeholder="Search students, receipts, invoices..." value={q} onChange={e => { setQ(e.target.value); setIdx(0); }} onKeyDown={handleKey}
                className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400" autoFocus />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-1.5 py-0.5 text-2xs text-neutral-400 font-mono">esc</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {!q.trim() ? (
                <div className="py-8 text-center"><Search className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" /><p className="text-sm text-neutral-400">Type to search across all modules</p></div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center"><File className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" /><p className="text-sm text-neutral-500">No results found</p></div>
              ) : (
                <div className="space-y-1">
                  {grouped.map(([grp, items], gi) => {
                    let gs = 0; for (let i = 0; i < gi; i++) gs += grouped[i][1].length;
                    return (
                      <div key={grp}>
                        <p className="px-3 py-1.5 text-2xs font-medium text-neutral-400 uppercase tracking-wider">{grp}</p>
                        {items.map((item, i) => {
                          const gi_idx = gs + i; const TI = typeIcons[item.type];
                          return (
                            <button key={item.id} type="button" onClick={() => { router.push(item.href); onClose(); }} onMouseEnter={() => setIdx(gi_idx)}
                              className={cn("flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-left transition-colors duration-75",
                                idx === gi_idx ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50")}>
                              <div className={cn("w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0", typeColors[item.type])}><TI className="w-4 h-4" /></div>
                              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.title}</p><p className="text-xs text-neutral-500 truncate">{item.subtitle}</p></div>
                              <span className="text-2xs text-neutral-400 capitalize flex-shrink-0">{item.type}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 px-4 h-9 border-t border-neutral-200 dark:border-neutral-700 text-2xs text-neutral-400">
              <span><kbd className="inline-flex items-center rounded-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-1 py-px font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="inline-flex items-center rounded-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-1 py-px font-mono">↵</kbd> select</span>
              <span><kbd className="inline-flex items-center rounded-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-1 py-px font-mono">esc</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
