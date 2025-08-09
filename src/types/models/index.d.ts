import type { UUID } from 'node:crypto';

export interface User {
  id: UUID; // uuid
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
