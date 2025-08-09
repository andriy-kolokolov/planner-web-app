import type { User } from '~/types/models';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}
