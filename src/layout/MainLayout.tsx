import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Chat', href: '/chat', current: location.pathname === '/chat' },
    { name: 'Features', href: '#features', current: false },
    { name: 'Pricing', href: '#pricing', current: false },
    { name: 'Docs', href: '#docs', current: false },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container-nav py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-accent-500/25 transition-all duration-300">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="absolute inset-0 h-10 w-10 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 opacity-0 blur-lg group-hover:opacity-50 transition-all duration-300" />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-accent-400 transition-colors duration-300">
                AgentCraft
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 hover:text-accent-400 ${
                    item.current
                      ? 'text-accent-400'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth & CTA Buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="hidden sm:flex items-center gap-3">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff`}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user?.name}</span>
                      <span className="text-xs text-white/60">{user?.role}</span>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => logout()}
                    disabled={isLoading}
                    className="hidden sm:inline-flex text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex text-sm font-medium text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
              
              {/* Chat Button */}
              <Link to="/chat">
                <button className="btn-primary text-sm px-6 py-3 min-h-[44px]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {isAuthenticated ? 'Chat' : 'Try Now'}
                </button>
              </Link>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container-content py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">AgentCraft</span>
              </div>
              
              <p className="text-white/60 leading-relaxed max-w-sm">
                The next generation of AI conversation. Built for creators, developers, and innovators.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {['twitter', 'github', 'discord', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-3 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Product</h3>
                <ul className="space-y-3">
                  {['Features', 'Pricing', 'Enterprise', 'API Docs', 'Integrations'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Company</h3>
                <ul className="space-y-3">
                  {['About', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Support</h3>
                <ul className="space-y-3">
                  {['Help Center', 'Contact', 'Status', 'Security', 'Privacy'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <div className="flex items-center gap-6 text-sm text-white/60">
              <span>© 2024 AgentCraft. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Cookies</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-white/60">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 