"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 sm:p-8">
      {/* Page heading */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>

      {/* Analytics cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-md p-5",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200/60 dark:border-neutral-800",
              "shadow-sm",
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
        ))}
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={cn(
            "rounded-md p-6",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200/60 dark:border-neutral-800",
            "shadow-sm",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-end gap-6">
            <Skeleton className="h-10 w-24" />
            <div className="flex items-end gap-1.5 h-16">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-3 rounded-t-sm"
                  style={{ height: `${30 + Math.random() * 50}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <div
          className={cn(
            "rounded-md p-6",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200/60 dark:border-neutral-800",
            "shadow-sm",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-36 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className={cn(
              "rounded-md overflow-hidden",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200/60 dark:border-neutral-800",
              "shadow-sm",
            )}
          >
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-3">
                  <div className="flex gap-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className={cn(
              "rounded-md overflow-hidden",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200/60 dark:border-neutral-800",
              "shadow-sm",
            )}
          >
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="p-4 space-y-3">
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
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
