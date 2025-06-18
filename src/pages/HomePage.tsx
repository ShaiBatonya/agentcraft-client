import React from 'react';
import { Link } from 'react-router-dom';
import { Section, FeatureCard, StatCard, Button } from '@/components/ui';

export const HomePage: React.FC = () => {
  const stats = [
    { value: '50M+', label: 'Messages Processed', icon: '💬' },
    { value: '99.99%', label: 'Uptime', icon: '⚡' },
    { value: '<50ms', label: 'Response Time', icon: '🚀' },
    { value: '∞', label: 'Possibilities', icon: '✨' },
  ];

  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Lightning Fast',
      description: 'Experience instant AI responses with our optimized neural architecture and real-time processing pipeline.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Infinitely Smart',
      description: 'Advanced AI with contextual understanding, memory retention, and evolving conversation intelligence.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Ultra Secure',
      description: 'Enterprise-grade encryption, zero-knowledge architecture, and complete privacy protection for all conversations.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Section size="xl" className="relative">
        <div className="text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300 mb-8">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            AI Neural Network: Online
          </div>

          {/* Hero Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
            Beyond{' '}
            <span className="gradient-text">Intelligence</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl max-w-3xl mx-auto">
            Experience the future of AI conversation with our revolutionary neural architecture.{' '}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              Infinite possibilities, instant responses.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/chat">
              <Button size="lg" className="min-w-[200px]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Conversation
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="min-w-[200px]">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Watch Live Demo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section background="muted">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 mb-6">
            <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
            Powered by Neural Architecture
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why Choose{' '}
            <span className="gradient-text">AgentCraft</span>?
          </h2>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Built with cutting-edge AI technology to provide you with the most advanced conversation experience ever created.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-8 text-center dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900 lg:p-16">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
            Ready to Experience{' '}
            <span className="gradient-text">The Future?</span>
          </h2>
          
          <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Join thousands of innovators who are already experiencing the power of next-generation AI conversations.
          </p>
          
          <Link to="/chat">
            <Button size="lg" className="min-w-[250px]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Your Journey
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}; 