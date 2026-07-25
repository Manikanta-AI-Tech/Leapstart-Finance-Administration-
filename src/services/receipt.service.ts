import type { Receipt } from "@/types/database";
import type { ReceiptFormData, ReceiptPDFData, ReceiptFilters } from "@/types/receipt";
import { generateReceiptNumber } from "@/lib/receipt-number";
import { amountToWords } from "@/lib/amount-to-words";

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
