import React, { useState } from 'react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';
import { Drawer } from './Drawer.js';
// empty or just keep next line

export function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcuts({
    '?': () => setIsOpen(true),
  });

  const shortcuts = [
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['N'], description: 'New Transaction (when on Transactions page)' },
    { keys: ['/'], description: 'Focus Search (if implemented)' },
    { keys: ['Ctrl', 'Enter'], description: 'Submit Form / Send AI Message' },
    { keys: ['Esc'], description: 'Close Dialogs / Drawers' },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Keyboard Shortcuts">
      <div className="flex flex-col gap-4">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)] last:border-0">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{shortcut.description}</span>
            <div className="flex gap-2">
              {shortcut.keys.map((key, kIndex) => (
                <kbd key={kIndex} className="px-2 py-1 text-xs font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-md shadow-sm">
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
