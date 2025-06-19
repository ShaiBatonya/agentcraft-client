import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logoutAndRedirect } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Chat', href: '/chat', current: location.pathname === '/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  const secondaryNavigation = [
    { name: 'Profile', href: '/profile', current: location.pathname === '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', authRequired: true },
    { name: 'Settings', href: '/settings', current: location.pathname === '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Support', href: '/support', current: location.pathname === '/support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const renderIcon = (pathData: string, className = "w-5 h-5") => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={pathData} />
    </svg>
  );

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container-nav py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
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
            <div className="hidden md:flex items-center gap-6">
              {/* Primary Navigation */}
              <div className="flex items-center gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-accent-400 ${
                      item.current
                        ? 'text-accent-400'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {renderIcon(item.icon, "w-4 h-4")}
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-white/20" />

              {/* Secondary Navigation */}
              <div className="flex items-center gap-4">
                {secondaryNavigation.map((item) => {
                  if (item.authRequired && !isAuthenticated) return null;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-accent-400 ${
                        item.current
                          ? 'text-accent-400'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {renderIcon(item.icon, "w-4 h-4")}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Auth & CTA Buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* User Info - Desktop */}
                  <div className="hidden lg:flex items-center gap-3">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff`}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full border border-white/20"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user?.name}</span>
                      <span className="text-xs text-white/60">{user?.email?.split('@')[0]}</span>
                    </div>
                  </div>
                  
                  {/* Logout Button - Desktop */}
                  <button
                    onClick={logoutAndRedirect}
                    className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    {renderIcon('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', "w-4 h-4")}
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    {renderIcon('M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', "w-4 h-4")}
                    Sign In
                  </Link>
                </>
              )}
              
              {/* Chat Button */}
              <Link to="/chat" onClick={closeMobileMenu}>
                <button className="btn-primary text-sm px-6 py-3 min-h-[44px] flex items-center gap-2">
                  {renderIcon('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', "w-4 h-4")}
                  {isAuthenticated ? 'Chat' : 'Try Now'}
                </button>
              </Link>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
              <div className="space-y-3">
                {/* Primary Navigation */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      item.current
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {renderIcon(item.icon, "w-5 h-5")}
                    {item.name}
                  </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-white/20 my-3" />

                {/* Secondary Navigation */}
                {secondaryNavigation.map((item) => {
                  if (item.authRequired && !isAuthenticated) return null;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        item.current
                          ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {renderIcon(item.icon, "w-5 h-5")}
                      {item.name}
                    </Link>
                  );
                })}

                {/* Auth Actions */}
                {isAuthenticated ? (
                  <>
                    <div className="h-px bg-white/20 my-3" />
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff`}
                          alt={user?.name}
                          className="h-10 w-10 rounded-full border border-white/20"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{user?.name}</div>
                          <div className="text-xs text-white/60">{user?.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logoutAndRedirect();
                          closeMobileMenu();
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                      >
                        {renderIcon('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', "w-5 h-5")}
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-white/20 my-3" />
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      {renderIcon('M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', "w-5 h-5")}
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
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
                  <li><Link to="/support" className="text-white/60 hover:text-white transition-colors duration-300">Help Center</Link></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Contact</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Status</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Security</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Privacy</a></li>
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