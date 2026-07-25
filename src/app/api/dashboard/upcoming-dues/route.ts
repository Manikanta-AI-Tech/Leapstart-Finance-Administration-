import { NextResponse } from "next/server";
import { getUpcomingDues } from "@/services/dashboard.service";

export async function GET() {
  try {
    const dues = await getUpcomingDues();
    return NextResponse.json(dues);
  } catch (_error) {
    console.error("Failed to fetch upcoming dues:", _error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming dues" },
      { status: 500 },
    );
  }
}
