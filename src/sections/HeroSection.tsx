import React from 'react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-hero-radial">
      {/* Background Elements - Full Screen Width */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-32 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-blue-500/10 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute -top-40 left-10 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full section-spacing">
        <div className="container-content">
          <div className="text-center space-y-12">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-xl">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <span>AI Neural Network: </span>
              <span className="text-emerald-400 font-semibold">Online</span>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-white/70 text-xs">Real-time processing</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                Beyond{' '}
                <span className="text-gradient-brand">Intelligence</span>
              </h1>
              
              <p className="mx-auto max-w-4xl text-xl font-medium leading-relaxed text-white/80 sm:text-2xl md:text-3xl">
                Experience the future of AI conversation with our revolutionary neural architecture.
              </p>
              
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
                <span className="text-gradient-brand font-semibold">Infinite possibilities, instant responses.</span> 
                {' '}Built for innovators, creators, and forward-thinkers who demand excellence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <Link to="/chat" className="w-full sm:w-auto">
                <button className="btn-primary animate-glow-pulse group">
                  <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start Conversation
                  <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              
              <button className="btn-secondary group w-full sm:w-auto">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <div className="absolute inset-0 h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75" />
                </div>
                Watch Live Demo
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Product Preview */}
            <div className="mx-auto mt-20 max-w-6xl">
              <div className="relative">
                {/* Glow effect behind preview */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
                
                <div className="relative aspect-video rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-2 backdrop-blur-xl">
                  <div className="h-full w-full rounded-2xl bg-gradient-to-br from-gray-900/50 to-black flex items-center justify-center overflow-hidden">
                    {/* Mock Terminal/Chat Interface */}
                    <div className="w-full max-w-4xl space-y-4 p-8">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500" />
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          AgentCraft Terminal
                        </div>
                      </div>
                      
                      {/* Chat Messages */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-accent-400">AI</span>
                          </div>
                          <div className="flex-1 text-left text-white/80">
                            Hello! I'm your AI assistant. How can I help you today?
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 justify-end">
                          <div className="max-w-md text-right">
                            <div className="inline-block rounded-2xl bg-accent-500/20 px-4 py-2 text-white/90">
                              Create a modern web application
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-white/60">You</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-accent-400">AI</span>
                          </div>
                          <div className="flex-1 text-left text-white/80">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-accent-400 animate-bounce" />
                              <div className="h-2 w-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="h-2 w-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                              <span className="text-white/60 text-sm ml-2">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/40 md:gap-12">
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enterprise Ready
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Lightning Fast
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure by Design
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 