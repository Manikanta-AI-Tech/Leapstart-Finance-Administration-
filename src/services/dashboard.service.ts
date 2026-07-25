// Dashboard service — returns mock data for now.
// Swap these functions with real Supabase/Prisma queries when the DB is connected.

export interface DashboardStats {
  todayCollection: number;
  todayCollectionTrend: number;
  monthlyCollection: number;
  monthlyCollectionTrend: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;
  pendingPaymentsTrend: number;
  receiptsGeneratedToday: number;
  receiptsGeneratedMonth: number;
  receiptsTrend: number;
  admissionsConfirmed: number;
  admissionsTarget: number;
  admissionsMonthly: number[];
  outstandingAmount: {
    total: number;
    bucket0to30: number;
    bucket30to60: number;
    bucket60plus: number;
  };
}

export interface RecentPayment {
  id: string;
  receiptNo: string;
  studentName: string;
  amount: number;
  paymentType: string;
  date: string;
  status: "paid" | "pending" | "failed";
}

export interface UpcomingDue {
  id: string;
  studentName: string;
  initials: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  overdue: boolean;
}

const indianNames = [
  "Rahul Kumar",
  "Priya Sharma",
  "Amit Patel",
  "Sneha Reddy",
  "Vikram Singh",
  "Ananya Gupta",
  "Deepak Verma",
  "Kavita Joshi",
  "Rohan Mehta",
  "Nandini Iyer",
  "Arjun Nair",
  "Meera Choudhury",
  "Suresh Rao",
  "Pooja Das",
  "Manish Tiwari",
];

const paymentTypes = [
  "Tuition Fee",
  "Admission Fee",
  "Exam Fee",
  "Transport Fee",
  "Hostel Fee",
  "Library Fee",
  "Lab Fee",
  "Other",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 500) * 500;
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysBack * 86400000);
  return past;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// Stable mock data — seeded so it doesn't change between re-renders
let _mockStats: DashboardStats | undefined;
let _mockPayments: RecentPayment[] | undefined;
let _mockDues: UpcomingDue[] | undefined;

function generateMockStats(): DashboardStats {
  return {
    todayCollection: 124500,
    todayCollectionTrend: 12.5,
    monthlyCollection: 2840000,
    monthlyCollectionTrend: 8.2,
    pendingPaymentsCount: 47,
    pendingPaymentsAmount: 562300,
    pendingPaymentsTrend: -3.1,
    receiptsGeneratedToday: 23,
    receiptsGeneratedMonth: 1245,
    receiptsTrend: 18.4,
    admissionsConfirmed: 842,
    admissionsTarget: 1000,
    admissionsMonthly: [40, 55, 48, 62, 70, 68, 75, 72, 80, 78, 84, 88],
    outstandingAmount: {
      total: 1845200,
      bucket0to30: 1230000,
      bucket30to60: 380500,
      bucket60plus: 234700,
    },
  };
}

function generateMockPayments(): RecentPayment[] {
  if (_mockPayments) return _mockPayments;

  const statuses: Array<"paid" | "pending" | "failed"> = [
    "paid",
    "paid",
    "paid",
    "paid",
    "paid",
    "paid",
    "paid",
    "pending",
    "paid",
    "paid",
  ];

  _mockPayments = Array.from({ length: 10 }, (_, i) => {
    const name = indianNames[i % indianNames.length]!;
    const type = paymentTypes[i % paymentTypes.length]!;
    const status = statuses[i]!;
    return {
      id: `pay-${i + 1}`,
      receiptNo: `LS-RCP-${String(2026 + Math.floor(i / 100)).slice(2)}${String((i % 100) + 1).padStart(3, "0")}`,
      studentName: name,
      amount: randomAmount(5000, 200000),
      paymentType: type,
      date: formatRelativeDate(randomDate(30)),
      status: status,
    };
  });

  return _mockPayments!;
}

function generateMockDues(): UpcomingDue[] {
  if (_mockDues) return _mockDues;

  const now = new Date();
  _mockDues = Array.from({ length: 7 }, (_, i) => {
    const daysFromNow = i < 3 ? Math.floor(Math.random() * 7) + 1 : Math.floor(Math.random() * 50) + 7;
    const dueDate = new Date(now.getTime() + daysFromNow * 86400000);
    const isOverdue = i === 0; // First one overdue
    const name = indianNames[(i + 5) % indianNames.length]!;

    return {
      id: `due-${i + 1}`,
      studentName: name,
      initials: getInitials(name),
      amount: randomAmount(10000, 150000),
      dueDate: isOverdue
        ? formatDate(new Date(now.getTime() - 2 * 86400000))
        : formatDate(dueDate),
      daysUntilDue: isOverdue ? -2 : daysFromNow,
      overdue: isOverdue,
    };
  });

  return _mockDues!;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!_mockStats) _mockStats = generateMockStats();
  return _mockStats;
}

export async function getRecentPayments(): Promise<RecentPayment[]> {
  return generateMockPayments();
}

export async function getUpcomingDues(): Promise<UpcomingDue[]> {
  return generateMockDues();
}
