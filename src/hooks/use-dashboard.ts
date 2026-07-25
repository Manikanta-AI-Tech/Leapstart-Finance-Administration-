"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  DashboardStats,
  RecentPayment,
  UpcomingDue,
} from "@/services/dashboard.service";

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

async function fetchRecentPayments(): Promise<RecentPayment[]> {
  const res = await fetch("/api/dashboard/recent-payments");
  if (!res.ok) throw new Error("Failed to fetch recent payments");
  return res.json();
}

async function fetchUpcomingDues(): Promise<UpcomingDue[]> {
  const res = await fetch("/api/dashboard/upcoming-dues");
  if (!res.ok) throw new Error("Failed to fetch upcoming dues");
  return res.json();
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useRecentPayments() {
  return useQuery({
    queryKey: ["dashboard", "recent-payments"],
    queryFn: fetchRecentPayments,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useUpcomingDues() {
  return useQuery({
    queryKey: ["dashboard", "upcoming-dues"],
    queryFn: fetchUpcomingDues,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
