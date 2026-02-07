import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthProvider';
import type { TaskRow, TaskStatus } from '../lib/types';
import { createTask, deleteTask, listTasks, updateTask } from '../lib/db/tasks';
import { ensureUserProgressRow } from '../lib/db/progress';

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();
  const userId = user!.id;

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setError(null);
      setIsLoading(true);
      try {
        // Ensure user_progress row exists (fixes progress-related errors)
        await ensureUserProgressRow(userId);
        const data = await listTasks(userId);
        if (isMounted) setTasks(data);
      } catch (err: any) {
        if (isMounted) setError(err?.message ?? 'Failed to load dashboard');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const taskCount = useMemo(() => tasks.length, [tasks]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="mt-1 text-sm text-zinc-600">Signed in as {user?.email}</div>
          </div>
          <Link
            to="/logout"
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Sign out
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Tasks</div>
            <div className="text-xs text-zinc-600">{taskCount} total</div>
          </div>

          {error && <div className="mt-4"><Alert variant="error" message={error} /></div>}

          <div className="mt-4">
            <TaskForm
              isSubmitting={isSubmitting}
              onCreate={async ({ title }) => {
                setError(null);
                setIsSubmitting(true);
                try {
                  const created = await createTask(userId, { title });
                  setTasks((prev) => [created, ...prev]);
                } catch (err: any) {
                  setError(err?.message ?? 'Failed to create task');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          </div>

          <div className="mt-4">
            {isLoading ? (
              <div className="text-sm text-zinc-600">Loading…</div>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdateStatus={async (taskId: string, next: TaskStatus) => {
                  setError(null);
                  try {
                    const updated = await updateTask(taskId, { status: next });
                    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
                  } catch (err: any) {
                    setError(err?.message ?? 'Failed to update task');
                  }
                }}
                onDelete={async (taskId: string) => {
                  setError(null);
                  try {
                    await deleteTask(taskId);
                    setTasks((prev) => prev.filter((t) => t.id !== taskId));
                  } catch (err: any) {
                    setError(err?.message ?? 'Failed to delete task');
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
