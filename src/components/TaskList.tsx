import React from 'react';
import type { TaskRow, TaskStatus } from '../lib/types';

const statusOrder: TaskStatus[] = ['todo', 'doing', 'done'];

export default function TaskList({
  tasks,
  onUpdateStatus,
  onDelete,
}: {
  tasks: TaskRow[];
  onUpdateStatus: (taskId: string, next: TaskStatus) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}): JSX.Element {
  if (tasks.length === 0) {
    return <div className="text-sm text-zinc-600">No tasks yet.</div>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <li key={t.id} className="rounded-md border border-zinc-200 bg-white px-3 py-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-900">{t.title}</div>
            <div className="text-xs text-zinc-600">{t.status}</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={t.status}
              onChange={async (e) => {
                const next = e.target.value as TaskStatus;
                if (!statusOrder.includes(next)) return;
                await onUpdateStatus(t.id, next);
              }}
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs"
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
            <button
              onClick={async () => onDelete(t.id)}
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs hover:bg-zinc-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
