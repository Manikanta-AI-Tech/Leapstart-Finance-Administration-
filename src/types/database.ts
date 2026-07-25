import type { Role, PaymentType, PaymentMode, InvoiceStatus } from "@/lib/constants";

export interface Profile {
  id: string;
  userId: string;
  email: string;
  role: Role;
  fullName: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  parentName: string | null;
  applicationId: string | null;
  program: string;
  academicYear: string;
  mobile: string | null;
  email: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  studentId: string;
  paymentType: PaymentType;
  amount: number;
  paymentMode: PaymentMode;
  transactionId: string | null;
  date: Date;
  remarks: string | null;
  pdfUrl: string | null;
  createdAt: Date;
  generatedById: string;
  generatedBy?: Profile;
  student?: Student;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  transactionId: string | null;
  date: Date;
  remarks: string | null;
  createdAt: Date;
  student?: Student;
}

export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}
