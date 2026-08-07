import React, { useState } from 'react';
import { Drawer } from '../../../components/ui/Drawer.js';
import { TransactionForm } from './TransactionForm.js';
import { TransactionResponse } from '@finsight/shared';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts.js';

interface TransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: TransactionResponse | null;
}

export function TransactionDrawer({ isOpen, onClose, transaction }: TransactionDrawerProps) {
  const [isDirty, setIsDirty] = useState(false);

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  useKeyboardShortcuts({
    'ctrl+enter': () => {
      if (isOpen) {
        document.getElementById('transaction-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  });

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={transaction ? 'Edit Transaction' : 'New Transaction'}
    >
      <TransactionForm 
        initialData={transaction} 
        onSuccess={onClose} 
        onDirtyChange={setIsDirty}
      />
    </Drawer>
  );
}
