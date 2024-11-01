import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      shortcuts.forEach(({ key, ctrlKey, altKey, shiftKey, callback }) => {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === !!ctrlKey &&
          event.altKey === !!altKey &&
          event.shiftKey === !!shiftKey
        ) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Usage example:
/*
useKeyboardShortcuts([
  { key: 'n', ctrlKey: true, callback: () => setIsAddingBookmark(true) },
  { key: 'Escape', callback: () => setIsAddingBookmark(false) },
]);
*/