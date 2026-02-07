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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold">Login</h1>

        {error && <div className="mt-4"><Alert variant="error" message={error} /></div>}

        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);
            try {
              await signInWithEmail(email.trim(), password);
              nav(from, { replace: true });
            } catch (err: any) {
              setError(err?.message ?? 'Login failed');
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <label className="block">
            <span className="text-xs text-zinc-600">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs text-zinc-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">
          No account? <Link to="/signup" className="text-zinc-900 underline">Create one</Link>
        </div>
      </div>
    </div>
  );
}
