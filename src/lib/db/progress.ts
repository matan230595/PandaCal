import { supabase } from '../supabaseClient';
import type { UserProgressRow } from '../types';

export async function ensureUserProgressRow(userId: string): Promise<UserProgressRow> {
  const { data: existing, error: selError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (selError) throw selError;
  if (existing) return existing as UserProgressRow;

  const { data: inserted, error: insError } = await supabase
    .from('user_progress')
    .insert({ user_id: userId })
    .select('*')
    .single();
  if (insError) throw insError;
  return inserted as UserProgressRow;
}

export async function updateUserProgress(
  userId: string,
  patch: Partial<Pick<UserProgressRow, 'achievements' | 'streak'>>
): Promise<UserProgressRow> {
  const { data, error } = await supabase
    .from('user_progress')
    .update({
      ...(patch.achievements !== undefined ? { achievements: patch.achievements } : {}),
      ...(patch.streak !== undefined ? { streak: patch.streak } : {}),
    })
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return data as UserProgressRow;
}
