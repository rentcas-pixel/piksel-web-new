'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Kažkas nutiko
        </h1>
        <p className="text-gray-600 mb-6">
          Puslapio nepavyko užkrauti. Pabandykite dar kartą arba grįžkite į pradžią.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 bg-[#1329d4] text-white rounded-lg hover:bg-[#0f20a8] transition-colors font-medium"
          >
            Bandyti dar kartą
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Grįžti į pradžią
          </Link>
        </div>
      </div>
    </div>
  );
}
