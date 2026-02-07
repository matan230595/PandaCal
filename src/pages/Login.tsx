import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { signInWithEmail } from '../lib/auth';

export default function Login(): JSX.Element {
  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname || '/dashboard';

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
            <h1 className="text-lg font-semibold text-zinc-900">Login</h1>
            <p className="text-xs text-zinc-500">Welcome back</p>
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
              await signInWithEmail(email.trim(), password);
              nav(from, { replace: true });
            } catch (err: any) {
              console.error(err);
              setError(err?.message ?? 'Login failed.');
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
              autoComplete="current-password"
              required
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            type="submit"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">
          No account?{' '}
          <Link className="font-medium text-zinc-900 underline underline-offset-4" to="/signup">
            Sign up
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
