import { useState, useEffect } from 'react';

/**
 * useLocalStorage - Syncs React state with localStorage
 * @param {string} key - localStorage key
 * @param {*} defaultValue - initial value if key doesn't exist
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored);
    } catch (err) {
      console.warn(`useLocalStorage: failed to parse key "${key}"`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`useLocalStorage: failed to save key "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
