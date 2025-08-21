import type { User } from '~/types/models';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}