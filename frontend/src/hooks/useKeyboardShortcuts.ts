import { useEffect } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

export function useKeyboardShortcuts(shortcuts: Record<string, KeyHandler>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        // Exception for Ctrl+Enter
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && shortcuts['ctrl+enter']) {
          e.preventDefault();
          shortcuts['ctrl+enter'](e);
        }
        // Exception for Escape to close dialogs even inside inputs
        if (e.key === 'Escape' && shortcuts['escape']) {
          e.preventDefault();
          shortcuts['escape'](e);
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'n' && shortcuts['n']) {
        e.preventDefault();
        shortcuts['n'](e);
      } else if (key === '/' && shortcuts['/']) {
        e.preventDefault();
        shortcuts['/'](e);
      } else if (key === 'escape' && shortcuts['escape']) {
        e.preventDefault();
        shortcuts['escape'](e);
      } else if (key === '?' && shortcuts['?']) {
        e.preventDefault();
        shortcuts['?'](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
