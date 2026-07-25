"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import type { Receipt } from "@/types/database";
import type { ReceiptFormData, ReceiptFilters } from "@/types/receipt";
import type { ReceiptSearchFilters } from "@/services/receipt.service";
import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceiptPdfUrl,
  buildReceiptPDFData,
  generateNewReceiptNumber,
  searchReceipts,
  getReceiptStats,
  exportReceiptsToExcel,
  exportReceiptsToPDF,
  seedMockData,
} from "@/services/receipt.service";
import { toast } from "sonner";

export const receiptKeys = {
  all: ["receipts"] as const,
  lists: () => [...receiptKeys.all, "list"] as const,
  list: (filters?: ReceiptFilters) => [...receiptKeys.lists(), filters] as const,
  search: (filters?: ReceiptSearchFilters) =>
    [...receiptKeys.all, "search", filters] as const,
  details: () => [...receiptKeys.all, "detail"] as const,
  detail: (id: string) => [...receiptKeys.details(), id] as const,
  stats: () => [...receiptKeys.all, "stats"] as const,
};

export function useReceipts(filters?: ReceiptFilters) {
  return useQuery({
    queryKey: receiptKeys.list(filters),
    queryFn: () => getReceipts(filters),
    placeholderData: (prev) => prev,
  });
}

export function useReceipt(id: string) {
  return useQuery({
    queryKey: receiptKeys.detail(id),
    queryFn: () => getReceiptById(id),
    enabled: !!id,
  });
}

export function useCreateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ReceiptFormData) => {
      const receipt = await createReceipt(formData);
      const pdfData = buildReceiptPDFData(formData, receipt.receiptNumber);
      return { receipt, pdfData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receiptKeys.lists() });
    },
  });
}

export function useUpdateReceiptPdfUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiptId, pdfUrl }: { receiptId: string; pdfUrl: string }) =>
      updateReceiptPdfUrl(receiptId, pdfUrl),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: receiptKeys.detail(variables.receiptId),
      });
      queryClient.invalidateQueries({ queryKey: receiptKeys.lists() });
    },
  });
}

export function useReceiptNumberPreview() {
  return useQuery({
    queryKey: [...receiptKeys.all, "previewNumber"],
    queryFn: () => generateNewReceiptNumber(),
    staleTime: 0,
  });
}

// ── Search hook ─────────────────────────────────────────────────────

export function useReceiptSearch(filters?: ReceiptSearchFilters) {
  return useQuery({
    queryKey: receiptKeys.search(filters),
    queryFn: () => searchReceipts(filters),
    placeholderData: (prev) => prev,
  });
}

// ── Stats hook ──────────────────────────────────────────────────────

export function useReceiptStats() {
  return useQuery({
    queryKey: receiptKeys.stats(),
    queryFn: () => getReceiptStats(),
    refetchInterval: 30_000,
  });
}

// ── Export hooks ────────────────────────────────────────────────────

export function useReceiptExport() {
  const exportingRef = useRef(false);

  const exportExcel = useCallback(
    async (receipts: Awaited<ReturnType<typeof searchReceipts>>) => {
      if (exportingRef.current || receipts.length === 0) return;
      exportingRef.current = true;
      try {
        toast.loading("Generating Excel file...");
        await exportReceiptsToExcel(receipts);
        toast.success("Excel exported successfully!");
      } catch (error) {
        toast.error("Failed to export Excel");
      } finally {
        exportingRef.current = false;
      }
    },
    [],
  );

  const exportPDF = useCallback(
    async (receipts: Awaited<ReturnType<typeof searchReceipts>>) => {
      if (exportingRef.current || receipts.length === 0) return;
      exportingRef.current = true;
      try {
        toast.loading("Generating PDF file...");
        await exportReceiptsToPDF(receipts);
        toast.success("PDF exported successfully!");
      } catch (error) {
        toast.error("Failed to export PDF");
      } finally {
        exportingRef.current = false;
      }
    },
    [],
  );

  return { exportExcel, exportPDF };
}

// ── Seed hook (for development) ─────────────────────────────────────

export function useSeedMockData() {
  const queryClient = useQueryClient();
  const [seeded, setSeeded] = useState(false);

  const seed = useCallback(() => {
    if (seeded) return;
    seedMockData();
    setSeeded(true);
    queryClient.invalidateQueries({ queryKey: receiptKeys.all });
  }, [seeded, queryClient]);

  return { seed, seeded };
}
