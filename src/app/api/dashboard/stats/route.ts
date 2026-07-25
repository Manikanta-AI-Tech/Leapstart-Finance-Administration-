import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/dashboard.service";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (_error) {
    console.error("Failed to fetch dashboard stats:", _error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
