import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Landing(): JSX.Element {
  const { isLoading, user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-900">PandaClender</h1>
        <p className="mt-3 text-zinc-600">A simple, stable task dashboard (Phase 1).</p>

        <div className="mt-8 flex gap-3">
          {!isLoading && user ? (
            <Link
              to="/dashboard"
              className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md border border-zinc-200 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
