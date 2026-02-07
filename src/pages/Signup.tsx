import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { signUpWithEmail } from '../lib/auth';

export default function Signup(): JSX.Element {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">
            🐼
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Sign up</h1>
            <p className="text-xs text-zinc-500">Create your account</p>
          </div>
        </div>

        {error ? <div className="mt-4"><Alert variant="error" message={error} onClose={() => setError(null)} /></div> : null}

        <form
          className="mt-5 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);
            try {
              await signUpWithEmail(email.trim(), password);
              nav('/dashboard', { replace: true });
            } catch (err: any) {
              console.error(err);
              setError(err?.message ?? 'Sign up failed.');
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div>
            <label className="block text-xs font-medium text-zinc-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <div className="mt-1 text-xs text-zinc-500">Use at least 6 characters.</div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            type="submit"
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">
          Already have an account?{' '}
          <Link className="font-medium text-zinc-900 underline underline-offset-4" to="/login">
            Login
          </Link>
        </div>

        <div className="mt-6">
          <Link className="text-xs text-zinc-500 hover:text-zinc-700" to="/">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
