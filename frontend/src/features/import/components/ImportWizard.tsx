import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { UploadCloud, CheckCircle2, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { ColumnMapping, ImportPreviewResponse } from '@finsight/shared';
import { useImportPreview, useImportCommit } from '../hooks/useImport.js';
import { CategoryPicker } from '../../categories/components/CategoryPicker.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { toast } from 'sonner';

type Step = 'UPLOAD' | 'MAP_COLUMNS' | 'PREVIEW' | 'SUMMARY';

export function ImportWizard() {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const { formatMoney } = useCurrency();
  const [headers, setHeaders] = useState<string[]>([]);
  
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});
  
  const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
  const [categoryMapping, setCategoryMapping] = useState<Record<number, string>>({}); // rowIndex -> categoryId
  const [summaryData, setSummaryData] = useState<import('@finsight/shared').ImportSessionResponse | null>(null);

  const previewMutation = useImportPreview();
  const commitMutation = useImportCommit();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (!selected) return;
      setFile(selected);
      // Parse headers
      Papa.parse(selected, {
        preview: 1, // just get first row for headers
        complete: (results) => {
          const rawHeaders = (results.data[0] || []) as string[];
          setHeaders(rawHeaders.filter(h => !!h));
          setStep('MAP_COLUMNS');
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handlePreview = () => {
    if (!mapping.date || !mapping.amount || !mapping.merchant || !file) {
      toast.error('Date, Amount, and Merchant mappings are required');
      return;
    }
    previewMutation.mutate({ file, mapping: mapping as ColumnMapping }, {
      onSuccess: (data) => {
        setPreviewData(data);
        
        // Pre-fill categories from suggestions
        const autoCats: Record<number, string> = {};
        data.rows.forEach(row => {
          if (row.isValid && !row.isDuplicate && row.suggestedCategoryId) {
            autoCats[row.index] = row.suggestedCategoryId;
          }
        });
        setCategoryMapping(autoCats);
        setStep('PREVIEW');
      },
      onError: () => toast.error('Failed to parse CSV')
    });
  };

  const handleCommit = () => {
    if (!previewData) return;
    
    // Check if all valid non-duplicate rows have a category
    const validRows = previewData.rows.filter(r => r.isValid && !r.isDuplicate);
    const missingCats = validRows.some(r => !categoryMapping[r.index]);
    
    if (missingCats) {
      toast.error('Please map a category for all transactions');
      return;
    }

    commitMutation.mutate({
      sessionId: previewData.sessionId,
      categoryMapping
    }, {
      onSuccess: (data) => {
        setSummaryData(data);
        setStep('SUMMARY');
      },
      onError: () => toast.error('Failed to commit import')
    });
  };

  if (step === 'UPLOAD') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 text-[var(--color-text-secondary)] mb-4" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Upload your CSV</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Drag and drop your bank export here, or click to browse.</p>
      </div>
    );
  }

  if (step === 'MAP_COLUMNS') {
    return (
      <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 shadow-sm flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Map CSV Columns</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['date', 'amount', 'merchant', 'description'] as const).map(field => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
                {field} {field !== 'description' && <span className="text-[var(--color-danger)]">*</span>}
              </label>
              <select 
                className="h-10 rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 text-sm focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]"
                value={mapping[field] || ''}
                onChange={e => setMapping(p => ({ ...p, [field]: e.target.value }))}
              >
                <option value="">Select column...</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => setStep('UPLOAD')} className="px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)]">Back</button>
          <button onClick={handlePreview} disabled={previewMutation.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] rounded-md disabled:opacity-50">
            {previewMutation.isPending ? 'Processing...' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'PREVIEW' && previewData) {
    return (
      <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Review & Categorize</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">Total: {previewData.totalRows}</span>
            <span className="text-[var(--color-success)] flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> {previewData.validRows - previewData.duplicateRows} Valid</span>
            {previewData.duplicateRows > 0 && <span className="text-yellow-500 flex items-center gap-1"><AlertCircle className="h-4 w-4"/> {previewData.duplicateRows} Dups</span>}
            {previewData.totalRows - previewData.validRows > 0 && <span className="text-[var(--color-danger)] flex items-center gap-1"><AlertCircle className="h-4 w-4"/> {previewData.totalRows - previewData.validRows} Errors</span>}
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-md border border-[var(--color-border-primary)]">
          <table className="min-w-full divide-y divide-[var(--color-border-primary)]">
            <thead className="bg-[var(--color-bg-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Merchant</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)]">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] w-1/3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-primary)]">
              {previewData.rows.map(row => {
                const isError = !row.isValid;
                const isDup = row.isDuplicate;
                
                return (
                  <tr key={row.index} className={`transition-colors ${isError ? 'bg-[var(--color-danger)]/5' : isDup ? 'bg-yellow-500/5' : 'hover:bg-[var(--color-bg-secondary)]'}`}>
                    <td className={`px-4 py-3 text-sm whitespace-nowrap ${isError || isDup ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                      {row.mappedData.date ? new Intl.DateTimeFormat('en-US').format(new Date(row.mappedData.date)) : '-'}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isError || isDup ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                      {row.mappedData.merchant || '-'}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${isError || isDup ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                      {typeof row.mappedData.amount === 'number' ? formatMoney(row.mappedData.amount) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {isError ? (
                        <div className="flex items-center gap-1 text-[var(--color-danger)] text-xs font-medium">
                          <AlertCircle className="h-4 w-4" />
                          {row.errors?.join(', ') || 'Invalid data'}
                        </div>
                      ) : isDup ? (
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                          <AlertCircle className="h-4 w-4" />
                          Duplicate transaction
                        </div>
                      ) : (
                        <CategoryPicker 
                          value={categoryMapping[row.index] || ''} 
                          onChange={val => setCategoryMapping(p => ({ ...p, [row.index]: val }))} 
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => setStep('MAP_COLUMNS')} className="px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)]">Back</button>
          <button onClick={handleCommit} disabled={commitMutation.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] rounded-md disabled:opacity-50">
            {commitMutation.isPending ? 'Importing...' : 'Complete Import'}
            <Check className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'SUMMARY' && summaryData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm">
        <div className="rounded-full bg-[var(--color-success-muted)] p-4 mb-4 text-[var(--color-success)] border border-[var(--color-success)]/20">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Import Successful</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Successfully imported <strong>{summaryData.successRows}</strong> out of {summaryData.totalRows} transactions.
        </p>
        <button 
          onClick={() => { setStep('UPLOAD'); setFile(null); setPreviewData(null); }}
          className="mt-6 px-6 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)] transition-colors"
        >
          Import Another File
        </button>
      </div>
    );
  }

  return null;
}
