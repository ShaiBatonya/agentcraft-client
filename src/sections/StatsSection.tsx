import React from 'react';

const StatsSection: React.FC = React.memo(() => {
  const stats = [
    {
      number: '10k+',
      label: 'Active Users',
      description: 'Developers and teams using AgentCraft daily'
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Enterprise-grade reliability and performance'
    },
    {
      number: '<50ms',
      label: 'Response Time',
      description: 'Lightning-fast AI responses and interactions'
    },
    {
      number: '24/7',
      label: 'Support',
      description: 'Round-the-clock assistance and monitoring'
    }
  ];

  return (
    <section
      className="relative w-full bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] py-24 sm:py-32"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        contentVisibility: 'auto',
        containIntrinsicSize: '600px'
      }}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-pink-500/5 blur-2xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
            Trusted by
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 [text-wrap:balance]">
              Thousands of Developers
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-white/90 leading-relaxed [text-wrap:balance]">
            Join a growing community of developers, startups, and enterprises who rely on
            AgentCraft for their mission-critical AI conversations.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full text-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 group-hover:border-white/20 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-black/30">
                {/* Number */}
                <div className="mb-4">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 group-hover:from-indigo-300 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300 [text-wrap:balance]">
                    {stat.number}
                  </div>
                </div>

                {/* Label */}
                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-slate-100 transition-colors duration-300 [text-wrap:balance]">
                    {stat.label}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-white/80 group-hover:text-white/90 transition-colors duration-300 leading-relaxed [text-wrap:balance]">
                  {stat.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-b-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Live Stats</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white/70 text-sm">Updated in real-time</span>
          </div>
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection; 