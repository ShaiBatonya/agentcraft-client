import React from 'react';

const FeaturesSection: React.FC = React.memo(() => {
  const features = [
    {
      icon: (
        <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Smart Thread Management',
      description: 'Organize conversations intelligently with automatic thread detection and seamless context switching.'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Lightning Fast Responses',
      description: 'Experience blazing-fast AI responses with optimized API calls and intelligent caching strategies.'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile-First Design',
      description: 'Perfectly crafted for mobile devices with responsive layouts and touch-optimized interactions.'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Production Ready',
      description: 'Built with enterprise-grade security, reliability, and scalability for mission-critical applications.'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      title: 'Smart Auto-Scroll',
      description: 'Intelligent scroll behavior that follows conversations naturally while preserving user control.'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Advanced Customization',
      description: 'Personalize your experience with themes, layouts, and AI model preferences tailored to your workflow.'
    }
  ];

  return (
    <section
      className="relative w-full bg-gradient-to-b from-[#24243e] via-[#302b63] to-[#0f0c29] py-24 sm:py-32"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        contentVisibility: 'auto',
        containIntrinsicSize: '800px'
      }}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-pink-500/5 blur-2xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
            Powerful Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 [text-wrap:balance]">
              Next-Generation AI
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-white/90 leading-relaxed [text-wrap:balance]">
            Experience the cutting edge of conversational AI with features designed for productivity,
            performance, and seamless user experience across all platforms.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 group-hover:border-white/20 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-black/30">
                {/* Icon */}
                <div className="mb-4 sm:mb-6">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-black/20 backdrop-blur-xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300 [text-wrap:balance]">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300 [text-wrap:balance]">
                    {feature.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <p className="text-white/80 text-sm sm:text-base mb-6 [text-wrap:balance]">
            Ready to experience the future of AI conversations?
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <span>Get Started Today</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection; 