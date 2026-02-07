import { supabase } from '../supabaseClient';
import type { TaskRow, TaskStatus } from '../types';

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_at?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  due_at?: string | null;
}

export async function listTasks(userId: string): Promise<TaskRow[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as TaskRow[];
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<TaskRow> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      due_at: input.due_at ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as TaskRow;
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<TaskRow> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.due_at !== undefined ? { due_at: input.due_at } : {}),
    })
    .eq('id', taskId)
    .select('*')
    .single();
  if (error) throw error;
  return data as TaskRow;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}
