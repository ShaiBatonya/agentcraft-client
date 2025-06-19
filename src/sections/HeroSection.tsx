import React from 'react';
import { Link } from 'react-router-dom';
import { HeroContainer } from '@/components/layout/ResponsiveContainer';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-hero-radial flex items-center">
      {/* Enhanced Background Elements with better mobile optimization */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-1/4 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-accent-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-16 sm:bottom-32 right-1/4 h-32 w-32 sm:h-80 sm:w-80 rounded-full bg-purple-500/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 sm:h-64 sm:w-64 rounded-full bg-blue-500/10 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute -top-20 sm:-top-40 left-5 sm:left-10 h-36 w-36 sm:h-72 sm:w-72 rounded-full bg-accent-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 sm:-bottom-40 right-5 sm:right-10 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <HeroContainer className="relative">
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Enhanced Status Badge with better mobile sizing */}
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/5 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700">
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

          {/* Enhanced Main Headline with responsive typography */}
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight tracking-tight text-white">
              Beyond{' '}
              <span className="text-gradient-brand bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-purple-400 to-pink-400">
                Intelligence
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl sm:max-w-3xl lg:max-w-4xl text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-white/80 px-4 sm:px-0">
              Experience the future of AI conversation with our revolutionary neural architecture.
            </p>
            
            <p className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-white/60 px-4 sm:px-0">
              <span className="text-gradient-brand font-semibold bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-purple-400">
                Infinite possibilities, instant responses.
              </span> 
              {' '}Built for innovators, creators, and forward-thinkers who demand excellence.
            </p>
          </div>

          {/* Enhanced CTA Buttons with better mobile handling */}
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg sm:max-w-none">
              <Link to="/chat" className="w-full sm:w-auto">
                <button className="btn-primary animate-glow-pulse group w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start Conversation
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              
              <button className="btn-secondary group w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation">
                <div className="relative">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 animate-pulse" />
                  <div className="absolute inset-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 animate-ping opacity-75" />
                </div>
                <span className="hidden sm:inline">Watch Live Demo</span>
                <span className="sm:hidden">Live Demo</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Product Preview with responsive design */}
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-full px-4 sm:px-0 sm:max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
            <div className="relative">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-accent-500/20 via-purple-500/20 to-pink-500/20 blur-2xl sm:blur-3xl" />
              
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
                    
                    {/* Enhanced Chat Messages with responsive sizing */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-accent-400">AI</span>
                        </div>
                        <div className="flex-1 text-left text-white/80 text-sm sm:text-base">
                          Hello! I'm your AI assistant. How can I help you today?
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 sm:gap-3 justify-end">
                        <div className="max-w-xs sm:max-w-md text-right">
                          <div className="inline-block rounded-xl sm:rounded-2xl bg-accent-500/20 px-3 sm:px-4 py-2 text-white/90 text-sm sm:text-base">
                            Create a modern web application
                          </div>
                        </div>
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white/60">You</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-accent-400">AI</span>
                        </div>
                        <div className="flex-1 text-left text-white/80">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent-400 animate-bounce" />
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
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

          {/* Enhanced Trust Indicators with responsive layout */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 text-white/40 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="whitespace-nowrap">Enterprise Ready</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="whitespace-nowrap">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="whitespace-nowrap">Secure by Design</span>
            </div>
          </div>
        </div>
      </HeroContainer>
    </section>
  );
}; 