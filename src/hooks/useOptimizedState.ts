import { useState, useCallback, useRef } from 'react';

// Debounced state hook for performance optimization
export const useDebouncedState = <T>(initialValue: T, delay: number = 300) => {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setValueWithDebounce = useCallback((newValue: T) => {
    setValue(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, delay);
  }, [delay]);

  return [value, debouncedValue, setValueWithDebounce] as const;
};

// Throttled state hook for high-frequency updates
export const useThrottledState = <T>(initialValue: T, delay: number = 100) => {
  const [value, setValue] = useState<T>(initialValue);
  const lastUpdateRef = useRef<number>(0);

  const setValueWithThrottle = useCallback((newValue: T) => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= delay) {
      setValue(newValue);
      lastUpdateRef.current = now;
    }
  }, [delay]);

  return [value, setValueWithThrottle] as const;
};