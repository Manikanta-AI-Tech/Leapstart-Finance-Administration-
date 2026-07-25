import type { Invoice } from "./database";

export type { Invoice };

export interface InvoiceFormData {
  studentId: string;
  amount: number;
  dueDate: Date;
  status: string;
}

export interface InvoiceFilters {
  search?: string;
  studentName?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
