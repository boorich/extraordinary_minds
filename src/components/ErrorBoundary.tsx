'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="mb-4 text-slate-300">We've encountered an unexpected error. Our team has been notified.</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}