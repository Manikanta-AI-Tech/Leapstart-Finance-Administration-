import type { Student } from "./database";

export type { Student };

export interface StudentFormData {
  name: string;
  parentName?: string;
  applicationId?: string;
  program: string;
  academicYear: string;
  mobile?: string;
  email?: string;
  address?: string;
}

export interface StudentFilters {
  search?: string;
  program?: string;
  academicYear?: string;
}
