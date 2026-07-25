"use client";

import { useCallback, useMemo } from "react";
import { Search, X, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PAYMENT_TYPES,
  PAYMENT_MODES,
  type PaymentType,
  type PaymentMode,
} from "@/lib/constants";
import {
  PAYMENT_TYPE_LABELS,
  PAYMENT_MODE_LABELS,
  type ReceiptSearchFilters,
} from "@/services/receipt.service";

interface ReceiptFiltersProps {
  filters: ReceiptSearchFilters;
  onFiltersChange: (filters: ReceiptSearchFilters) => void;
  totalResults: number;
  filteredCount: number;
}

export function ReceiptFilters({
  filters,
  onFiltersChange,
  totalResults,
  filteredCount,
}: ReceiptFiltersProps) {
  const hasActiveFilters = useMemo(
    () =>
      !!filters.search ||
      (filters.paymentType && filters.paymentType !== "all") ||
      (filters.paymentMode && filters.paymentMode !== "all") ||
      !!filters.dateFrom ||
      !!filters.dateTo,
    [filters],
  );

  const clearFilters = useCallback(() => {
    onFiltersChange({
      search: "",
      paymentType: "all",
      paymentMode: "all",
      dateFrom: "",
      dateTo: "",
    });
  }, [onFiltersChange]);

  const updateFilter = useCallback(
    (key: keyof ReceiptSearchFilters, value: string) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange],
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        "p-3 rounded-md",
        "bg-white dark:bg-neutral-800",
        "border border-neutral-200/60 dark:border-neutral-700",
        "shadow-sm",
      )}
    >
      {/* Row 1: Search + Quick Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by receipt #, student, parent, or phone..."
            value={filters.search ?? ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9 h-10 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Payment Type Filter */}
        <Select
          value={filters.paymentType ?? "all"}
          onValueChange={(v) => updateFilter("paymentType", v)}
        >
          <SelectTrigger className="h-10 w-[170px] text-sm">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PAYMENT_TYPES.map((pt) => (
              <SelectItem key={pt} value={pt}>
                {PAYMENT_TYPE_LABELS[pt as PaymentType] ?? pt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Mode Filter */}
        <Select
          value={filters.paymentMode ?? "all"}
          onValueChange={(v) => updateFilter("paymentMode", v)}
        >
          <SelectTrigger className="h-10 w-[170px] text-sm">
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            {PAYMENT_MODES.map((pm) => (
              <SelectItem key={pm} value={pm}>
                {PAYMENT_MODE_LABELS[pm as PaymentMode] ?? pm}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={cn(
              "text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors whitespace-nowrap",
            )}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Row 2: Date range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0" />
          <Input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="h-10 w-[160px] text-sm"
            placeholder="From"
          />
          <span className="text-xs text-neutral-400">to</span>
          <Input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="h-10 w-[160px] text-sm"
            placeholder="To"
          />
        </div>

        <div className="flex-1" />

        {/* Results count */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Showing{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {filteredCount}
          </span>{" "}
          of{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {totalResults}
          </span>{" "}
          receipts
        </p>
      </div>
    </div>
  );
}
