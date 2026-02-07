import React, { useMemo, useState } from 'react';

export default function TaskForm({
  onCreate,
  isSubmitting,
}: {
  onCreate: (payload: { title: string; description?: string; due_at?: string | null }) => Promise<void>;
  isSubmitting: boolean;
}): JSX.Element {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD

  const canSubmit = useMemo(() => title.trim().length > 0 && !isSubmitting, [title, isSubmitting]);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;

        const due_at = dueDate ? new Date(`${dueDate}T00:00:00`).toISOString() : null;

        await onCreate({
          title: t,
          description: description.trim() ? description.trim() : undefined,
          due_at,
        });

        setTitle('');
        setDescription('');
        setDueDate('');
      }}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-zinc-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="What do you need to do?"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-zinc-700">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="Add details…"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Adding…' : 'Add task'}
        </button>
      </div>
    </form>
  );
}
