"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentPayment } from "@/services/dashboard.service";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

interface RecentPaymentsProps {
  payments?: RecentPayment[];
  isLoading?: boolean;
}

const statusBadgeVariant: Record<string, "success" | "warning" | "destructive"> =
  {
    paid: "success",
    pending: "warning",
    failed: "destructive",
  };

const statusLabel: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

export function RecentPayments({ payments = [], isLoading = false }: RecentPaymentsProps) {
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
          Recent Payments
        </h3>
        <Link
          href="/receipts"
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

      {/* Desktop table — hidden on mobile */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Receipt #
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Student
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">
                Amount
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Payment Type
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Date
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      No payments recorded yet
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      Payments will appear here once you start generating receipts
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-100"
                >
                  <TableCell className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {payment.receiptNo}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-700 dark:text-neutral-300">
                    {payment.studentName}
                  </TableCell>
                  <TableCell className="text-sm text-right tabular-nums font-medium text-neutral-900 dark:text-white">
                    ₹ {payment.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500 dark:text-neutral-400">
                    {payment.paymentType}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500 dark:text-neutral-400">
                    {payment.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[payment.status]}>
                      {statusLabel[payment.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))
        ) : payments.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <FileText className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                No payments recorded yet
              </p>
            </div>
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 transition-colors duration-100 active:bg-neutral-50 dark:active:bg-neutral-800/50"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {payment.receiptNo}
                </span>
                <Badge variant={statusBadgeVariant[payment.status]}>
                  {statusLabel[payment.status]}
                </Badge>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                {payment.studentName}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">
                  ₹ {payment.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {payment.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
