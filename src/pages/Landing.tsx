import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Landing(): JSX.Element {
  const { isLoading, user } = useAuth();

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
              <div className="text-xs text-zinc-500">Simple, stable tasks</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Your day, cleaned up.</h1>
            <p className="mt-4 text-zinc-600">
              A fast, minimal task dashboard with solid auth, real database security, and no nonsense.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {!isLoading && user ? (
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Create account
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm hover:bg-zinc-50"
                  >
                    I already have one
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">What you get</div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li className="flex gap-2"><span>✅</span><span>Protected dashboard (real session persistence)</span></li>
              <li className="flex gap-2"><span>✅</span><span>Create, edit, filter, and complete tasks</span></li>
              <li className="flex gap-2"><span>✅</span><span>Secure by default (RLS on every table)</span></li>
              <li className="flex gap-2"><span>✅</span><span>Stable baseline for Phase 2 features</span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
