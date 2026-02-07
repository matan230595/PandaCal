import React, { useMemo, useState } from 'react';
import type { TaskRow, TaskStatus } from '../lib/types';

function formatDue(dueAt: string | null): string | null {
  if (!dueAt) return null;
  const d = new Date(dueAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function StatusBadge({ status }: { status: TaskStatus }): JSX.Element {
  const cls =
    status === 'done'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'doing'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-zinc-200 bg-zinc-50 text-zinc-700';
  const label = status === 'todo' ? 'To do' : status === 'doing' ? 'Doing' : 'Done';
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>{label}</span>;
}

function ConfirmDialog({
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isOpen,
  onCancel,
  onConfirm,
  isBusy,
}: {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  isBusy: boolean;
}): JSX.Element | null {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl">
        <div className="text-base font-semibold text-zinc-900">{title}</div>
        <div className="mt-2 text-sm text-zinc-600">{description}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            onClick={onCancel}
            disabled={isBusy}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
            onClick={() => void onConfirm()}
            disabled={isBusy}
          >
            {isBusy ? 'Deleting…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
}: {
  tasks: TaskRow[];
  onUpdate: (taskId: string, patch: { title?: string; description?: string | null; due_at?: string | null; status?: TaskStatus }) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}): JSX.Element {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState(''); // YYYY-MM-DD
  const [editStatus, setEditStatus] = useState<TaskStatus>('todo');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyDelete, setBusyDelete] = useState(false);
  const [busySaveId, setBusySaveId] = useState<string | null>(null);

  const confirmTask = useMemo(
    () => tasks.find((t) => t.id === confirmDeleteId) ?? null,
    [tasks, confirmDeleteId]
  );

  function startEdit(t: TaskRow) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDescription(t.description ?? '');
    setEditStatus(t.status);
    setEditDueDate(t.due_at ? new Date(t.due_at).toISOString().slice(0, 10) : '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDueDate('');
    setEditStatus('todo');
  }

  async function saveEdit(taskId: string) {
    const title = editTitle.trim();
    if (!title) return;

    const due_at = editDueDate ? new Date(`${editDueDate}T00:00:00`).toISOString() : null;

    setBusySaveId(taskId);
    try {
      await onUpdate(taskId, {
        title,
        description: editDescription.trim() ? editDescription.trim() : null,
        due_at,
        status: editStatus,
      });
      cancelEdit();
    } finally {
      setBusySaveId(null);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        <div className="font-medium text-zinc-900">No tasks yet</div>
        <div className="mt-1">Add your first task above.</div>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {tasks.map((t) => {
          const isEditing = editingId === t.id;
          const dueLabel = formatDue(t.due_at);

          return (
            <li key={t.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
              {!isEditing ? (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold text-zinc-900">{t.title}</div>
                      <StatusBadge status={t.status} />
                    </div>
                    {t.description ? <div className="mt-1 text-sm text-zinc-600">{t.description}</div> : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      {dueLabel ? <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5">Due: {dueLabel}</span> : null}
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5">
                        Created: {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <select
                      value={t.status}
                      onChange={(e) => void onUpdate(t.id, { status: e.target.value as TaskStatus })}
                      className="w-28 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                    >
                      <option value="todo">To do</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(t)}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(t.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-900">Edit task</div>
                    <StatusBadge status={editStatus} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-zinc-700">Title</label>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700">Due date</label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-zinc-700">Description</label>
                      <textarea
                        rows={2}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                      >
                        <option value="todo">To do</option>
                        <option value="doing">Doing</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                      disabled={busySaveId === t.id}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void saveEdit(t.id)}
                      className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                      disabled={busySaveId === t.id}
                    >
                      {busySaveId === t.id ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete task?"
        description={confirmTask ? `This will permanently delete “${confirmTask.title}”.` : 'This will permanently delete the task.'}
        onCancel={() => (busyDelete ? null : setConfirmDeleteId(null))}
        isBusy={busyDelete}
        onConfirm={async () => {
          if (!confirmDeleteId) return;
          setBusyDelete(true);
          try {
            await onDelete(confirmDeleteId);
            setConfirmDeleteId(null);
          } finally {
            setBusyDelete(false);
          }
        }}
      />
    </>
  );
}
