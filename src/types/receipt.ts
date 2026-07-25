import type { Receipt } from "./database";

export type { Receipt };

export interface ReceiptFormData {
  studentId: string;
  paymentType: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  date: Date;
  remarks?: string;
}

export interface ReceiptFilters {
  search?: string;
  studentName?: string;
  receiptNumber?: string;
  paymentType?: string;
  paymentMode?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}
