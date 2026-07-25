"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useState(() => { setMounted(true); });

  if (!mounted) return <Button variant="ghost" size="icon" className="text-neutral-500"><Sun className="w-5 h-5" /></Button>;

  const isDark = theme === "dark";
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <motion.div key={isDark ? "moon" : "sun"} initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.2 }}>
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.div>
    </Button>
  );
}
