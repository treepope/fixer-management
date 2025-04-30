
export type UserRole = "super_admin" | "admin" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
}

export interface FixerStatus {
  id: string;
  name: string;
  name_th: string;
  color: string;
}

export interface Province {
  id: string;
  name: string;
  name_th: string;
}

export interface Skill {
  id: string;
  name: string;
  name_th: string;
}

export interface Fixer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  province_id: string;
  province?: Province;
  status_id: string;
  status?: FixerStatus;
  skills: string[];
  skillObjects?: Skill[];
  hire_date: string;
  notes?: string;
  total_jobs?: number;
  completion_rate?: number;
  created_at: string;
  updated_at: string;
}

export type SortDirection = "asc" | "desc";

export interface TableState {
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection?: SortDirection;
  searchTerm?: string;
  filters: {
    status?: string[];
    skills?: string[];
    province?: string[];
  };
}
