import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'luxury' | 'glow';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-gradient-to-br from-white/5 to-black/20 border border-white/10 p-6 backdrop-blur-xl',
    luxury: 'card-luxury',
    glow: 'card-luxury hover:shadow-2xl',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}; 