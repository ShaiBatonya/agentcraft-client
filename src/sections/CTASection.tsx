import React from 'react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Elements - Full Screen Width */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-purple-500/20 to-pink-500/20" />
      <div className="absolute inset-0 bg-section-gradient" />
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-blue-500/20 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full section-spacing">
        <div className="container-content">
          <div className="text-center space-y-12">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-accent-400 animate-ping opacity-75" />
              </div>
              <span>Ready to Transform Your Workflow?</span>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Start Building the{' '}
                <span className="text-gradient-brand">Future</span>
                <br />
                Today
              </h2>
              
              <p className="mx-auto max-w-3xl text-xl text-white/80 leading-relaxed sm:text-2xl">
                Join thousands of innovators already using AgentCraft to revolutionize their AI workflows.
                <span className="text-gradient-brand font-semibold block mt-2">
                  No credit card required. Start in seconds.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <Link to="/chat" className="w-full sm:w-auto">
                <button className="btn-primary animate-glow-pulse group text-lg px-12 py-4 min-h-[60px]">
                  <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started Free
                  <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              
              <button className="btn-secondary group w-full sm:w-auto text-lg px-12 py-4 min-h-[60px]">
                <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                View Documentation
              </button>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/60 md:gap-12">
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Free Forever Plan
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Enterprise Security
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V18.75A.75.75 0 0112 18zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM18 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18.75A.75.75 0 0118 12z" />
                </svg>
                24/7 Support
              </div>
            </div>

            {/* Social Proof */}
            <div className="border-t border-white/10 pt-12">
              <p className="text-sm text-white/60 mb-8">
                Trusted by teams at
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                {/* Mock Company Logos */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-12 w-24 items-center justify-center rounded-lg bg-white/5 text-white/40 text-sm font-semibold border border-white/5"
                  >
                    Logo {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 