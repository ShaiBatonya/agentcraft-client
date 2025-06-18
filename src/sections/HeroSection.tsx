import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-dark bg-noise">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="text-center">
          {/* Status Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-muted-800 bg-muted-950/50 px-4 py-2 text-caption-1 text-muted-400 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
            AI Neural Network: Online
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-display-2 lg:text-display-1 text-gradient">
            Beyond Intelligence
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-3xl text-body-1 lg:text-title-3 text-muted-300 leading-relaxed">
            Experience the future of AI conversation with our revolutionary neural architecture.{' '}
            <span className="text-accent-gradient font-semibold">
              Infinite possibilities, instant responses.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/chat">
              <Button 
                size="lg" 
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              >
                Start Conversation
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              icon={
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              }
            >
              Watch Live Demo
            </Button>
          </div>

          {/* Visual Element */}
          <div className="relative mx-auto max-w-4xl">
            <div className="aspect-video rounded-xl border border-muted-800 bg-gradient-to-br from-muted-950 to-muted-900 p-1">
              <div className="h-full w-full rounded-lg bg-gradient-to-br from-muted-900 to-black flex items-center justify-center">
                <div className="text-muted-500 text-center">
                  <div className="mb-4 h-16 w-16 mx-auto rounded-full bg-accent-500/20 flex items-center justify-center">
                    <svg className="h-8 w-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-body-2">AI Interface Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 