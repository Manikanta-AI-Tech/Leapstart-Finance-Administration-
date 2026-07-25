"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReceiptFilters } from "@/components/features/receipts/receipt-filters";
import { ReceiptTable } from "@/components/features/receipts/receipt-table";
import { ReceiptDetailSheet } from "@/components/features/receipts/receipt-detail-sheet";
import {
  useReceiptSearch,
  useReceiptExport,
  useReceiptStats,
  useSeedMockData,
} from "@/hooks/use-receipts";
import type { ReceiptSearchFilters, EnrichedReceipt } from "@/services/receipt.service";
import { toast } from "sonner";

export default function ReceiptsPage() {
  const router = useRouter();

  // ── Seed mock data on mount ────────────────────────────────────
  const { seed, seeded } = useSeedMockData();
  useEffect(() => {
    seed();
  }, [seed]);

  // ── Filters state ──────────────────────────────────────────────
  const [filters, setFilters] = useState<ReceiptSearchFilters>({
    search: "",
    paymentType: "all",
    paymentMode: "all",
    dateFrom: "",
    dateTo: "",
  });

  // ── Data ───────────────────────────────────────────────────────
  const { data: receipts = [], isLoading } = useReceiptSearch(filters);
  const { data: stats } = useReceiptStats();
  const { exportExcel, exportPDF } = useReceiptExport();

  // ── Detail sheet ───────────────────────────────────────────────
  const [selectedReceipt, setSelectedReceipt] =
    useState<EnrichedReceipt | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleView = useCallback((receipt: EnrichedReceipt) => {
    setSelectedReceipt(receipt);
    setSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetOpen(false);
    // Delay clearing so animation can play
    setTimeout(() => setSelectedReceipt(null), 250);
  }, []);

  // ── Actions ────────────────────────────────────────────────────
  const handleDownload = useCallback(
    (receipt: EnrichedReceipt) => {
      toast.info("PDF download for receipt " + receipt.receiptNumber + " — coming soon");
    },
    [],
  );

  const handleEmail = useCallback(
    (receipt: EnrichedReceipt) => {
      toast.info("Email for receipt " + receipt.receiptNumber + " — coming soon");
    },
    [],
  );

  const handleExportExcel = useCallback(async () => {
    await exportExcel(receipts);
  }, [exportExcel, receipts]);

  const handleExportPDF = useCallback(async () => {
    await exportPDF(receipts);
  }, [exportPDF, receipts]);

  const totalResults = stats?.totalCount ?? receipts.length;
  const filteredCount = receipts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 sm:p-8"
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Receipts
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            View, search, and manage all payment receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default">
                <FileDown className="w-[18px] h-[18px]" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleExportExcel}>
                Export Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Receipt */}
          <Button
            variant="default"
            onClick={() => router.push("/receipts/new")}
          >
            <Plus className="w-[18px] h-[18px]" />
            New Receipt
          </Button>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <ReceiptFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={totalResults}
        filteredCount={filteredCount}
      />

      {/* ── Table ──────────────────────────────────────────────── */}
      <ReceiptTable
        receipts={receipts}
        isLoading={isLoading}
        onView={handleView}
        onDownload={handleDownload}
        onEmail={handleEmail}
      />

      {/* ── Detail Sheet ───────────────────────────────────────── */}
      <ReceiptDetailSheet
        receipt={selectedReceipt}
        open={sheetOpen}
        onClose={handleCloseSheet}
        onDownload={handleDownload}
        onEmail={handleEmail}
      />
    </motion.div>
  );
}
