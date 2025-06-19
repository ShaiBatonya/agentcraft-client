// World-Class Responsive Container with consistent spacing and breakpoints
import React from 'react';
import { cn } from '@/shared/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centerContent?: boolean;
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  padding = 'md',
  centerContent = false,
  as: Component = 'div',
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-full',
    full: 'w-full max-w-none',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2 sm:px-6 sm:py-4',
    md: 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12',
    lg: 'px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
    xl: 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24',
  };

  return (
    <Component
      className={cn(
        'w-full mx-auto',
        sizeClasses[size],
        paddingClasses[padding],
        centerContent && 'flex flex-col items-center justify-center text-center',
        className
      )}
    >
      {children}
    </Component>
  );
};

// Specialized containers for common use cases
export const HeroContainer: React.FC<Omit<ResponsiveContainerProps, 'size' | 'padding'>> = (props) => (
  <ResponsiveContainer {...props} size="xl" padding="xl" />
);

export const ContentContainer: React.FC<Omit<ResponsiveContainerProps, 'size'>> = (props) => (
  <ResponsiveContainer {...props} size="lg" />
);

export const NarrowContainer: React.FC<Omit<ResponsiveContainerProps, 'size'>> = (props) => (
  <ResponsiveContainer {...props} size="md" />
); 