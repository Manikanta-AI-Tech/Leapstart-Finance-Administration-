export default function DashboardPage() {
  return (
    <div className="section">
      <div className="page-header">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Overview of collections, admissions, and pending tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Today's Collection", "Monthly Collection", "Pending Payments", "Receipts Generated"].map(
          (title) => (
            <div
              key={title}
              className="card-premium p-6 animate-fade-in"
            >
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {title}
              </p>
              <p className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white mt-2">
                —
              </p>
            </div>
          ),
        )}
      </div>

      <div className="card-premium p-6 mt-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Recent payments table — coming soon
        </p>
      </div>
    </div>
  );
}
