import type { ReceiptFormData, ReceiptFilters } from "@/types/receipt";
import type { Receipt } from "@/types/database";

// Receipt service — stub for future API integration

export async function generateReceipt(data: ReceiptFormData): Promise<Receipt | null> {
  // Stub: Implement when backend is ready
  return null;
}

export async function getReceipts(filters?: ReceiptFilters): Promise<Receipt[]> {
  // Stub: Implement when backend is ready
  return [];
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
  // Stub: Implement when backend is ready
  return null;
}
