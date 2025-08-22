import type { UUID } from 'node:crypto';

export interface UserResource {
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
  user: UserResource;
}

export interface HabitResource {
  id: string;
  name: string;
  description: string;
  color_hex: string;
  icon: string;
  start_date: string;
  end_date: string | null;
  is_archived: boolean;
  schedule_kind: number;
  interval_days: number;
  days_of_week: number[] | null;
  target_per_period: number | null;
  is_prompt_wellbeing: boolean;
  reminders: string[] | null;
  streak_current: number;
  streak_longest: number;
  last_completed_at: string | null;
  priority: number;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
