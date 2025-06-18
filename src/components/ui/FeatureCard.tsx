import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = '',
  style,
}) => {
  return (
    <div 
      className={`group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-600 ${className}`}
      style={style}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-900/50">
        {icon}
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      
      <p className="text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}; 