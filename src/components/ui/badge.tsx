import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "accent" | "outline";
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800",
  success:
    "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300 border-success-200 dark:border-success-800",
  warning:
    "bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 border-warning-200 dark:border-warning-800",
  destructive:
    "bg-destructive-50 text-destructive-700 dark:bg-destructive-900/30 dark:text-destructive-300 border-destructive-200 dark:border-destructive-800",
  info: "bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-300 border-info-200 dark:border-info-800",
  accent:
    "bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300 border-accent-200 dark:border-accent-800",
  outline:
    "bg-transparent text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
