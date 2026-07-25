import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Receipt Generator Form ──────────────────────────────────────────

export const receiptStudentSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  parentName: z.string().min(1, "Parent name is required"),
  applicationId: z
    .string()
    .min(1, "Application ID is required")
    .regex(/^APP-\d{4}$/, "Application ID must match format APP-XXXX"),
  program: z.string().min(1, "Program is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
});

export const receiptPaymentSchema = z.object({
  paymentType: z.string().min(1, "Payment type is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive"),
  transactionId: z.string().optional(),
  date: z.string().min(1, "Payment date is required"),
  remarks: z.string().max(500, "Remarks must be under 500 characters").optional(),
});

export const receiptFormSchema = receiptStudentSchema.merge(receiptPaymentSchema);

export type ReceiptFormInput = z.infer<typeof receiptFormSchema>;
export type ReceiptStudentInput = z.infer<typeof receiptStudentSchema>;
export type ReceiptPaymentInput = z.infer<typeof receiptPaymentSchema>;

// ── Legacy schemas ──────────────────────────────────────────────────

export const receiptFormSchemaLegacy = z.object({
  studentId: z.string().min(1, "Student is required"),
  paymentType: z.string().min(1, "Payment type is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  transactionId: z.string().optional(),
  date: z.date(),
  remarks: z.string().optional(),
});

export type ReceiptFormInputLegacy = z.infer<typeof receiptFormSchemaLegacy>;

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
