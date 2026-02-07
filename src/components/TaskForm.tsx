import React, { useState } from 'react';

export default function TaskForm({
  onCreate,
  isSubmitting,
}: {
  onCreate: (payload: { title: string }) => Promise<void>;
  isSubmitting: boolean;
}): JSX.Element {
  const [title, setTitle] = useState('');

  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        await onCreate({ title: t });
        setTitle('');
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
        placeholder="Add a task…"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
}
