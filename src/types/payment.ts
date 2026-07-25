import type { Payment } from "./database";

export type { Payment };

export interface PaymentFormData {
  studentId: string;
  amount: number;
  paymentType: string;
  paymentMode: string;
  transactionId?: string;
  date: Date;
  remarks?: string;
}

export interface PaymentFilters {
  search?: string;
  studentName?: string;
  paymentType?: string;
  paymentMode?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
