import type { Receipt } from "./database";

export type { Receipt };

export interface ReceiptFormData {
  studentName: string;
  parentName: string;
  applicationId: string;
  program: string;
  academicYear: string;
  mobile: string;
  email: string;
  paymentType: string;
  paymentMode: string;
  amount: number;
  transactionId?: string;
  date: string;
  remarks?: string;
}

export interface ReceiptPDFData {
  receiptNo: string;
  date: string;
  studentName: string;
  parentName: string;
  applicationId: string;
  program: string;
  academicYear: string;
  mobile: string;
  email: string;
  paymentType: string;
  paymentMode: string;
  amount: number;
  transactionId?: string;
  paymentDate: string;
  amountInWords: string;
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
