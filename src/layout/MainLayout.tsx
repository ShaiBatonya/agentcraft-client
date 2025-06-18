import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-700 dark:bg-neutral-900/80">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 text-white font-bold text-sm">
                A
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                AgentCraft
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePage('/') 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/chat"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePage('/chat') 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Chat
              </Link>
            </nav>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <button className="md:hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
        <div className="container mx-auto py-12">
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-primary-600 to-violet-600 text-white font-bold text-xs">
                  A
                </div>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  AgentCraft
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Experience the future of AI conversation with our advanced neural architecture.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
                Product
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    API
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
                Support
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-700">
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              © 2025 AgentCraft. Built with React & TypeScript.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 