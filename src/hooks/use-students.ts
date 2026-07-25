"use client";

import { useQuery } from "@tanstack/react-query";
import type { Student } from "@/types/database";

// Stub: Replace with real API calls when backend is ready
async function fetchStudents(): Promise<Student[]> {
  return [];
}

async function fetchStudent(_id: string): Promise<Student | null> {
  return null;
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    placeholderData: (prev) => prev,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => fetchStudent(id),
    enabled: !!id,
  });
}
