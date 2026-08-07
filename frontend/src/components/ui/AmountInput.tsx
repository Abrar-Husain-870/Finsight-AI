import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils.js';
import { fromMinor, toMinor } from '@finsight/shared';

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number; // In minor units
  onChange: (value: number) => void;
  error?: string;
}

export function AmountInput({ value, onChange, error, className, ...props }: AmountInputProps) {
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (value !== undefined) {
      const major = fromMinor(value);
      // Only update if the string equivalent differs to avoid cursor jumping
      if (parseFloat(inputValue) !== major) {
        setInputValue(major.toString());
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setInputValue(val);
      if (val !== '' && !val.endsWith('.')) {
        onChange(toMinor(parseFloat(val)));
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-[var(--color-text-secondary)]">$</span>
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 pl-7 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors",
          error && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
