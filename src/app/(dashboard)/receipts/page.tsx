import Link from "next/link";

export default function ReceiptsPage() {
  return (
    <div className="section">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Receipts
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            View and manage all generated receipts.
          </p>
        </div>
        <Link
          href="/receipts/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-button-primary hover:bg-primary-600 hover:shadow-button-hover transition-all duration-fast"
        >
          + New Receipt
        </Link>
      </div>
      <div className="card-premium p-12 text-center">
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Receipt history — coming soon
        </p>
      </div>
    </div>
  );
}
