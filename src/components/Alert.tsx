import React from 'react';

export default function Alert({
  variant = 'info',
  message,
}: {
  variant?: 'info' | 'error' | 'success';
  message: string;
}): JSX.Element {
  const base = 'rounded-md border px-3 py-2 text-sm';
  const cls =
    variant === 'error'
      ? `${base} border-red-200 bg-red-50 text-red-800`
      : variant === 'success'
        ? `${base} border-emerald-200 bg-emerald-50 text-emerald-800`
        : `${base} border-zinc-200 bg-white text-zinc-800`;

  return <div className={cls}>{message}</div>;
}
