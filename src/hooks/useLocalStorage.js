import { useState, useEffect } from "react";

// Persist a piece of state to localStorage. Survives reloads; degrades
// gracefully when storage is unavailable (private mode, SSR, etc.).
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write failures */
    }
  }, [key, value]);

  return [value, setValue];
}
