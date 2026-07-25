"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
    label?: string;
  };
  isLoading?: boolean;
  className?: string;
  colorVariant?: "primary" | "accent" | "warning" | "info" | "success" | "destructive";
}

const colorMap = {
  primary: {
    bg: "bg-primary-50 dark:bg-primary-900/40",
    icon: "text-primary-600 dark:text-primary-400",
  },
  accent: {
    bg: "bg-accent-50 dark:bg-accent-900/30",
    icon: "text-accent-600 dark:text-accent-400",
  },
  warning: {
    bg: "bg-warning-50 dark:bg-warning-900/30",
    icon: "text-warning-600 dark:text-warning-400",
  },
  info: {
    bg: "bg-info-50 dark:bg-info-900/30",
    icon: "text-info-600 dark:text-info-400",
  },
  success: {
    bg: "bg-success-50 dark:bg-success-900/30",
    icon: "text-success-600 dark:text-success-400",
  },
  destructive: {
    bg: "bg-destructive-50 dark:bg-destructive-900/30",
    icon: "text-destructive-600 dark:text-destructive-400",
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading = false,
  className,
  colorVariant = "primary",
}: StatCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md p-5",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200/60 dark:border-neutral-800",
          "shadow-sm",
          className,
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-24 mb-2" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  const colors = colorMap[colorVariant];

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "relative overflow-hidden",
        "rounded-md p-5",
        "bg-white dark:bg-neutral-900",
        "border border-neutral-200/60 dark:border-neutral-800",
        "shadow-sm dark:shadow-sm-dark",
        "transition-shadow duration-150 ease-out",
        "hover:shadow-md dark:hover:shadow-md-dark",
        "group cursor-default",
        className,
      )}
    >
      {/* Subtle glass shimmer on hover */}
      <div className="absolute inset-0 rounded-md bg-white/5 dark:bg-white/[0.02] backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon + Label row */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "flex items-center justify-center",
            "w-10 h-10 rounded-md",
            colors.bg,
          )}
        >
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {title}
        </span>
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white mb-1">
        {value}
      </p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1">
          {trend.direction === "up" ? (
            <TrendingUp className="w-4 h-4 text-success-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive-500" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend.direction === "up"
                ? "text-success-600 dark:text-success-400"
                : "text-destructive-600 dark:text-destructive-400",
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </span>
          {trend.label && (
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
