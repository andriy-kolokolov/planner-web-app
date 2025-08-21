import type { UUID } from 'node:crypto';

export interface User {
  id: UUID; // uuid
  name: string;
  lastname: string;
  email: string;
  email_verified_at: string;
  updated_at: string;
  created_at: string;
  // gender: string;
  // is_active: boolean;
}

export interface Auth {
  token: string;
  user: User;
}

export interface Habit {
  id: UUID;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: UUID;
}

