export type Role = 'lead' | 'team';

export type TaskStatus = 'not_started' | 'on_progress' | 'done' | 'reject';

export interface User {
  id: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskLog {
  id: string;
  task_id: string;
  user_id: string;
  action: string;
  previous_status?: TaskStatus;
  new_status?: TaskStatus;
  previous_note?: string;
  new_note?: string;
  created_at: string;
}
