import { NextResponse } from "next/server";
import { getRecentPayments } from "@/services/dashboard.service";

export async function GET() {
  try {
    const payments = await getRecentPayments();
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Failed to fetch recent payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent payments" },
      { status: 500 },
    );
  }
}
