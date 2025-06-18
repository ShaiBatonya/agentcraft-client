import React from 'react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Intelligent Conversation',
      description: 'Experience natural, context-aware dialogue with our advanced AI that understands nuance and maintains conversation flow.',
      icon: (
        <svg className="h-12 w-12 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      gradient: 'from-accent-500/10 via-blue-500/10 to-purple-500/10',
      borderGradient: 'from-accent-500/40 via-blue-500/40 to-purple-500/40',
    },
    {
      title: 'Real-time Processing',
      description: 'Get instant responses powered by cutting-edge neural networks optimized for speed and accuracy.',
      icon: (
        <svg className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      gradient: 'from-emerald-500/10 via-green-500/10 to-teal-500/10',
      borderGradient: 'from-emerald-500/40 via-green-500/40 to-teal-500/40',
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, zero-knowledge architecture, and SOC 2 compliance ensure your data stays private.',
      icon: (
        <svg className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      gradient: 'from-purple-500/10 via-violet-500/10 to-pink-500/10',
      borderGradient: 'from-purple-500/40 via-violet-500/40 to-pink-500/40',
    },
    {
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and workflows through our comprehensive API and webhook system.',
      icon: (
        <svg className="h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      gradient: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10',
      borderGradient: 'from-orange-500/40 via-amber-500/40 to-yellow-500/40',
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep insights into conversation patterns, performance metrics, and user engagement with beautiful dashboards.',
      icon: (
        <svg className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      gradient: 'from-blue-500/10 via-indigo-500/10 to-cyan-500/10',
      borderGradient: 'from-blue-500/40 via-indigo-500/40 to-cyan-500/40',
    },
    {
      title: 'Global Scale',
      description: 'Deployed across 6 continents with edge computing ensuring low latency regardless of your location.',
      icon: (
        <svg className="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
        </svg>
      ),
      gradient: 'from-rose-500/10 via-pink-500/10 to-red-500/10',
      borderGradient: 'from-rose-500/40 via-pink-500/40 to-red-500/40',
    },
  ];

  return (
    <section className="relative w-full">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full section-spacing">
        <div className="container-content">
          {/* Section Header */}
          <div className="text-center space-y-8 mb-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl">
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              Core Features
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Engineered for{' '}
              <span className="text-gradient-brand">Excellence</span>
            </h2>
            
            <p className="mx-auto max-w-4xl text-xl text-white/70 leading-relaxed">
              Every feature is meticulously crafted to deliver an unparalleled AI experience.
              From lightning-fast responses to enterprise-grade security.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-all duration-500 group-hover:opacity-100`} />
                
                {/* Border gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.borderGradient} p-px opacity-0 transition-all duration-500 group-hover:opacity-100`}>
                  <div className="h-full w-full rounded-3xl bg-black/80 backdrop-blur-xl" />
                </div>
                
                {/* Content */}
                <div className="relative h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-8 backdrop-blur-xl transition-all duration-500 group-hover:border-transparent group-hover:shadow-2xl group-hover:shadow-black/40">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/20 group-hover:to-white/10">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Learn More Link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white/70 transition-all duration-300">
                      <span>Learn more</span>
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 text-center space-y-8">
            <h3 className="text-3xl font-bold text-white">
              Ready to experience the future?
            </h3>
            
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <button className="btn-primary group">
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Building
              </button>
              
              <button className="btn-secondary group">
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 