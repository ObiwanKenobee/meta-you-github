import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showProgress?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  showProgress = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-400`} />
        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-pulse" />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-indigo-300 mb-2">{text}</p>
        
        {showProgress && (
          <div className="w-48 h-1 bg-indigo-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-400 to-amber-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <div className="text-xs text-indigo-400 mt-2">
          Initializing AI mentors and growth systems...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;