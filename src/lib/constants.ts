export const ROLES = [
  "ADMIN",
  "FINANCE",
  "ADMISSIONS",
  "COUNSELLOR",
  "VIEWER",
] as const;

export const PAYMENT_TYPES = [
  "TUITION_FEE",
  "ADMISSION_FEE",
  "EXAM_FEE",
  "TRANSPORT_FEE",
  "HOSTEL_FEE",
  "LIBRARY_FEE",
  "LAB_FEE",
  "OTHER",
] as const;

export const PAYMENT_MODES = [
  "CASH",
  "CHEQUE",
  "UPI",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "DD",
] as const;

export const INVOICE_STATUSES = [
  "DRAFT",
  "SENT",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Admissions", href: "/admissions", icon: "ClipboardList" },
  { label: "Students", href: "/students", icon: "GraduationCap" },
  { label: "Payments", href: "/payments", icon: "IndianRupee" },
  { label: "Receipts", href: "/receipts", icon: "Receipt" },
  { label: "Invoices", href: "/invoices", icon: "FileText" },
  { label: "Scholarships", href: "/scholarships", icon: "Award" },
  { label: "Reports", href: "/reports", icon: "BarChart3" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export type Role = (typeof ROLES)[number];
export type PaymentType = (typeof PAYMENT_TYPES)[number];
export type PaymentMode = (typeof PAYMENT_MODES)[number];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export type NavItem = (typeof NAV_ITEMS)[number];
