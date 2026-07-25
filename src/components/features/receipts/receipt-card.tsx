"use client";

import { Eye, Download, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  type EnrichedReceipt,
  PAYMENT_TYPE_LABELS,
  PAYMENT_MODE_LABELS,
} from "@/services/receipt.service";
import type { PaymentType, PaymentMode } from "@/lib/constants";

interface ReceiptCardProps {
  receipt: EnrichedReceipt;
  onView: (receipt: EnrichedReceipt) => void;
  onDownload: (receipt: EnrichedReceipt) => void;
  onEmail: (receipt: EnrichedReceipt) => void;
  index: number;
}

const formatAmount = (amount: number) =>
  `\u20B9 ${amount.toLocaleString("en-IN")}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export function ReceiptCard({
  receipt,
  onView,
  onDownload,
  onEmail,
  index,
}: ReceiptCardProps) {
  let modeVariant: "success" | "warning" | "info" | "default" = "default";
  const mode = receipt.paymentMode as string;
  if (mode === "CASH") modeVariant = "success";
  else if (mode === "UPI") modeVariant = "info";
  else if (mode === "CHEQUE" || mode === "DD") modeVariant = "warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onView(receipt)}
      className={cn(
        "p-4 cursor-pointer",
        "active:scale-[0.99] transition-transform duration-100",
      )}
    >
      {/* Header: Receipt # + Payment Type Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tabular-nums">
          {receipt.receiptNumber}
        </span>
        <Badge variant="default">
          {PAYMENT_TYPE_LABELS[receipt.paymentType as PaymentType] ??
            receipt.paymentType}
        </Badge>
      </div>

      {/* Student + Parent */}
      <p className="text-sm font-medium text-neutral-900 dark:text-white">
        {receipt.studentName}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
        {receipt.parentName} &middot; {receipt.applicationId}
      </p>

      {/* Amount + Date + Mode */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">
          {formatAmount(receipt.amount)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">
            {formatDate(receipt.date)}
          </span>
          <Badge variant={modeVariant} className="text-[10px] px-1.5 py-0">
            {PAYMENT_MODE_LABELS[receipt.paymentMode as PaymentMode] ??
              receipt.paymentMode}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(receipt);
          }}
          className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          <Eye className="w-3.5 h-3.5 inline mr-1" />
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(receipt);
          }}
          className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          <Download className="w-3.5 h-3.5 inline mr-1" />
          Download
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEmail(receipt);
          }}
          className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          <Mail className="w-3.5 h-3.5 inline mr-1" />
          Email
        </button>
      </div>
    </motion.div>
  );
}
