"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Download,
  Mail,
  Printer,
  FileText,
  Plus,
  Loader2,
  IndianRupee,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { amountToWords } from "@/lib/amount-to-words";
import {
  receiptFormSchema,
  receiptStudentSchema,
  receiptPaymentSchema,
  type ReceiptFormInput,
} from "@/lib/validations/schemas";
import { useCreateReceipt } from "@/hooks/use-receipts";
import type { ReceiptPDFData } from "@/types/receipt";
import type { Receipt } from "@/types/database";
import { generateNewReceiptNumber } from "@/services/receipt.service";

// ── Constants ──────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Student\nInfo" },
  { id: 2, label: "Payment\nDetails" },
  { id: 3, label: "Preview &\nConfirm" },
  { id: 4, label: "Done" },
] as const;

const PROGRAMS = ["B.Tech", "M.Tech", "Diploma", "Certification"] as const;

const ACADEMIC_YEARS = ["2026-27", "2025-26", "2024-25"] as const;

const PAYMENT_TYPES = [
  "Seat Reservation",
  "Enrollment Fee",
  "Tuition Fee",
  "Hostel Fee",
  "Other",
] as const;

const PAYMENT_MODES = ["Cash", "UPI", "Card", "Bank Transfer", "Cheque"] as const;

// ── Animation variants ─────────────────────────────────────────────

const stepTransition = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
};

const successSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
  mass: 0.5,
};

// ── Props ──────────────────────────────────────────────────────────

interface ReceiptFormProps {
  onSuccess?: (receipt: Receipt, pdfData: ReceiptPDFData, pdfBlob: Blob) => void;
}

// ── Sub-components ─────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="relative mb-2">
      {/* Connecting line background */}
      <div
        className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-700"
        aria-hidden="true"
      >
        <div
          className="h-full bg-accent-500 transition-all duration-400 ease-out"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>

      <ol className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li key={step.id} className="flex flex-col items-center">
              {/* Circle */}
              <span
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-250",
                  isCompleted &&
                    "bg-primary-500 border-primary-500 dark:bg-primary-600 dark:border-primary-600",
                  isCurrent &&
                    "bg-white dark:bg-neutral-900 border-primary-500",
                  isUpcoming &&
                    "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600",
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isCurrent
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-neutral-400 dark:text-neutral-500",
                    )}
                  >
                    {stepNumber}
                  </span>
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center whitespace-pre-line leading-tight",
                  isCurrent
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Main Component ─────────────────────────────────────────────────

