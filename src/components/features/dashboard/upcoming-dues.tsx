"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpcomingDue } from "@/services/dashboard.service";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface UpcomingDuesProps {
  dues?: UpcomingDue[];
  isLoading?: boolean;
}

function DaysBadge({ days, overdue }: { days: number; overdue: boolean }) {
  if (overdue) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-destructive-50 dark:bg-destructive-900/30 text-destructive-700 dark:text-destructive-300 border border-destructive-200 dark:border-destructive-800">
        Overdue
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-destructive-50 dark:bg-destructive-900/30 text-destructive-700 dark:text-destructive-300 border border-destructive-200 dark:border-destructive-800">
        {days}d left
      </span>
    );
  }

  if (days <= 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 border border-warning-200 dark:border-warning-800">
        {days}d left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
      {days}d left
    </span>
  );
}

export function UpcomingDues({ dues = [], isLoading = false }: UpcomingDuesProps) {
  return (
    <div
      className={cn(
        "rounded-md overflow-hidden",
        "bg-white dark:bg-neutral-900",
        "border border-neutral-200/60 dark:border-neutral-800",
        "shadow-sm dark:shadow-sm-dark",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Upcoming Due Fees
        </h3>
        <Link
          href="/invoices"
          className={cn(
            "inline-flex items-center gap-1.5",
            "text-sm font-medium text-primary-600 dark:text-primary-400",
            "hover:text-primary-700 dark:hover:text-primary-300",
            "transition-colors duration-150",
          )}
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md",
                  "bg-neutral-50 dark:bg-neutral-800/50",
                  "border border-neutral-100 dark:border-neutral-700",
                )}
              >
                <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-1.5">
                  <Skeleton className="h-4 w-20 ml-auto" />
                  <Skeleton className="h-5 w-12 ml-auto rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : dues.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-success-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              All caught up!
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              No pending due fees
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dues.slice(0, 5).map((due) => (
              <div
                key={due.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md",
                  "bg-neutral-50 dark:bg-neutral-800/50",
                  "border border-neutral-100 dark:border-neutral-700",
                  "transition-colors duration-150",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                )}
              >
                {/* Student avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                    {due.initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {due.studentName}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Due: {new Date(due.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>

                {/* Amount + badge */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">
                    ₹ {due.amount.toLocaleString("en-IN")}
                  </p>
                  <DaysBadge days={due.daysUntilDue} overdue={due.overdue} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
