import React from 'react';
import { ImportWizard } from '../../features/import/components/ImportWizard.js';

export default function ImportPage() {
  return (
    <div className="flex h-full flex-col p-6 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Smart Import</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Import your bank statements via CSV and categorize them in bulk.</p>
      </div>
      <ImportWizard />
    </div>
  );
}
