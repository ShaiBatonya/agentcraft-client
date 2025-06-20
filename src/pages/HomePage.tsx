import React from 'react';
import { HeroSection } from '@/sections/HeroSection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { StatsSection } from '@/sections/StatsSection';
import { CTASection } from '@/sections/CTASection';
import { OAuthDebugger } from '@/components/auth/OAuthDebugger';

const HomePage: React.FC = React.memo(() => {
  return (
    <div 
      className="min-h-screen bg-slate-900 text-white"
      style={{ 
        transform: 'translateZ(0)', // Hardware acceleration
        backfaceVisibility: 'hidden' // Reduce paint operations
      }}
    >
      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      
      {/* Temporary debug component */}
      {import.meta.env.DEV && <OAuthDebugger />}
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage; 