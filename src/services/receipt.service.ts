import type { Receipt } from "@/types/database";
import type { ReceiptFormData, ReceiptPDFData, ReceiptFilters } from "@/types/receipt";
import { generateReceiptNumber } from "@/lib/receipt-number";
import { amountToWords } from "@/lib/amount-to-words";
import { PAYMENT_TYPES, PAYMENT_MODES, type PaymentType, type PaymentMode } from "@/lib/constants";

// ── Display label maps ────────────────────────────────────────────────

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  TUITION_FEE: "Tuition Fee",
  ADMISSION_FEE: "Admission Fee",
  EXAM_FEE: "Exam Fee",
  TRANSPORT_FEE: "Transport Fee",
  HOSTEL_FEE: "Hostel Fee",
  LIBRARY_FEE: "Library Fee",
  LAB_FEE: "Lab Fee",
  OTHER: "Other",
};

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  CASH: "Cash",
  CHEQUE: "Cheque",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  DD: "DD",
};

// ── In-memory store ─────────────────────────────────────────────────

const receiptStore = new Map<string, Receipt>();
let nextNumericId = 1;

function generateId(): string {
  return `rec_${String(nextNumericId++).padStart(8, "0")}`;
}

// ── Public API ──────────────────────────────────────────────────────

export function generateNewReceiptNumber(): string {
  return generateReceiptNumber();
}

export function buildReceiptPDFData(
  formData: ReceiptFormData,
  receiptNumber: string,
): ReceiptPDFData {
  return {
    receiptNo: receiptNumber,
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    studentName: formData.studentName,
    parentName: formData.parentName,
    applicationId: formData.applicationId,
    program: formData.program,
    academicYear: formData.academicYear,
    mobile: formData.mobile,
    email: formData.email,
    paymentType: formData.paymentType,
    paymentMode: formData.paymentMode,
    amount: formData.amount,
    transactionId: formData.transactionId,
    paymentDate: formData.date,
    amountInWords: amountToWords(formData.amount),
    remarks: formData.remarks,
  };
}

export async function createReceipt(formData: ReceiptFormData): Promise<Receipt> {
  const id = generateId();
  const receiptNumber = generateReceiptNumber();
  const now = new Date();

  const receipt: Receipt = {
    id,
    receiptNumber,
    studentId: `student_${formData.applicationId}`,
    paymentType: formData.paymentType as Receipt["paymentType"],
    amount: formData.amount,
    paymentMode: formData.paymentMode as Receipt["paymentMode"],
    transactionId: formData.transactionId ?? null,
    date: new Date(formData.date),
    remarks: formData.remarks ?? null,
    pdfUrl: null,
    createdAt: now,
    generatedById: "user_current",
  };

  receiptStore.set(id, receipt);
  _receiptFormDataStore.set(id, formData);
  return receipt;
}

const _receiptFormDataStore = new Map<string, ReceiptFormData>();

export function getReceiptFormData(receiptId: string): ReceiptFormData | undefined {
  return _receiptFormDataStore.get(receiptId);
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
  return receiptStore.get(id) ?? null;
}

// ── Enriched receipt type for the UI ────────────────────────────────

export interface EnrichedReceipt extends Receipt {
  studentName: string;
  parentName: string;
  applicationId: string;
  program: string;
  academicYear: string;
  mobile: string;
  email: string;
}

function enrichReceipt(receipt: Receipt): EnrichedReceipt {
  const formData = _receiptFormDataStore.get(receipt.id);
  return {
    ...receipt,
    studentName: formData?.studentName ?? "Unknown Student",
    parentName: formData?.parentName ?? "Unknown Parent",
    applicationId: formData?.applicationId ?? receipt.studentId,
    program: formData?.program ?? "N/A",
    academicYear: formData?.academicYear ?? "2025-2026",
    mobile: formData?.mobile ?? "N/A",
    email: formData?.email ?? "N/A",
  };
}

// ── Search & filter ─────────────────────────────────────────────────

export interface ReceiptSearchFilters {
  search?: string;
  paymentType?: string;
  paymentMode?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function searchReceipts(
  filters?: ReceiptSearchFilters,
): Promise<EnrichedReceipt[]> {
  let receipts = Array.from(receiptStore.values()).map(enrichReceipt);

  if (filters) {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      receipts = receipts.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(s) ||
          r.studentName.toLowerCase().includes(s) ||
          r.parentName.toLowerCase().includes(s) ||
          r.mobile.toLowerCase().includes(s) ||
          (r.transactionId?.toLowerCase().includes(s) ?? false),
      );
    }
    if (filters.paymentType && filters.paymentType !== "all") {
      receipts = receipts.filter((r) => r.paymentType === filters.paymentType);
    }
    if (filters.paymentMode && filters.paymentMode !== "all") {
      receipts = receipts.filter((r) => r.paymentMode === filters.paymentMode);
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      from.setHours(0, 0, 0, 0);
      receipts = receipts.filter((r) => r.date >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      receipts = receipts.filter((r) => r.date <= to);
    }
  }

