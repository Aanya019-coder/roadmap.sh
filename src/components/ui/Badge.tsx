import React from 'react';

interface BadgeProps {
  variant?: 'new' | 'textual' | 'question' | 'beginner' | 'intermediate' | 'advanced' | 'tech' | 'default';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    new: 'bg-green-500/10 text-green-400 border-green-500/20',
    textual: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    question: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
    tech: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    default: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
