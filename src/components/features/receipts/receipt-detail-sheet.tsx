"use client";

import { useCallback } from "react";
import { Download, Printer, Mail, X, FileText, User, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type EnrichedReceipt,
  PAYMENT_TYPE_LABELS,
  PAYMENT_MODE_LABELS,
} from "@/services/receipt.service";
import type { PaymentType, PaymentMode } from "@/lib/constants";
import { toast } from "sonner";

interface ReceiptDetailSheetProps {
  receipt: EnrichedReceipt | null;
  open: boolean;
  onClose: () => void;
  onDownload: (receipt: EnrichedReceipt) => void;
  onEmail: (receipt: EnrichedReceipt) => void;
}

const formatAmount = (amount: number) =>
  `\u20B9 ${amount.toLocaleString("en-IN")}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (date: Date) =>
  date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function ReceiptDetailSheet({
  receipt,
  open,
  onClose,
  onDownload,
  onEmail,
}: ReceiptDetailSheetProps) {
  const handlePrint = useCallback(() => {
    toast.info("Print functionality coming soon");
  }, []);

  if (!receipt) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col border-l border-neutral-200 dark:border-neutral-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-700">
          <div>
            <SheetTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
              Receipt Details
            </SheetTitle>
            <SheetDescription className="text-xs text-neutral-500 mt-0.5">
              {receipt.receiptNumber}
            </SheetDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Receipt Number Hero */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-5 rounded-md",
                "bg-primary-50/50 dark:bg-primary-900/20",
                "border border-primary-100 dark:border-primary-800",
              )}
            >
              <p className="text-xs font-medium text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-1">
                Receipt Number
              </p>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300 tabular-nums">
                {receipt.receiptNumber}
              </p>
              <p className="text-sm text-primary-600/70 dark:text-primary-400/70 mt-1">
                Generated on {formatDateTime(receipt.createdAt)}
              </p>
            </motion.div>

            {/* Student Information */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Student Information
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                <DetailItem label="Student Name" value={receipt.studentName} />
                <DetailItem label="Parent Name" value={receipt.parentName} />
                <DetailItem label="Application ID" value={receipt.applicationId} />
                <DetailItem label="Program" value={receipt.program} />
                <DetailItem label="Academic Year" value={receipt.academicYear} />
                <DetailItem label="Mobile" value={receipt.mobile} />
                <DetailItem label="Email" value={receipt.email} className="col-span-2" />
              </div>
            </motion.div>

            <Separator />

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-400" />
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Payment Information
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                <DetailItem
                  label="Amount"
                  value={formatAmount(receipt.amount)}
                  valueClassName="text-lg font-bold text-neutral-900 dark:text-white"
                />
                <DetailItem
                  label="Payment Type"
                  value={
                    <Badge variant="default">
                      {PAYMENT_TYPE_LABELS[receipt.paymentType as PaymentType] ??
                        receipt.paymentType}
                    </Badge>
                  }
                />
                <DetailItem
                  label="Payment Mode"
                  value={
                    <Badge
                      variant={
                        receipt.paymentMode === "CASH"
                          ? "success"
                          : receipt.paymentMode === "UPI"
                            ? "info"
                            : "default"
                      }
                    >
                      {PAYMENT_MODE_LABELS[
                        receipt.paymentMode as PaymentMode
                      ] ?? receipt.paymentMode}
                    </Badge>
                  }
                />
                <DetailItem label="Date" value={formatDate(receipt.date)} />
                <DetailItem
                  label="Transaction ID"
                  value={receipt.transactionId ?? "—"}
                />
                <DetailItem label="Remarks" value={receipt.remarks ?? "—"} />
              </div>
            </motion.div>

            <Separator />

            {/* Generator Info */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Generated By
                </h4>
              </div>
              <div className="p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Finance Staff
                  </p>
                  <p className="text-xs text-neutral-400">
                    {formatDateTime(receipt.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(receipt)}
            className="flex-1"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onEmail(receipt)}
            className="flex-1"
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Helper ───────────────────────────────────────────────────────────

function DetailItem({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
      {typeof value === "string" ? (
        <p
          className={cn(
            "text-sm font-medium text-neutral-800 dark:text-neutral-200",
            valueClassName,
          )}
        >
          {value}
        </p>
      ) : (
        <div className={valueClassName}>{value}</div>
      )}
    </div>
  );
}
