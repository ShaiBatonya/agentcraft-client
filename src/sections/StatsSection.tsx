import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: '50M+',
      label: 'Messages Processed',
      description: 'Conversations powered by AI',
      icon: (
        <svg className="h-10 w-10 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      gradient: 'from-accent-500/20 to-blue-500/20',
    },
    {
      value: '99.99%',
      label: 'Uptime',
      description: 'Always available when you need it',
      icon: (
        <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500/20 to-green-500/20',
    },
    {
      value: '<50ms',
      label: 'Response Time',
      description: 'Lightning-fast AI responses',
      icon: (
        <svg className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      gradient: 'from-orange-500/20 to-yellow-500/20',
    },
    {
      value: '∞',
      label: 'Possibilities',
      description: 'Unlimited creative potential',
      icon: (
        <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  return (
    <section className="relative w-full bg-section-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-20 h-80 w-80 rounded-full bg-accent-500/5 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative w-full section-spacing">
        <div className="container-content">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl">
              <div className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              Real-time Analytics
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Trusted by{' '}
              <span className="text-gradient-brand">Thousands</span>
            </h2>
            
            <p className="mx-auto max-w-3xl text-xl text-white/70 leading-relaxed">
              Join the growing community of innovators who rely on AgentCraft for their AI needs.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card-luxury group text-center space-y-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon with gradient background */}
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} transition-all duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>
                
                {/* Value */}
                <div className="space-y-2">
                  <div className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-white/90">
                    {stat.label}
                  </div>
                  <div className="text-sm text-white/60 leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <p className="text-lg text-white/60">
              Ready to join them?{' '}
              <a href="/chat" className="text-gradient-brand font-semibold hover:underline transition-all duration-300">
                Start your free trial →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 