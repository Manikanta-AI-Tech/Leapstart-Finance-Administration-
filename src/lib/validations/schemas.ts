import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const receiptFormSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  paymentType: z.string().min(1, "Payment type is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  transactionId: z.string().optional(),
  date: z.date(),
  remarks: z.string().optional(),
});

export type ReceiptFormInput = z.infer<typeof receiptFormSchema>;

export const studentFormSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  parentName: z.string().optional(),
  applicationId: z.string().optional(),
  program: z.string().min(1, "Program is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  mobile: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type StudentFormInput = z.infer<typeof studentFormSchema>;

export const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentType: z.string().min(1, "Payment type is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  transactionId: z.string().optional(),
  date: z.date(),
  remarks: z.string().optional(),
});

export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
