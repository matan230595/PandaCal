import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthProvider';
import type { TaskRow, TaskStatus } from '../lib/types';
import { createTask, deleteTask, listTasks, updateTask } from '../lib/db/tasks';
import { ensureUserProgressRow } from '../lib/db/progress';

type Toast = { variant: 'info' | 'error' | 'success'; message: string };

function classNames(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(' ');
}

function StatCard({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();
  const userId = user!.id;

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [sortBy, setSortBy] = useState<'created_desc' | 'due_asc'>('created_desc');

  const toastTimerRef = useRef<number | null>(null);

  function showToast(t: Toast) {
    setToast(t);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3000);
  }

  async function refreshTasks() {
    const rows = await listTasks(userId);
    setTasks(rows);
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        await ensureUserProgressRow(userId);
        const rows = await listTasks(userId);
        if (isMounted) setTasks(rows);
      } catch (e: any) {
        console.error(e);
        if (isMounted) setError(e?.message ?? 'Failed to load dashboard data.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const counters = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const doing = tasks.filter((t) => t.status === 'doing').length;
    const done = tasks.filter((t) => t.status === 'done').length;
    return { total, todo, doing, done };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = tasks.slice();

    if (statusFilter !== 'all') out = out.filter((t) => t.status === statusFilter);

    if (q) {
      out = out.filter((t) => {
        const a = t.title?.toLowerCase() ?? '';
        const b = t.description?.toLowerCase() ?? '';
        return a.includes(q) || b.includes(q);
      });
    }

    if (sortBy === 'due_asc') {
      out.sort((a, b) => {
        const da = a.due_at ? new Date(a.due_at).getTime() : Number.POSITIVE_INFINITY;
        const db = b.due_at ? new Date(b.due_at).getTime() : Number.POSITIVE_INFINITY;
        if (da !== db) return da - db;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else {
      out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return out;
  }, [tasks, query, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">
              🐼
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">PandaClender</div>
              <div className="text-xs text-zinc-500">Signed in as {user?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Home
            </Link>
            <Link
              to="/logout"
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {toast ? (
          <div className="max-w-2xl">
            <Alert variant={toast.variant} message={toast.message} onClose={() => setToast(null)} />
          </div>
        ) : null}

        {error ? (
          <div className="max-w-2xl">
            <Alert variant="error" message={error} onClose={() => setError(null)} />
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total" value={counters.total} />
          <StatCard label="To do" value={counters.todo} />
          <StatCard label="Doing" value={counters.doing} />
          <StatCard label="Done" value={counters.done} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-zinc-900">Tasks</div>
              <div className="text-sm text-zinc-600">Create, filter, and keep momentum.</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div>
                <label className="block text-xs font-medium text-zinc-700">Search</label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mt-1 w-56 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                  placeholder="Title or description…"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="mt-1 w-36 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                >
                  <option value="all">All</option>
                  <option value="todo">To do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700">Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="mt-1 w-40 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                >
                  <option value="created_desc">Newest</option>
                  <option value="due_asc">Due date</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <TaskForm
              isSubmitting={isSubmitting}
              onCreate={async (payload) => {
                try {
                  setIsSubmitting(true);
                  setError(null);
                  await createTask(userId, payload);
                  await refreshTasks();
                  showToast({ variant: 'success', message: 'Task added.' });
                } catch (e: any) {
                  console.error(e);
                  setError(e?.message ?? 'Failed to add task.');
                  showToast({ variant: 'error', message: 'Failed to add task.' });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          </div>
        </section>

        <section className="space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm text-zinc-600">Loading tasks…</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-600">
                  Showing <span className="font-medium text-zinc-900">{filteredTasks.length}</span> of{' '}
                  <span className="font-medium text-zinc-900">{tasks.length}</span>
                </div>

                <button
                  type="button"
                  className={classNames(
                    'rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50',
                    (query || statusFilter !== 'all' || sortBy !== 'created_desc') ? '' : 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={!query && statusFilter === 'all' && sortBy === 'created_desc'}
                  onClick={() => {
                    setQuery('');
                    setStatusFilter('all');
                    setSortBy('created_desc');
                  }}
                >
                  Reset filters
                </button>
              </div>

              <TaskList
                tasks={filteredTasks}
                onUpdate={async (taskId, patch) => {
                  try {
                    setError(null);
                    await updateTask(taskId, patch);
                    await refreshTasks();
                    showToast({ variant: 'success', message: 'Task updated.' });
                  } catch (e: any) {
                    console.error(e);
                    setError(e?.message ?? 'Failed to update task.');
                    showToast({ variant: 'error', message: 'Failed to update task.' });
                  }
                }}
                onDelete={async (taskId) => {
                  try {
                    setError(null);
                    await deleteTask(taskId);
                    await refreshTasks();
                    showToast({ variant: 'success', message: 'Task deleted.' });
                  } catch (e: any) {
                    console.error(e);
                    setError(e?.message ?? 'Failed to delete task.');
                    showToast({ variant: 'error', message: 'Failed to delete task.' });
                  }
                }}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
