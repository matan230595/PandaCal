import React from 'react';

type Variant = 'info' | 'error' | 'success';

export default function Alert({
  variant = 'info',
  message,
  onClose,
}: {
  variant?: Variant;
  message: string;
  onClose?: () => void;
}): JSX.Element {
  const base = 'rounded-lg border px-4 py-3 text-sm flex items-start justify-between gap-3';
  const cls =
    variant === 'error'
      ? `${base} border-red-200 bg-red-50 text-red-800`
      : variant === 'success'
        ? `${base} border-emerald-200 bg-emerald-50 text-emerald-800`
        : `${base} border-zinc-200 bg-white text-zinc-800`;

  return (
    <div className={cls} role={variant === 'error' ? 'alert' : 'status'}>
      <div className="min-w-0">{message}</div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-current/80 hover:bg-black/5"
          aria-label="Close"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
