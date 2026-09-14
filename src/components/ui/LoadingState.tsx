import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading data...', rows = 4 }) => {
  return (
    <div className="w-full p-8 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-xs font-medium text-slate-500">{message}</p>
      
      {/* Subtle pulse placeholder rows */}
      <div className="w-full max-w-md space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-200/60 rounded-full animate-pulse" style={{ width: `${85 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
};
