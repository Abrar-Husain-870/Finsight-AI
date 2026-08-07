import { useEffect } from 'react';

/**
 * Hook to prompt the user before they leave the page if there are unsaved changes.
 * Note: Modern browsers require a user interaction before this prompt will show.
 * 
 * @param isDirty boolean indicating if there are unsaved changes
 * @param warningMessage (optional) string to show (browsers often ignore this and show default)
 */
export function useUnsavedChanges(isDirty: boolean, warningMessage: string = 'You have unsaved changes. Are you sure you want to leave?') {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = warningMessage;
        return warningMessage;
      }
      return undefined;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, warningMessage]);
}
