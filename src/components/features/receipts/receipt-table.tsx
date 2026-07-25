"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Eye,
  Download,
  Mail,
  ChevronLeft,
  ChevronRight,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type EnrichedReceipt,
  PAYMENT_TYPE_LABELS,
  PAYMENT_MODE_LABELS,
} from "@/services/receipt.service";
import type { PaymentType, PaymentMode } from "@/lib/constants";
import { ReceiptCard } from "./receipt-card";

interface ReceiptTableProps {
  receipts: EnrichedReceipt[];
  isLoading: boolean;
  onView: (receipt: EnrichedReceipt) => void;
  onDownload: (receipt: EnrichedReceipt) => void;
  onEmail: (receipt: EnrichedReceipt) => void;
}

const columnHelper = createColumnHelper<EnrichedReceipt>();

const formatAmount = (amount: number) =>
  `\u20B9 ${amount.toLocaleString("en-IN")}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export function ReceiptTable({
  receipts,
  isLoading,
  onView,
  onDownload,
  onEmail,
}: ReceiptTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo<ColumnDef<EnrichedReceipt, any>[]>(
    () => [
      columnHelper.accessor("receiptNumber", {
        header: "Receipt #",
        cell: (info) => (
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tabular-nums whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
        size: 160,
      }),
      columnHelper.accessor("studentName", {
        header: "Student",
        cell: (info) => (
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[140px]">
              {info.getValue()}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {info.row.original.applicationId}
            </p>
          </div>
        ),
        size: 180,
      }),
      columnHelper.accessor("parentName", {
        header: "Parent",
        cell: (info) => (
          <div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">
              {info.getValue()}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {info.row.original.mobile}
            </p>
          </div>
        ),
        size: 180,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white whitespace-nowrap">
            {formatAmount(info.getValue())}
          </span>
        ),
        size: 120,
        meta: { align: "right" as const },
      }),
      columnHelper.accessor("paymentType", {
        header: "Type",
        cell: (info) => {
          const val = info.getValue() as string;
          return (
            <Badge variant="default">
              {PAYMENT_TYPE_LABELS[val as PaymentType] ?? val}
            </Badge>
          );
        },
        size: 140,
      }),
      columnHelper.accessor("paymentMode", {
        header: "Mode",
        cell: (info) => {
          const val = info.getValue() as string;
          let variant: "success" | "warning" | "info" | "default" = "default";
          if (val === "CASH") variant = "success";
          else if (val === "UPI") variant = "info";
          else if (val === "CHEQUE" || val === "DD") variant = "warning";

          return (
            <Badge variant={variant}>
              {PAYMENT_MODE_LABELS[val as PaymentMode] ?? val}
            </Badge>
          );
        },
        size: 130,
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
            {formatDate(info.getValue())}
          </span>
        ),
        size: 110,
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(info.row.original);
              }}
              className={cn(
                "p-1.5 rounded-md",
                "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                "transition-colors duration-150",
              )}
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(info.row.original);
              }}
              className={cn(
                "p-1.5 rounded-md",
                "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                "transition-colors duration-150",
              )}
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmail(info.row.original);
              }}
              className={cn(
                "p-1.5 rounded-md",
                "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                "transition-colors duration-150",
              )}
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        ),
        size: 130,
      }),
    ],
    [onView, onDownload, onEmail],
  );

  const table = useReactTable({
    data: receipts,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = receipts.length;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  // ── Loading state ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-md overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Receipt #",
                  "Student",
                  "Parent",
                  "Amount",
                  "Type",
                  "Mode",
                  "Date",
                  "",
                ].map((h, i) => (
                  <TableHead
                    key={i}
                    className="bg-neutral-50 dark:bg-neutral-800/50 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────
  if (receipts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex flex-col items-center py-16 px-6",
          "rounded-md bg-white dark:bg-neutral-800",
          "border border-neutral-200/60 dark:border-neutral-700",
          "shadow-sm",
        )}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full",
            "bg-neutral-100 dark:bg-neutral-700",
            "flex items-center justify-center mb-5",
          )}
        >
          <ReceiptIcon className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
          No receipts found
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 text-center max-w-sm">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </motion.div>
    );
  }

  // ── Data state ─────────────────────────────────────────────────
  return (
    <div className="rounded-md overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 shadow-sm">
      {/* Mobile: Card view */}
      <div className="sm:hidden">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {table.getRowModel().rows.map((row, idx) => (
            <ReceiptCard
              key={row.original.id}
              receipt={row.original}
              onView={onView}
              onDownload={onDownload}
              onEmail={onEmail}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const align =
                    (header.column.columnDef.meta as { align?: string } | undefined)?.align ?? "left";

                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        isSortable
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={cn(
                        "bg-neutral-50 dark:bg-neutral-800/50",
                        "text-xs font-medium uppercase tracking-wider",
                        "text-neutral-500 dark:text-neutral-400",
                        "first:pl-6 last:pr-6",
                        isSortable && "cursor-pointer select-none hover:text-neutral-700 dark:hover:text-neutral-200",
                        align === "right" && "text-right",
                        align === "center" && "text-center",
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : header.column.columnDef.header as string}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "transition-colors duration-100",
                  "hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
                  "cursor-pointer",
                )}
                onClick={() => onView(row.original)}
              >
                {row.getVisibleCells().map((cell) => {
                  const align =
                    (cell.column.columnDef.meta as { align?: string } | undefined)?.align ?? "left";
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "first:pl-6 last:pr-6",
                        align === "right" && "text-right",
                        align === "center" && "text-center",
                      )}
                    >
                      {cell.renderValue() as React.ReactNode}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div
        className={cn(
          "flex items-center justify-between",
          "px-6 py-3",
          "border-t border-neutral-100 dark:border-neutral-700",
          "bg-neutral-50/50 dark:bg-neutral-800/30",
        )}
      >
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Showing{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {startRow}-{endRow}
          </span>{" "}
          of{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {totalRows}
          </span>{" "}
          receipts
        </p>

        <div className="flex items-center gap-1">
          {/* Page size selector */}
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              table.setPageSize(Number(v));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {[10, 25, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            disabled={pageIndex === 0}
            onClick={() => table.previousPage()}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md",
              "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white",
              "hover:bg-neutral-200 dark:hover:bg-neutral-700",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "transition-colors duration-150",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
            let pageNum: number;
            if (pageCount <= 5) {
              pageNum = i;
            } else if (pageIndex < 2) {
              pageNum = i;
            } else if (pageIndex > pageCount - 3) {
              pageNum = pageCount - 5 + i;
            } else {
              pageNum = pageIndex - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => table.setPageIndex(pageNum)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md text-xs",
                  "transition-colors duration-150",
                  pageNum === pageIndex
                    ? "bg-primary-500 text-white font-medium"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700",
                )}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            disabled={pageIndex >= pageCount - 1}
            onClick={() => table.nextPage()}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md",
              "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white",
              "hover:bg-neutral-200 dark:hover:bg-neutral-700",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "transition-colors duration-150",
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
