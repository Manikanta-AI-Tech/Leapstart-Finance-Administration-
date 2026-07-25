"use client";

import { useQuery } from "@tanstack/react-query";
import type { Receipt } from "@/types/database";

// Stub: Replace with real API calls when backend is ready
async function fetchReceipts(): Promise<Receipt[]> {
  return [];
}

async function fetchReceipt(id: string): Promise<Receipt | null> {
  return null;
}

export function useReceipts() {
  return useQuery({
    queryKey: ["receipts"],
    queryFn: fetchReceipts,
    placeholderData: (prev) => prev,
  });
}

export function useReceipt(id: string) {
  return useQuery({
    queryKey: ["receipts", id],
    queryFn: () => fetchReceipt(id),
    enabled: !!id,
  });
}
