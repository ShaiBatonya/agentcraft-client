import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

export const CTASection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = useCallback(() => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <section 
      className="relative w-full bg-gradient-to-b from-[#24243e] via-[#302b63] to-[#0f0c29] py-24 sm:py-32"
      style={{ 
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        contentVisibility: 'auto',
        containIntrinsicSize: '600px'
      }}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-pink-500/10 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute -top-10 right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-10 left-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced content card */}
        <div className="relative">
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
          
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-8 sm:p-12 lg:p-16 backdrop-blur-xl text-center">
            {/* Status indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/90 backdrop-blur-xl mb-8">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <span>Ready to deploy</span>
              <div className="h-3 w-px bg-white/20" />
              <span className="text-white/70">Production-grade</span>
            </div>

            {/* Main content */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Ready to Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
                  AI Conversations?
                </span>
              </h2>
              
              <p className="mx-auto max-w-3xl text-lg sm:text-xl md:text-2xl font-medium text-slate-200 leading-relaxed">
                Join thousands of developers who trust AgentCraft for their mission-critical AI applications. 
                Experience the difference that quality engineering makes.
              </p>

              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <p className="text-base sm:text-lg text-slate-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">
                    No setup required.
                  </span>
                  {' '}Start chatting in seconds.
                </p>
              </div>
            </div>

            {/* Enhanced action buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 mt-10 sm:mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg sm:max-w-none">
                <button
                  onClick={handleGetStarted}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  <span className="text-lg">Start Building Today</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-transparent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a4 4 0 118 0v2M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>View Documentation</span>
                </button>
              </div>
            </div>

            {/* Enhanced feature highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 mt-12 sm:mt-16 text-white/60">
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Enterprise support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection'; 