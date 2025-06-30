import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>();
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    startTimeRef.current = performance.now();
    
    return () => {
      if (startTimeRef.current) {
        const renderTime = performance.now() - startTimeRef.current;
        const metrics: PerformanceMetrics = {
          componentName,
          renderTime,
          timestamp: Date.now()
        };
        
        metricsRef.current.push(metrics);
        
        // Log slow renders in development
        if (process.env.NODE_ENV === 'development' && renderTime > 16) {
          console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  });

  const getMetrics = () => metricsRef.current;
  
  return { getMetrics };
};