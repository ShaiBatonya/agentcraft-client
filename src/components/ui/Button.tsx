import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'bg-transparent text-muted-400 hover:text-white hover:bg-muted-900 transition-all duration-200',
};

const sizes = {
  sm: 'px-4 py-2 text-caption-1 min-h-[36px]',
  md: 'px-6 py-3 text-body-2 min-h-[44px]',
  lg: 'px-8 py-4 text-body-1 min-h-[52px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        focus-ring
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && icon && icon}
      {children}
    </button>
  );
}; 