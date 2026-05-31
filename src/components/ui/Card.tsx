import React from 'react';

interface CardProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  dashed?: boolean;
}

export default function Card({ href, className = '', children, dashed = false }: CardProps) {
  const baseStyles = `block rounded-lg p-4 transition-all duration-200 ${
    dashed 
      ? 'border-2 border-dashed border-border-default hover:border-border-hover' 
      : 'bg-bg-secondary border border-border-default hover:border-border-hover'
  } hover:translate-y-[-1px]`;

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`}>
      {children}
    </div>
  );
}
