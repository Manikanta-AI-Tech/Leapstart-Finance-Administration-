import type { PaymentFormData } from "@/types/payment";
import type { Payment } from "@/types/database";

// Payment service — stub for future API integration

export async function getPayments(): Promise<Payment[]> {
  // Stub: Implement when backend is ready
  return [];
}

export async function recordPayment(data: PaymentFormData): Promise<Payment | null> {
  // Stub: Implement when backend is ready
  return null;
}
