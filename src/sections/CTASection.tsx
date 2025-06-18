import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-muted-800 bg-gradient-to-br from-muted-950 to-black p-12 text-center lg:p-20">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl" />
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-purple-500/5 blur-2xl" />
          </div>
          
          <div className="relative">
            <h2 className="mb-6 text-display-3 lg:text-display-2 font-bold text-white">
              Ready to Experience{' '}
              <span className="text-accent-gradient">The Future?</span>
            </h2>
            
            <p className="mx-auto mb-12 max-w-2xl text-body-1 lg:text-title-3 text-muted-300">
              Join thousands of innovators who are already experiencing the power of next-generation AI conversations.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/chat">
                <Button 
                  size="lg"
                  className="animate-glow"
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                >
                  Start Your Journey
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              >
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 