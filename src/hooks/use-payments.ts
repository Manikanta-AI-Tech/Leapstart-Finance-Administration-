"use client";

import { useQuery } from "@tanstack/react-query";
import type { Payment } from "@/types/database";

// Stub: Replace with real API calls when backend is ready
async function fetchPayments(): Promise<Payment[]> {
  return [];
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    placeholderData: (prev) => prev,
  });
}
