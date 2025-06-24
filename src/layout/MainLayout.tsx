import { useAuthStore } from '@/stores/auth.store';
import { useAuthToasts } from '@/stores/toast.store';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logoutAndRedirect } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showLogoutSuccess } = useAuthToasts();

  const handleLogout = useCallback(async () => {
    await logoutAndRedirect();
    showLogoutSuccess();
  }, [logoutAndRedirect, showLogoutSuccess]);

  // Enhanced navigation with better organization
  const navigation = useMemo(() => [
    {
      name: 'Home',
      href: '/',
      current: location.pathname === '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Chat',
      href: '/chat',
      current: location.pathname === '/chat',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
  ], [location.pathname]);

  const secondaryNavigation = useMemo(() => [
    {
      name: 'Profile',
      href: '/profile',
      current: location.pathname === '/profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      authRequired: true
    },
    {
      name: 'Settings',
      href: '/settings',
      current: location.pathname === '/settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Support',
      href: '/support',
      current: location.pathname === '/support',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ], [location.pathname]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Enhanced user avatar with fallback
  const userAvatarUrl = useMemo(() =>
    user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=40`,
    [user?.avatar, user?.name]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Enhanced Glass Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-strong safe-top">
        <div className="container-nav py-3 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-4">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={closeMobileMenu}>
              <div className="relative">
                {/* Logo Icon with enhanced glow */}
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-300 hover-lift">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                {/* Animated glow effect */}
                <div className="absolute inset-0 h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-0 blur-lg group-hover:opacity-50 transition-all duration-300" />
              </div>

              {/* Brand Name */}
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                  AgentCraft
                </span>
                <div className="text-xs text-white/50 font-medium">Neural AI Platform</div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              {/* Primary Navigation */}
              <div className="flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link group relative ${item.current
                      ? 'nav-link-active bg-white/10 text-white'
                      : 'text-white/70 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`transition-colors duration-200 ${item.current ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>

                    {/* Active indicator */}
                    {item.current && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Elegant Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Secondary Navigation */}
              <div className="flex items-center gap-1">
                {secondaryNavigation.map((item) => {
                  if (item.authRequired && !isAuthenticated) return null;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`nav-link group ${item.current
                        ? 'nav-link-active bg-white/10 text-white'
                        : 'text-white/70 hover:text-white'
                        }`}
                    >
                      <span className={`transition-colors duration-200 ${item.current ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Auth & CTA Section */}
            <div className="flex items-center gap-3 shrink-0">
              {isAuthenticated ? (
                <>
                  {/* Enhanced User Profile - Desktop */}
                  <div className="hidden xl:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <img
                      src={userAvatarUrl}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full border border-white/20 shadow-sm"
                      loading="lazy"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-white truncate max-w-24">{user?.name}</span>
                      <span className="text-xs text-white/60 truncate max-w-24">{user?.email?.split('@')[0]}</span>
                    </div>
                  </div>

                  {/* Enhanced Logout Button - Desktop */}
                  <button
                    onClick={handleLogout}
                    className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                    title="Sign out"
                  >
                    <svg className="w-4 h-4 group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden xl:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Enhanced Sign In Button */}
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Link>
                </>
              )}

              {/* Enhanced Chat CTA Button */}
              <Link to="/chat" onClick={closeMobileMenu}>
                <button className="btn-primary text-sm px-4 sm:px-5 py-2.5 min-h-[40px] group whitespace-nowrap">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">{isAuthenticated ? 'Chat' : 'Try AI'}</span>
                </button>
              </Link>

              {/* Enhanced Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 touch-manipulation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </nav>

          {/* Enhanced Mobile Menu with Fixed Background */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={closeMobileMenu}
              />

              {/* Mobile menu content */}
              <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 relative z-50 bg-slate-950/95 backdrop-blur-xl rounded-xl mx-4 shadow-2xl animate-fade-in-down">
                <div className="space-y-2 px-4">
                  {/* Primary Navigation */}
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`sidebar-item ${item.current
                        ? 'sidebar-item-active'
                        : ''
                        }`}
                    >
                      <span className={`${item.current ? 'text-indigo-400' : ''}`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {/* Divider */}
                  <div className="h-px bg-white/10 my-3" />

                  {/* Secondary Navigation */}
                  {secondaryNavigation.map((item) => {
                    if (item.authRequired && !isAuthenticated) return null;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={`sidebar-item ${item.current
                          ? 'sidebar-item-active'
                          : ''
                          }`}
                      >
                        <span className={`${item.current ? 'text-indigo-400' : ''}`}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  {isAuthenticated ? (
                    <>
                      <div className="h-px bg-white/10 my-3" />

                      {/* User Profile Card */}
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={userAvatarUrl}
                            alt={user?.name}
                            className="h-10 w-10 rounded-full border border-white/20"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                            <div className="text-xs text-white/60 truncate">{user?.email}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                        >
                          <svg className="w-4 h-4 group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-px bg-white/10 my-3" />
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="sidebar-item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content with enhanced spacing */}
      <main className="w-full">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="w-full border-t border-white/10 glass-light">
        <div className="container-content py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Enhanced Brand Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">AgentCraft</span>
                  <div className="text-xs text-white/60">Neural AI Platform</div>
                </div>
              </div>

              <p className="text-white/70 leading-relaxed max-w-sm">
                The next generation of AI conversation platforms. Built for creators, developers, and innovators who demand excellence.
              </p>

              {/* Enhanced Social Links */}
              <div className="flex items-center gap-3">
                {[
                  { name: 'Twitter', href: '#', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                  { name: 'GitHub', href: '#', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                  { name: 'Discord', href: '#', icon: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z' },
                  { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 hover-lift"
                    aria-label={social.name}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Links Columns */}
            <div className="lg:col-span-3 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Product</h3>
                <ul className="space-y-3">
                  {['Features', 'Pricing', 'Enterprise', 'API Docs', 'Integrations', 'Changelog'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Company</h3>
                <ul className="space-y-3">
                  {['About', 'Blog', 'Careers', 'Press', 'Partners', 'Brand'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Support</h3>
                <ul className="space-y-3">
                  <li><Link to="/support" className="text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</Link></li>
                  {['Contact', 'Status', 'Security', 'Privacy', 'Terms'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <div className="flex items-center gap-6 text-sm text-white/60">
              <span>© 2025 AgentCraft by Shai Batonya. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Cookies</a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="status-online">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 