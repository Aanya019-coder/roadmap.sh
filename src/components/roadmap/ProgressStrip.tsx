import React from 'react';

interface ProgressStripProps {
  percentage: number;
  isLoggedIn: boolean;
}

export default function ProgressStrip({ percentage, isLoggedIn }: ProgressStripProps) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 bg-bg-secondary/50 border-b border-border-default">
      <span className="text-sm font-medium text-text-primary whitespace-nowrap">
        {percentage}% Done
      </span>
      <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-yellow rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!isLoggedIn && (
        <a 
          href="/login" 
          className="text-xs text-accent-yellow hover:text-yellow-300 transition-colors whitespace-nowrap"
        >
          Login to track your progress
        </a>
      )}
    </div>
  );
}