  receipts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return receipts;
}

export async function getReceipts(filters?: ReceiptFilters): Promise<Receipt[]> {
  let receipts = Array.from(receiptStore.values());

  if (filters) {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      receipts = receipts.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(s) ||
          (r.transactionId?.toLowerCase().includes(s) ?? false),
      );
    }
    if (filters.paymentType) {
      receipts = receipts.filter((r) => r.paymentType === filters.paymentType);
    }
    if (filters.paymentMode) {
      receipts = receipts.filter((r) => r.paymentMode === filters.paymentMode);
    }
    if (filters.dateFrom) {
      receipts = receipts.filter((r) => r.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      receipts = receipts.filter((r) => r.date <= filters.dateTo!);
    }
    if (filters.amountMin !== undefined) {
      receipts = receipts.filter((r) => r.amount >= filters.amountMin!);
    }
    if (filters.amountMax !== undefined) {
      receipts = receipts.filter((r) => r.amount <= filters.amountMax!);
    }
  }

  receipts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return receipts;
}

export async function updateReceiptPdfUrl(
  receiptId: string,
  pdfUrl: string,
): Promise<void> {
  const receipt = receiptStore.get(receiptId);
  if (receipt) {
    receipt.pdfUrl = pdfUrl;
    receiptStore.set(receiptId, receipt);
  }
}

// ── Stats ───────────────────────────────────────────────────────────

export interface ReceiptStats {
  totalCount: number;
  totalAmount: number;
  todayCount: number;
  todayAmount: number;
  thisMonthCount: number;
  thisMonthAmount: number;
}

export async function getReceiptStats(): Promise<ReceiptStats> {
  const receipts = Array.from(receiptStore.values());
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayReceipts = receipts.filter((r) => r.date >= todayStart);
  const monthReceipts = receipts.filter((r) => r.date >= monthStart);

  return {
    totalCount: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amount, 0),
    todayCount: todayReceipts.length,
    todayAmount: todayReceipts.reduce((sum, r) => sum + r.amount, 0),
    thisMonthCount: monthReceipts.length,
    thisMonthAmount: monthReceipts.reduce((sum, r) => sum + r.amount, 0),
  };
}

// ── Export ──────────────────────────────────────────────────────────