export function ReceiptForm({ onSuccess }: ReceiptFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generatedReceiptNumber, setGeneratedReceiptNumber] = useState<string>("");
  const [generatedReceipt, setGeneratedReceipt] = useState<Receipt | null>(null);
  const [generatedPdfData, setGeneratedPdfData] = useState<ReceiptPDFData | null>(null);

  const createMutation = useCreateReceipt();

  const form = useForm<ReceiptFormInput>({
    resolver: zodResolver(receiptFormSchema),
    mode: "onChange",
    defaultValues: {
      studentName: "",
      parentName: "",
      applicationId: "",
      program: "",
      academicYear: "",
      mobile: "",
      email: "",
      paymentType: "",
      paymentMode: "",
      amount: undefined as unknown as number,
      transactionId: "",
      date: new Date().toISOString().split("T")[0] ?? "",
      remarks: "",
    },
  });

  const { watch, trigger, setValue } = form;
  const amount = watch("amount");

  // ── Navigation ──────────────────────────────────────────────────

  const goNext = useCallback(async () => {
    let schema;
    if (currentStep === 1) schema = receiptStudentSchema;
    else if (currentStep === 2) schema = receiptPaymentSchema;
    else return;

    const valid = await trigger(
      Object.keys(schema.shape) as (keyof ReceiptFormInput)[],
    );
    if (!valid) return;

    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, [currentStep, trigger]);

  const goBack = useCallback(() => {
    setDirection("back");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // ── Generate Receipt ────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    const valid = await trigger();
    if (!valid) return;

    const formData = form.getValues();

    createMutation.mutate(formData, {
      onSuccess: async ({ receipt, pdfData }) => {
        setGeneratedReceiptNumber(receipt.receiptNumber);
        setGeneratedReceipt(receipt);
        setGeneratedPdfData(pdfData);

        // Generate PDF blob using dynamic import
        try {
          const { pdf } = await import("@react-pdf/renderer");
          const { ReceiptPDF } = await import(
            "@/components/features/receipts/receipt-pdf"
          );
          const blob = await pdf(<ReceiptPDF data={pdfData} />).toBlob();
          setPdfBlob(blob);
        } catch (err) {
          console.error("PDF generation error:", err);
        }

        setDirection("forward");
        setCurrentStep(4);

        if (onSuccess && receipt && pdfData) {
          // We'll pass the blob once it's ready via a separate callback
        }
      },
    });
  }, [trigger, form, createMutation, onSuccess]);

  // ── Actions from success step ───────────────────────────────────

  const handleDownload = useCallback(() => {
    if (!pdfBlob || !generatedReceiptNumber) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt-${generatedReceiptNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pdfBlob, generatedReceiptNumber]);

  const handlePrint = useCallback(() => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        win.print();
      };
    }
  }, [pdfBlob]);

  const handleNewReceipt = useCallback(() => {
    form.reset();
    setCurrentStep(1);
    setPdfBlob(null);
    setGeneratedReceiptNumber("");
    setGeneratedReceipt(null);
    setGeneratedPdfData(null);
    setDirection("forward");
  }, [form]);

  const previewNumber = generateNewReceiptNumber();

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6 sm:p-8">
      {/* Back link (not shown on Done step) */}
      {currentStep < 4 && (
        <div>
          <a
            href="/receipts"
            className={cn(
              "inline-flex items-center gap-1.5",
              "text-sm text-neutral-500 hover:text-neutral-700",
              "dark:text-neutral-400 dark:hover:text-neutral-200",
              "transition-colors duration-150",
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Receipts
          </a>
        </div>
      )}

      {/* Header (not shown on Done step) */}
      {currentStep < 4 && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Generate Receipt
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Create a new payment receipt for a student
          </p>
        </div>
      )}

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Step Content */}
      <AnimatePresence mode="wait" initial={false}>
        {/* ── Step 1: Student Information ──────────────────── */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            {...stepTransition}
            className={cn(
              "rounded-md p-6 sm:p-8",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200/60 dark:border-neutral-800",
              "shadow-sm",
            )}
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
              Student Information
            </h2>

            <div className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">
                    Student Name <span className="text-destructive-500">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    placeholder="Rahul Kumar"
                    {...form.register("studentName")}
                  />
                  {form.formState.errors.studentName && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.studentName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentName">
                    Parent Name <span className="text-destructive-500">*</span>
                  </Label>
                  <Input
                    id="parentName"
                    placeholder="Mr. Suresh Kumar"
                    {...form.register("parentName")}
                  />
                  {form.formState.errors.parentName && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.parentName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationId">
                    Application ID <span className="text-destructive-500">*</span>
                  </Label>
                  <Input
                    id="applicationId"
                    placeholder="APP-0123"
                    {...form.register("applicationId")}
                  />
                  {form.formState.errors.applicationId && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.applicationId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">
                    Program <span className="text-destructive-500">*</span>
                  </Label>
                  <Select
                    value={watch("program")}
                    onValueChange={(v) => setValue("program", v, { shouldValidate: true })}
                  >
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.program && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.program.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">
                    Academic Year <span className="text-destructive-500">*</span>
                  </Label>
                  <Select
                    value={watch("academicYear")}
                    onValueChange={(v) =>
                      setValue("academicYear", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="academicYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.academicYear && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.academicYear.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    Mobile <span className="text-destructive-500">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    {...form.register("mobile")}
                  />
                  {form.formState.errors.mobile && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.mobile.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4 */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Payment Details ──────────────────────── */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            {...stepTransition}
            className={cn(
              "rounded-md p-6 sm:p-8",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200/60 dark:border-neutral-800",
              "shadow-sm",
            )}
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
              Payment Details
            </h2>

            <div className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentType">
                    Payment Type <span className="text-destructive-500">*</span>
                  </Label>
                  <Select
                    value={watch("paymentType")}
                    onValueChange={(v) =>
                      setValue("paymentType", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="paymentType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentType && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.paymentType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMode">
                    Payment Mode <span className="text-destructive-500">*</span>
                  </Label>
                  <Select
                    value={watch("paymentMode")}
                    onValueChange={(v) =>
                      setValue("paymentMode", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="paymentMode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentMode && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.paymentMode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount (₹) <span className="text-destructive-500">*</span>
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="45,000"
                      className="pl-9"
                      {...form.register("amount")}
                    />
                  </div>
                  {form.formState.errors.amount && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction / Reference ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="TXN-20260715-001"
                    {...form.register("transactionId")}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Payment Date <span className="text-destructive-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register("date")}
                  />
                  {form.formState.errors.date && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.date.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Any additional notes..."
                    maxLength={500}
                    {...form.register("remarks")}
                  />
                  {form.formState.errors.remarks && (
                    <p className="text-xs text-destructive-500">
                      {form.formState.errors.remarks.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount in Words */}
              <div
                className={cn(
                  "p-3 rounded-md",
                  "bg-neutral-50 dark:bg-neutral-800/50",
                  "border border-neutral-100 dark:border-neutral-700",
                )}
              >
                <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Amount in Words
                </span>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-1">
                  {amount && amount > 0 ? amountToWords(amount) : "\u2014"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Preview ─────────────────────────────── */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            {...stepTransition}
            className="space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Preview Receipt
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Review the receipt details before generating. You can go back to
                edit any information.
              </p>
            </div>

            {/* Receipt Preview Card */}
            <div
              className={cn(
                "rounded-md overflow-hidden",
                "bg-white dark:bg-neutral-900",
                "border border-neutral-200/60 dark:border-neutral-800",
                "shadow-md",
              )}
            >
              {/* Mini Header */}
              <div className="bg-primary-600 dark:bg-primary-800 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">
                      LeapStart School of Technology
                    </p>
                    <p className="text-white font-bold text-xl mt-0.5">
                      PAYMENT RECEIPT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs">Receipt #</p>
                    <p className="text-white font-semibold text-sm">
                      {previewNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Left: Student Details */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Student Details
                    </p>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Name</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("studentName") || "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Parent</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("parentName") || "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">
                        Application ID
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("applicationId") || "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Program</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("program") || "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">
                        Academic Year
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("academicYear") || "\u2014"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Payment Details */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Payment Details
                    </p>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Type</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("paymentType") || "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Mode</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("paymentMode") || "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Amount</p>
                      <p className="text-lg font-bold tabular-nums text-primary-600 dark:text-primary-400">
                        ₹ {(form.getValues("amount") || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500">Date</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {form.getValues("date") || "\u2014"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount in words */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Amount in words:
                  </p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 italic">
                    {amount && amount > 0 ? amountToWords(amount) : "\u2014"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Success ─────────────────────────────── */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={successSpring}
            className="flex flex-col items-center text-center py-12"
          >
            {/* Success checkmark */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...successSpring, delay: 0.1 }}
              className={cn(
                "w-16 h-16 rounded-full",
                "bg-success-50 dark:bg-success-900/30",
                "flex items-center justify-center mb-6",
              )}
            >
              <CheckCircle className="w-8 h-8 text-success-500" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-neutral-900 dark:text-white"
            >
              Receipt Generated Successfully!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm"
            >
              Receipt{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-300 font-mono">
                {generatedReceiptNumber}
              </span>{" "}
              has been generated for {form.getValues("studentName")}.
            </motion.p>

            {/* Receipt number display */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className={cn(
                "mt-6 px-6 py-3 rounded-md",
                "bg-primary-50 dark:bg-primary-900/20",
                "border border-primary-100 dark:border-primary-800",
              )}
            >
              <p className="text-xs text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Receipt Number
              </p>
              <p className="text-2xl font-bold font-mono text-primary-700 dark:text-primary-300 mt-0.5">
                {generatedReceiptNumber}
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              <Button
                variant="default"
                onClick={handleDownload}
                disabled={!pdfBlob}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={!pdfBlob}
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" disabled>
                <Mail className="w-4 h-4" />
                Email Parent
              </Button>
            </motion.div>

            <button
              onClick={handleNewReceipt}
              className={cn(
                "mt-6 text-sm font-medium",
                "text-primary-600 dark:text-primary-400",
                "hover:text-primary-700 dark:hover:text-primary-300",
                "transition-colors duration-150",
                "inline-flex items-center gap-1.5",
              )}
            >
              <Plus className="w-4 h-4" />
              Generate another receipt
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation Buttons ────────────────────────────────── */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = "/receipts";
            }}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            {currentStep < 3 ? (
              <Button variant="default" onClick={goNext}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : currentStep === 3 ? (
              <Button
                variant="default"
                onClick={handleGenerate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Receipt
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
