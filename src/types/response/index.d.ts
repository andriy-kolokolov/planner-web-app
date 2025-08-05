import type { User } from '~/types/models';

export interface AuthResponse {
  token: {
    value: string;
    type: string;
  };
  user: User;
}