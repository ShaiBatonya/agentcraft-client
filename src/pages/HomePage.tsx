import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HeroSection } from '@/sections/HeroSection';
import React, { lazy, Suspense } from 'react';

// Lazy load non-critical sections
const FeaturesSection = lazy(() => import('@/sections/FeaturesSection'));
const StatsSection = lazy(() => import('@/sections/StatsSection'));
const CTASection = lazy(() => import('@/sections/CTASection'));
const OAuthDebugger = lazy(() => import('@/components/auth/OAuthDebugger'));

const HomePage: React.FC = React.memo(() => {
  return (
    <div
      className="min-h-screen bg-slate-900 text-white overflow-x-hidden"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero section is critical, load immediately */}
        <HeroSection />

        {/* Lazy load other sections with fallback */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <FeaturesSection />
          <StatsSection />
          <CTASection />

          {/* Debug component in dev only */}
          {import.meta.env.DEV && <OAuthDebugger />}
        </Suspense>
      </main>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage; 