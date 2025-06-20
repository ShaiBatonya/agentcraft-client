import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

export const HeroSection: React.FC = React.memo(() => {
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
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center"
      style={{ 
        transform: 'translateZ(0)', // Hardware acceleration
        backfaceVisibility: 'hidden', // Reduce paint operations
        contentVisibility: 'auto',
        containIntrinsicSize: '1000px'
      }}
    >
      {/* Enhanced Background Elements with hardware acceleration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-1/4 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-indigo-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-16 sm:bottom-32 right-1/4 h-32 w-32 sm:h-80 sm:w-80 rounded-full bg-purple-500/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 sm:h-64 sm:w-64 rounded-full bg-blue-500/10 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute -top-20 sm:-top-40 left-5 sm:left-10 h-36 w-36 sm:h-72 sm:w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 sm:-bottom-40 right-5 sm:right-10 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Full-width centered content */}
      <div className="relative w-full max-w-none py-24 sm:py-32">
        <div className="text-center space-y-8 sm:space-y-12 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Status Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/5 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-xl">
            <div className="relative">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="absolute inset-0 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="hidden sm:inline">AI Neural Network: </span>
            <span className="sm:hidden">AI: </span>
            <span className="text-emerald-400 font-semibold">Online</span>
            <div className="h-3 sm:h-4 w-px bg-white/20" />
            <span className="text-white/70 text-xs">Real-time</span>
          </div>

          {/* Main Headline - Original Style Restored */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Experience the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
                AI Conversations
              </span>
            </h1>
            
            <p className="mx-auto max-w-3xl text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-slate-100 px-4 sm:px-0">
              AgentCraft delivers a premium ChatGPT-like experience with intelligent thread management, 
              smart auto-scroll, and mobile-first design optimized for seamless conversations across all devices.
            </p>
            
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-200 px-4 sm:px-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">
                Infinite possibilities, instant responses.
              </span>
              {' '}Built for innovators, creators, and forward-thinkers who demand excellence.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg sm:max-w-none">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 touch-optimized focus-optimized"
              >
                <span>Start Chatting</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-all duration-200 touch-optimized focus-optimized">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a4 4 0 118 0v2M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>View Demo</span>
              </button>
            </div>
          </div>

          {/* Enhanced Product Preview */}
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-full px-4 sm:px-0 sm:max-w-6xl">
            <div className="relative">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl sm:blur-3xl" />
              
              <div className="relative aspect-video rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-1 sm:p-2 backdrop-blur-xl">
                <div className="h-full w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/50 to-black flex items-center justify-center overflow-hidden">
                  {/* Enhanced Mock Terminal/Chat Interface */}
                  <div className="w-full max-w-4xl space-y-3 sm:space-y-4 p-4 sm:p-6 lg:p-8">
                    {/* Enhanced Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500" />
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500" />
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="hidden sm:inline">AgentCraft Terminal</span>
                        <span className="sm:hidden">AgentCraft</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Chat Messages */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-indigo-400">AI</span>
                        </div>
                        <div className="flex-1 text-left text-white/80 text-sm sm:text-base">
                          Hello! I'm your AI assistant. How can I help you today?
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 sm:gap-3 justify-end">
                        <div className="max-w-xs sm:max-w-md text-right">
                          <div className="inline-block rounded-xl sm:rounded-2xl bg-indigo-500/20 px-3 sm:px-4 py-2 text-white/90 text-sm sm:text-base">
                            Create a modern web application
                          </div>
                        </div>
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white/60">You</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-indigo-400">AI</span>
                        </div>
                        <div className="flex-1 text-left text-white/80">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-indigo-400 animate-bounce" />
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="text-white/60 text-xs sm:text-sm ml-1 sm:ml-2">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 text-white/40 px-4 sm:px-0">
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">Production Ready</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">Mobile Optimized</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">High Performance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection'; 