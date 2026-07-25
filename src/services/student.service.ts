import type { StudentFormData } from "@/types/student";
import type { Student } from "@/types/database";

// Student service — stub for future API integration

export async function getStudents(): Promise<Student[]> {
  // Stub: Implement when backend is ready
  return [];
}

export async function getStudentById(id: string): Promise<Student | null> {
  // Stub: Implement when backend is ready
  return null;
}

export async function createStudent(data: StudentFormData): Promise<Student | null> {
  // Stub: Implement when backend is ready
  return null;
}
