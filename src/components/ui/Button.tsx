import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary: 'bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-600',
  outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-primary-500 dark:text-neutral-300 dark:hover:bg-neutral-800',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}; 