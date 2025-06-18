import React from 'react';
import { HeroSection } from '@/sections/HeroSection';
import { StatsSection } from '@/sections/StatsSection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { CTASection } from '@/sections/CTASection';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}; 