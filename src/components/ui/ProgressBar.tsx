import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showLabel?: boolean;
  color?: 'yellow' | 'green' | 'blue';
  size?: 'sm' | 'md';
}

export default function ProgressBar({ 
  percentage, 
  label, 
  showLabel = true, 
  color = 'yellow',
  size = 'sm'
}: ProgressBarProps) {
  const colors: Record<string, string> = {
    yellow: 'bg-accent-yellow',
    green: 'bg-accent-green',
    blue: 'bg-blue-500',
  };

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">{label || `${Math.round(percentage)}% Done`}</span>
          <span className="text-xs text-text-muted">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-bg-tertiary rounded-full overflow-hidden`}>
        <div 
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
}
