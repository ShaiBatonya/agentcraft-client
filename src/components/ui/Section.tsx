import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'py-12',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24',
};

const backgroundClasses = {
  default: '',
  muted: 'bg-neutral-50 dark:bg-neutral-900/50',
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'default',
  size = 'lg',
}) => {
  return (
    <section className={`${sizeClasses[size]} ${backgroundClasses[background]} ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}; 