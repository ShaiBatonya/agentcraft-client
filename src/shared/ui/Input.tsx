// Premium Input component with modern styling and floating labels
import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'glass';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  variant = 'default',
  className = '',
  id,
  value,
  defaultValue,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value || !!defaultValue);
  
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isFloating = label && (isFocused || hasValue || value || defaultValue);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const baseInputClasses = 'w-full transition-all duration-300 focus:outline-none peer';
  
  const variantClasses = {
    default: `${baseInputClasses} px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border rounded-xl hover:border-slate-300 dark:hover:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
    filled: `${baseInputClasses} px-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500`,
    glass: `${baseInputClasses} px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
  };

  const stateClasses = error 
    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
    : 'border-slate-200 dark:border-slate-700';

  const inputClasses = `${variantClasses[variant]} ${stateClasses} ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${label ? 'pt-6' : ''} ${className}`;

  const labelClasses = label 
    ? `absolute left-4 transition-all duration-300 pointer-events-none ${
        isFloating
          ? 'top-2 text-xs text-slate-500 dark:text-slate-400'
          : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500'
      }`
    : '';

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          className={inputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={labelClasses}
          >
            {label}
          </label>
        )}

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helper && !error && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {helper}
        </p>
      )}

      {/* Error Text */}
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}; 