// Ultra-Premium HomePage with cinematic effects and immersive design
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


export const HomePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Experience instant AI responses with our optimized neural architecture and real-time processing pipeline.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Infinitely Smart",
      description: "Advanced AI with contextual understanding, memory retention, and evolving conversation intelligence.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Ultra Secure",
      description: "Enterprise-grade encryption, zero-knowledge architecture, and complete privacy protection for all conversations.",
      color: "from-emerald-400 to-teal-500"
    }
  ];

  const stats = [
    { value: "50M+", label: "Messages Processed", icon: "💬" },
    { value: "99.99%", label: "Uptime", icon: "⚡" },
    { value: "<50ms", label: "Response Time", icon: "🚀" },
    { value: "∞", label: "Possibilities", icon: "✨" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Ultra-Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Ambient Background Orbs with Mouse Parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary Orbital Objects */}
          <div 
            className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl animate-float-delayed"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
              top: '10%',
              right: '10%',
            }}
          />
          <div 
            className="absolute w-80 h-80 rounded-full opacity-25 blur-3xl float-gentle"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              transform: `translate(${-mousePosition.x * 0.15}px, ${mousePosition.y * 0.08}px)`,
              bottom: '20%',
              left: '5%',
            }}
          />
          <div 
            className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl animate-bounce-gentle"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              transform: `translate(${mousePosition.x * 0.05}px, ${-mousePosition.y * 0.12}px)`,
              top: '60%',
              right: '30%',
            }}
          />
          
          {/* Secondary Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-ping" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-50 animate-bounce" />
        </div>

        <div className={`relative max-w-6xl mx-auto px-6 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Status Badge with Pulse */}
          <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 px-6 py-3 rounded-full mb-8 group hover:scale-105 transition-all duration-300 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AI Neural Network: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Online</span>
            </span>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Real-time processing</span>
          </div>

          {/* Ultra-Premium Hero Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
            <span 
              className="block text-gradient-ultra"
              style={{
                transform: `translateX(${mousePosition.x * 0.02}px)`,
              }}
            >
              Beyond
            </span>
            <span 
              className="block text-slate-900 dark:text-slate-100"
              style={{
                transform: `translateX(${-mousePosition.x * 0.02}px)`,
              }}
            >
              Intelligence
            </span>
          </h1>

          {/* Cinematic Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the future of AI conversation with our revolutionary neural architecture. 
            <br className="hidden md:block" />
            <span className="text-gradient-primary font-medium">Infinite possibilities, instant responses.</span>
          </p>

          {/* Ultra-Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/chat" className="group">
              <button className="btn-ultra-primary px-8 py-4 text-base font-semibold shadow-lg glow-pulse group-hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-3">
                  Start Conversation
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
            
            <button className="btn-glass px-8 py-4 text-base font-medium tilt-hover group">
              <span className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Watch Live Demo
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Ultra-Premium Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-500 tilt-hover shadow-lg shadow-slate-900/5 dark:shadow-slate-900/10"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gradient-ultra mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Premium Features Section */}
      <section className="py-32 px-6 relative">
        {/* Section Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-slate-900/50" />
        
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 px-4 py-2 rounded-full mb-6 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/10">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Powered by Neural Architecture</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Why Choose <span className="text-gradient-ultra">AgentCraft</span>?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Built with cutting-edge AI technology to provide you with the most advanced conversation experience ever created.
            </p>
          </div>

          {/* Features Grid with 3D Effects */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-premium group cursor-pointer"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-gradient-primary transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Cinematic CTA Section */}
      <section className="py-32 px-6 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          <div 
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
          />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 p-16 rounded-4xl relative overflow-hidden group shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20" />
            </div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Ready to Experience
                <br />
                <span className="text-gradient-ultra">The Future?</span>
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of innovators who are already experiencing the power of next-generation AI conversations.
              </p>
              
              <Link to="/chat">
                <button className="btn-ultra-primary px-12 py-5 text-lg font-semibold shadow-lg glow-pulse hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Start Your Journey
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 