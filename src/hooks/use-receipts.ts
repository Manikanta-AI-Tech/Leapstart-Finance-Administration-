"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Receipt } from "@/types/database";
import type { ReceiptFormData, ReceiptFilters } from "@/types/receipt";
import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceiptPdfUrl,
  buildReceiptPDFData,
  generateNewReceiptNumber,
} from "@/services/receipt.service";

export const receiptKeys = {
  all: ["receipts"] as const,
  lists: () => [...receiptKeys.all, "list"] as const,
  list: (filters?: ReceiptFilters) => [...receiptKeys.lists(), filters] as const,
  details: () => [...receiptKeys.all, "detail"] as const,
  detail: (id: string) => [...receiptKeys.details(), id] as const,
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
      queryClient.invalidateQueries({ queryKey: receiptKeys.detail(variables.receiptId) });
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
