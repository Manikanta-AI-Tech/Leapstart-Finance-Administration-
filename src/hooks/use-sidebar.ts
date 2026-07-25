"use client";
import { useState, useEffect, useCallback } from "react";

const KEY = "leapstart-sidebar-collapsed";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s !== null) setCollapsed(s === "true"); } catch {}
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(p => { const n = !p; try { localStorage.setItem(KEY, String(n)); } catch {} return n; });
  }, []);

  return { collapsed, mobileOpen, isMobile, toggleCollapsed, toggleMobile: () => setMobileOpen(p => !p), closeMobile: () => setMobileOpen(false) };
}
