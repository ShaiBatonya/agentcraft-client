import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (displayChildren !== children) {
      setIsAnimating(true);
      
      // Start exit animation
      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        
        // Start enter animation
        const enterTimer = setTimeout(() => {
          setIsAnimating(false);
        }, 50);
        
        return () => clearTimeout(enterTimer);
      }, 150);
      
      return () => clearTimeout(exitTimer);
    }
  }, [children, displayChildren]);

  return (
    <div 
      className={`transition-all duration-300 ease-out ${className} ${
        isAnimating 
          ? 'opacity-0 transform translate-y-4 scale-[0.98]' 
          : 'opacity-100 transform translate-y-0 scale-100'
      }`}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
    >
      {displayChildren}
    </div>
  );
}; 