import React from 'react';
import { Card } from '@/components/ui/Card';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Lightning Fast',
      description: 'Experience instant AI responses with our optimized neural architecture and real-time processing pipeline.',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Infinitely Smart',
      description: 'Advanced AI with contextual understanding, memory retention, and evolving conversation intelligence.',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Ultra Secure',
      description: 'Enterprise-grade encryption, zero-knowledge architecture, and complete privacy protection.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-radial">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-800 bg-accent-950/30 px-4 py-2 text-caption-1 text-accent-400">
            <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
            Powered by Neural Architecture
          </div>
          
          <h2 className="mb-6 text-display-3 lg:text-display-2 font-bold text-white">
            Why Choose{' '}
            <span className="text-accent-gradient">AgentCraft</span>?
          </h2>
          
          <p className="mx-auto max-w-3xl text-body-1 lg:text-title-3 text-muted-300">
            Built with cutting-edge AI technology to provide you with the most advanced conversation experience ever created.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              glow
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500 transition-all duration-300 group-hover:bg-accent-500/20 group-hover:scale-110">
                {feature.icon}
              </div>
              
              <h3 className="mb-4 text-title-3 font-semibold text-white">
                {feature.title}
              </h3>
              
              <p className="text-body-2 text-muted-400 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover Arrow */}
              <div className="mt-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-accent-500 font-medium text-caption-1">
                  <span>Learn more</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 