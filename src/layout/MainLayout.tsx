// Ultra-Premium MainLayout with cinematic effects and immersive design
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative">
      {/* Ultra-Premium Header with Cinematic Effects */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 transform ${
          isScrolled 
            ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 scale-[0.98] translate-y-2' 
            : 'bg-transparent scale-100 translate-y-0'
        }`}
      >
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
             style={{ width: `${scrollProgress * 100}%` }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Ultra-Premium Logo */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                {/* Main Logo Container */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-black text-xl">A</span>
                </div>
                
                {/* Animated Glow Ring */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-all duration-500 blur-md animate-pulse" />
                
                {/* Neural Network Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 shimmer" />
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full shadow-lg">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-black text-gradient-ultra group-hover:scale-105 transition-transform duration-300">
                  AgentCraft
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Neural AI Assistant
                </span>
              </div>
            </Link>

            {/* Ultra-Premium Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`relative px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isActivePage('/') 
                    ? 'text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isActivePage('/') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl animate-pulse" />
                )}
                <span className="relative z-10">Home</span>
              </Link>
              
              <Link
                to="/chat"
                className={`relative px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isActivePage('/chat') 
                    ? 'text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isActivePage('/chat') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl animate-pulse" />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Chat
                </span>
              </Link>
            </nav>

            {/* Ultra-Premium Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-14 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110 active:scale-95 tilt-hover group"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative w-6 h-6 transform transition-all duration-700">
                  {/* Sun Icon */}
                  <svg 
                    className={`absolute inset-0 w-6 h-6 text-amber-500 transform transition-all duration-700 ${
                      isDark ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  
                  {/* Moon Icon */}
                  <svg 
                    className={`absolute inset-0 w-6 h-6 text-indigo-400 transform transition-all duration-700 ${
                      isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>

                  {/* Stars Animation for Dark Mode */}
                  {isDark && (
                    <div className="absolute inset-0">
                      <div className="absolute top-1 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-75" />
                      <div className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Hover Ring */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-2xl transition-all duration-500 animate-pulse opacity-0 group-hover:opacity-100" />
              </button>

              {/* Mobile Menu Button */}
              <button className="md:hidden w-12 h-12 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Header Border Glow */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        )}
      </header>

      {/* Main Content with Page Transitions */}
      <main className="pt-16 relative">
        <div className="page-enter page-enter-active">
          <Outlet />
        </div>
      </main>

      {/* Ultra-Premium Footer */}
      <footer className="relative mt-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-slate-900/50" />
        
        <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Brand Section */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <div className="text-gradient-primary font-bold text-lg">AgentCraft</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    &copy; 2025 Built with ❤️ using React & TypeScript
                  </div>
                </div>
              </div>
              
              {/* Links Section */}
              <div className="flex justify-center md:justify-center">
                <div className="flex items-center space-x-8 text-sm text-slate-500 dark:text-slate-400">
                  <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 hover:underline">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 hover:underline">
                    Terms of Service
                  </a>
                  <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 hover:underline">
                    Support
                  </a>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex justify-end">
                <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">All systems operational</span>
                  </div>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">v2.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 btn-ultra-primary rounded-2xl shadow-lg z-40 transform hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      )}
    </div>
  );
}; 