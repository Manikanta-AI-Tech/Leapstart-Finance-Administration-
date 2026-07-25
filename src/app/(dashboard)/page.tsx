"use client";

import { motion } from "framer-motion";
import {
  IndianRupee,
  Calendar,
  Clock,
  Receipt,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/features/dashboard/stat-card";
import { RecentPayments } from "@/components/features/dashboard/recent-payments";
import { UpcomingDues } from "@/components/features/dashboard/upcoming-dues";
import { DashboardSkeleton } from "@/components/features/dashboard/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useDashboardStats,
  useRecentPayments,
  useUpcomingDues,
} from "@/hooks/use-dashboard";

// Animation variants
const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

function formatINR(amount: number): string {
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
  } = useDashboardStats();
  const {
    data: recentPayments,
    isLoading: paymentsLoading,
  } = useRecentPayments();
  const {
    data: upcomingDues,
    isLoading: duesLoading,
  } = useUpcomingDues();

  const currentMonth = monthNames[new Date().getMonth()];
  const isLoading = statsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 p-6 sm:p-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Overview of collections, payments, and admissions for {currentMonth}
        </p>
      </motion.div>

      {/* Row 1: Analytics Cards (4 cards) */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Today's Collection */}
        <motion.div variants={fadeInUp}>
          <StatCard
            icon={IndianRupee}
            title="Today's Collection"
            value={stats ? formatINR(stats.todayCollection) : "—"}
            trend={
              stats
                ? {
                    value: stats.todayCollectionTrend,
                    direction: stats.todayCollectionTrend >= 0 ? "up" : "down",
                    label: "from yesterday",
                  }
                : undefined
            }
            colorVariant="primary"
            isLoading={statsLoading}
          />
        </motion.div>

        {/* Monthly Collection */}
        <motion.div variants={fadeInUp}>
          <StatCard
            icon={Calendar}
            title="Monthly Collection"
            value={stats ? formatINR(stats.monthlyCollection) : "—"}
            trend={
              stats
                ? {
                    value: stats.monthlyCollectionTrend,
                    direction: stats.monthlyCollectionTrend >= 0 ? "up" : "down",
                    label: "from last month",
                  }
                : undefined
            }
            colorVariant="accent"
            isLoading={statsLoading}
          />
        </motion.div>

        {/* Pending Payments */}
        <motion.div variants={fadeInUp}>
          <StatCard
            icon={Clock}
            title="Pending Payments"
            value={stats ? `${stats.pendingPaymentsCount} (${formatINR(stats.pendingPaymentsAmount)})` : "—"}
            trend={
              stats
                ? {
                    value: Math.abs(stats.pendingPaymentsTrend),
                    direction: stats.pendingPaymentsTrend >= 0 ? "up" : "down",
                    label: "from last week",
                  }
                : undefined
            }
            colorVariant="warning"
            isLoading={statsLoading}
          />
        </motion.div>

        {/* Receipts Generated */}
        <motion.div variants={fadeInUp}>
          <StatCard
            icon={Receipt}
            title="Receipts Generated"
            value={stats ? `${stats.receiptsGeneratedToday} today / ${stats.receiptsGeneratedMonth} month` : "—"}
            trend={
              stats
                ? {
                    value: stats.receiptsTrend,
                    direction: stats.receiptsTrend >= 0 ? "up" : "down",
                    label: "this month",
                  }
                : undefined
            }
            colorVariant="info"
            isLoading={statsLoading}
          />
        </motion.div>
      </motion.div>

      {/* Row 2: Admissions Confirmed + Outstanding Amount */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Admissions Confirmed */}
        <div
          className={cn(
            "rounded-md overflow-hidden",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200/60 dark:border-neutral-800",
            "shadow-sm dark:shadow-sm-dark",
            "p-6",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Admissions Confirmed
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Academic year 2026-27
              </p>
            </div>
            <Badge variant="info">This Year</Badge>
          </div>

          {/* Big number + mini bar chart */}
          <div className="flex items-end gap-6">
            <p className="text-4xl font-bold tabular-nums text-neutral-900 dark:text-white">
              {stats ? stats.admissionsConfirmed : "—"}
            </p>
            <div className="flex items-end gap-1.5 h-16 flex-1">
              {stats?.admissionsMonthly.map((h: number, i: number) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary-200 dark:bg-primary-800 transition-all duration-300"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Target: {stats ? stats.admissionsTarget.toLocaleString("en-IN") : "—"}</span>
            <span className="text-success-600 dark:text-success-400 font-medium">
              {stats
                ? `${((stats.admissionsConfirmed / stats.admissionsTarget) * 100).toFixed(1)}% achieved`
                : "—"}
            </span>
          </div>
        </div>

        {/* Outstanding Amount */}
        <div
          className={cn(
            "rounded-md overflow-hidden",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200/60 dark:border-neutral-800",
            "shadow-sm dark:shadow-sm-dark",
            "p-6",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Outstanding Amount
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Total unpaid fees
              </p>
            </div>
            <Badge variant="warning">Action Needed</Badge>
          </div>

          <p className="text-4xl font-bold tabular-nums text-neutral-900 dark:text-white">
            {stats ? formatINR(stats.outstandingAmount.total) : "—"}
          </p>

          {/* Breakdown */}
          {stats && (
            <div className="mt-4 space-y-3">
              {/* 0-30 days */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    0-30 days
                  </span>
                  <span className="font-medium tabular-nums text-neutral-700 dark:text-neutral-300">
                    {formatINR(stats.outstandingAmount.bucket0to30)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-1">
                  <div
                    className="h-full rounded-full bg-warning-400"
                    style={{
                      width: `${(stats.outstandingAmount.bucket0to30 / stats.outstandingAmount.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 30-60 days */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    30-60 days
                  </span>
                  <span className="font-medium tabular-nums text-neutral-700 dark:text-neutral-300">
                    {formatINR(stats.outstandingAmount.bucket30to60)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-1">
                  <div
                    className="h-full rounded-full bg-destructive-400"
                    style={{
                      width: `${(stats.outstandingAmount.bucket30to60 / stats.outstandingAmount.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 60+ days */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    60+ days
                  </span>
                  <span className="font-medium tabular-nums text-destructive-600 dark:text-destructive-400">
                    {formatINR(stats.outstandingAmount.bucket60plus)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-1">
                  <div
                    className="h-full rounded-full bg-destructive-500"
                    style={{
                      width: `${(stats.outstandingAmount.bucket60plus / stats.outstandingAmount.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Row 3: Recent Payments Table + Upcoming Due Fees */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Payments — 2/3 width */}
        <div className="lg:col-span-2">
          <RecentPayments
            payments={recentPayments}
            isLoading={paymentsLoading}
          />
        </div>

        {/* Upcoming Due Fees — 1/3 width */}
        <div className="lg:col-span-1">
          <UpcomingDues
            dues={upcomingDues}
            isLoading={duesLoading}
          />
        </div>
      </motion.div>
    </div>
  );
}
