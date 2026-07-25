import Link from "next/link";

export default function NewReceiptPage() {
  return (
    <div className="section">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/receipts"
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          >
            ← Back to Receipts
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          New Receipt
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Generate a new payment receipt.
        </p>
      </div>
      <div className="card-premium p-12 text-center">
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Receipt generator form — coming soon
        </p>
      </div>
    </div>
  );
}