export async function exportReceiptsToExcel(
  receipts: EnrichedReceipt[],
): Promise<void> {
  const XLSX = await import("xlsx");

  const rows = receipts.map((r) => ({
    "Receipt #": r.receiptNumber,
    "Student Name": r.studentName,
    "Parent Name": r.parentName,
    "Application ID": r.applicationId,
    Program: r.program,
    Amount: r.amount,
    "Payment Type": PAYMENT_TYPE_LABELS[r.paymentType as PaymentType] ?? r.paymentType,
    "Payment Mode": PAYMENT_MODE_LABELS[r.paymentMode as PaymentMode] ?? r.paymentMode,
    "Transaction ID": r.transactionId ?? "",
    Date: r.date.toLocaleDateString("en-IN"),
    Remarks: r.remarks ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Receipts");

  const colWidths = [
    { wch: 18 },
    { wch: 22 },
    { wch: 22 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 16 },
    { wch: 14 },
    { wch: 18 },
    { wch: 14 },
    { wch: 20 },
  ];
  ws["!cols"] = colWidths;

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `receipts-export-${dateStr}.xlsx`);
}

export async function exportReceiptsToPDF(
  receipts: EnrichedReceipt[],
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape" });

  // Brand header
  doc.setFillColor(16, 85, 109); // primary-500
  doc.rect(0, 0, doc.internal.pageSize.width, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("LeapStart School of Technology — Receipts Export", 10, 12);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, doc.internal.pageSize.width - 10, 12, { align: "right" });

  const rows = receipts.map((r) => [
    r.receiptNumber,
    r.studentName,
    r.parentName,
    `\u20B9 ${r.amount.toLocaleString("en-IN")}`,
    PAYMENT_TYPE_LABELS[r.paymentType as PaymentType] ?? r.paymentType,
    PAYMENT_MODE_LABELS[r.paymentMode as PaymentMode] ?? r.paymentMode,
    r.date.toLocaleDateString("en-IN"),
    r.transactionId ?? "",
  ]);

  (doc as any).autoTable({
    head: [["Receipt #", "Student", "Parent", "Amount", "Type", "Mode", "Date", "Transaction ID"]],
    body: rows,
    startY: 22,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      font: "helvetica",
    },
    headStyles: {
      fillColor: [16, 85, 109],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 22 },
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`receipts-export-${dateStr}.pdf`);
}

// ── Mock data seed ──────────────────────────────────────────────────

const MOCK_DATA: Array<{
  receiptNumber: string;
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
  transactionId: string | null;
  date: string;
  remarks: string | null;
}> = [
  {
    receiptNumber: "LS-2026-000142",
    studentName: "Rahul Sharma",
    parentName: "Vikram Sharma",
    applicationId: "LS2026001",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543210",
    email: "rahul.s@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "UPI",
    amount: 85000,
    transactionId: "TXN987654321",
    date: "2026-07-22",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000143",
    studentName: "Priya Patel",
    parentName: "Rajesh Patel",
    applicationId: "LS2026002",
    program: "B.Tech ECE",
    academicYear: "2025-2026",
    mobile: "9876543211",
    email: "priya.p@example.com",
    paymentType: "ADMISSION_FEE",
    paymentMode: "BANK_TRANSFER",
    amount: 25000,
    transactionId: "TXN987654322",
    date: "2026-07-21",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000144",
    studentName: "Amit Kumar",
    parentName: "Suresh Kumar",
    applicationId: "LS2026003",
    program: "B.Tech ME",
    academicYear: "2025-2026",
    mobile: "9876543212",
    email: "amit.k@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "CASH",
    amount: 75000,
    transactionId: null,
    date: "2026-07-20",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000145",
    studentName: "Neha Gupta",
    parentName: "Sunil Gupta",
    applicationId: "LS2026004",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543213",
    email: "neha.g@example.com",
    paymentType: "HOSTEL_FEE",
    paymentMode: "UPI",
    amount: 45000,
    transactionId: "TXN987654324",
    date: "2026-07-19",
    remarks: "Hostel fee for semester 1",
  },
  {
    receiptNumber: "LS-2026-000146",
    studentName: "Sandeep Reddy",
    parentName: "Venkat Reddy",
    applicationId: "LS2026005",
    program: "B.Tech EEE",
    academicYear: "2025-2026",
    mobile: "9876543214",
    email: "sandeep.r@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "CHEQUE",
    amount: 82000,
    transactionId: "CHQ456789",
    date: "2026-07-18",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000147",
    studentName: "Ananya Iyer",
    parentName: "Krishnan Iyer",
    applicationId: "LS2026006",
    program: "M.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543215",
    email: "ananya.i@example.com",
    paymentType: "ADMISSION_FEE",
    paymentMode: "CREDIT_CARD",
    amount: 35000,
    transactionId: "TXN987654326",
    date: "2026-07-17",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000148",
    studentName: "Mohammed Faisal",
    parentName: "Abdul Rahman",
    applicationId: "LS2026007",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543216",
    email: "faisal.m@example.com",
    paymentType: "TRANSPORT_FEE",
    paymentMode: "CASH",
    amount: 18000,
    transactionId: null,
    date: "2026-07-16",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000149",
    studentName: "Kavya Nair",
    parentName: "Mohan Nair",
    applicationId: "LS2026008",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543217",
    email: "kavya.n@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "BANK_TRANSFER",
    amount: 250000,
    transactionId: "TXN987654328",
    date: "2026-07-15",
    remarks: "Full year payment",
  },
  {
    receiptNumber: "LS-2026-000150",
    studentName: "Rohit Verma",
    parentName: "Anil Verma",
    applicationId: "LS2026009",
    program: "B.Tech CE",
    academicYear: "2025-2026",
    mobile: "9876543218",
    email: "rohit.v@example.com",
    paymentType: "EXAM_FEE",
    paymentMode: "UPI",
    amount: 5000,
    transactionId: "TXN987654329",
    date: "2026-07-14",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000151",
    studentName: "Divya Singh",
    parentName: "Rajendra Singh",
    applicationId: "LS2026010",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543219",
    email: "divya.s@example.com",
    paymentType: "LIBRARY_FEE",
    paymentMode: "DEBIT_CARD",
    amount: 8000,
    transactionId: "TXN987654330",
    date: "2026-07-13",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000152",
    studentName: "Arjun Mehta",
    parentName: "Deepak Mehta",
    applicationId: "LS2026011",
    program: "B.Tech ECE",
    academicYear: "2025-2026",
    mobile: "9876543220",
    email: "arjun.m@example.com",
    paymentType: "LAB_FEE",
    paymentMode: "CASH",
    amount: 12000,
    transactionId: null,
    date: "2026-07-12",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000153",
    studentName: "Shreya Joshi",
    parentName: "Prakash Joshi",
    applicationId: "LS2026012",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543221",
    email: "shreya.j@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "UPI",
    amount: 90000,
    transactionId: "TXN987654332",
    date: "2026-07-10",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000154",
    studentName: "Vikram Rao",
    parentName: "Harish Rao",
    applicationId: "LS2026013",
    program: "M.Tech VLSI",
    academicYear: "2025-2026",
    mobile: "9876543222",
    email: "vikram.r@example.com",
    paymentType: "ADMISSION_FEE",
    paymentMode: "DD",
    amount: 40000,
    transactionId: "DD789012",
    date: "2026-07-08",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000155",
    studentName: "Pooja Agarwal",
    parentName: "Vinod Agarwal",
    applicationId: "LS2026014",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543223",
    email: "pooja.a@example.com",
    paymentType: "OTHER",
    paymentMode: "BANK_TRANSFER",
    amount: 15000,
    transactionId: "TXN987654334",
    date: "2026-07-06",
    remarks: "Sports fee",
  },
  {
    receiptNumber: "LS-2026-000156",
    studentName: "Karan Malhotra",
    parentName: "Ravi Malhotra",
    applicationId: "LS2026015",
    program: "B.Tech ME",
    academicYear: "2025-2026",
    mobile: "9876543224",
    email: "karan.m@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "CHEQUE",
    amount: 78000,
    transactionId: "CHQ567890",
    date: "2026-07-05",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000157",
    studentName: "Riya Desai",
    parentName: "Nitin Desai",
    applicationId: "LS2026016",
    program: "B.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543225",
    email: "riya.d@example.com",
    paymentType: "HOSTEL_FEE",
    paymentMode: "UPI",
    amount: 48000,
    transactionId: "TXN987654336",
    date: "2026-07-03",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000158",
    studentName: "Aditya Choudhary",
    parentName: "Manoj Choudhary",
    applicationId: "LS2026017",
    program: "B.Tech EEE",
    academicYear: "2025-2026",
    mobile: "9876543226",
    email: "aditya.c@example.com",
    paymentType: "TRANSPORT_FEE",
    paymentMode: "CASH",
    amount: 20000,
    transactionId: null,
    date: "2026-07-01",
    remarks: null,
  },
  {
    receiptNumber: "LS-2026-000159",
    studentName: "Meera Krishnan",
    parentName: "Gopal Krishnan",
    applicationId: "LS2026018",
    program: "M.Tech CSE",
    academicYear: "2025-2026",
    mobile: "9876543227",
    email: "meera.k@example.com",
    paymentType: "TUITION_FEE",
    paymentMode: "BANK_TRANSFER",
    amount: 95000,
    transactionId: "TXN987654338",
    date: "2026-06-28",
    remarks: "Semester 1 fee",
  },
];

let _seeded = false;

export function seedMockData(): void {
  if (_seeded) return;
  _seeded = true;

  for (const mock of MOCK_DATA) {
    // Check if already seeded by receipt number
    const exists = Array.from(receiptStore.values()).some(
      (r) => r.receiptNumber === mock.receiptNumber,
    );
    if (exists) continue;

    const id = generateId();
    const now = new Date();

    const receipt: Receipt = {
      id,
      receiptNumber: mock.receiptNumber,
      studentId: `student_${mock.applicationId}`,
      paymentType: mock.paymentType as Receipt["paymentType"],
      amount: mock.amount,
      paymentMode: mock.paymentMode as Receipt["paymentMode"],
      transactionId: mock.transactionId,
      date: new Date(mock.date),
      remarks: mock.remarks,
      pdfUrl: null,
      createdAt: now,
      generatedById: "user_current",
    };

    receiptStore.set(id, receipt);

    const formData: ReceiptFormData = {
      studentName: mock.studentName,
      parentName: mock.parentName,
      applicationId: mock.applicationId,
      program: mock.program,
      academicYear: mock.academicYear,
      mobile: mock.mobile,
      email: mock.email,
      paymentType: mock.paymentType,
      paymentMode: mock.paymentMode,
      amount: mock.amount,
      transactionId: mock.transactionId ?? undefined,
      date: mock.date,
      remarks: mock.remarks ?? undefined,
    };

    _receiptFormDataStore.set(id, formData);
  }
}
