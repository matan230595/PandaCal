export type TaskStatus = 'todo' | 'doing' | 'done';

export interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgressRow {
  user_id: string;
  achievements: unknown; // jsonb
  streak: number;
  created_at: string;
  updated_at: string;
}
