import React from 'react';
import { ErrorState } from '../components/ui/ErrorState.js';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto h-[calc(100vh-80px)]">
      <ErrorState 
        title="Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
        action={
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-[var(--color-accent-primary-foreground)] transition-colors hover:opacity-90"
          >
            Go to Dashboard
          </button>
        }
      />
    </div>
  );
}
