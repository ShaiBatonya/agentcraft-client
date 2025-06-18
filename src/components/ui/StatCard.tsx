import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  className = '',
  style,
}) => {
  return (
    <div 
      className={`rounded-lg border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:border-primary-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-600 ${className}`}
      style={style}
    >
      {icon && (
        <div className="mb-2 flex justify-center text-2xl">
          {icon}
        </div>
      )}
      
      <div className="mb-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-3xl">
        {value}
      </div>
      
      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
        {label}
      </div>
    </div>
  );
}; 