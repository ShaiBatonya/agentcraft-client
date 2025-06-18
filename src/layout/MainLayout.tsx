import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-muted-900 bg-black/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-purple-600 text-white font-bold text-sm">
                A
              </div>
              <span className="text-title-3 font-bold text-white">
                AgentCraft
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-body-2 font-medium transition-all duration-200 ${
                  isActivePage('/') 
                    ? 'bg-muted-900 text-white' 
                    : 'text-muted-400 hover:text-white hover:bg-muted-950'
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/chat"
                className={`px-4 py-2 rounded-lg text-body-2 font-medium transition-all duration-200 ${
                  isActivePage('/chat') 
                    ? 'bg-muted-900 text-white' 
                    : 'text-muted-400 hover:text-white hover:bg-muted-950'
                }`}
              >
                Chat
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Link to="/chat">
                <button className="btn-primary">
                  Get Started
                </button>
              </Link>
              
              {/* Mobile Menu Button */}
              <button className="md:hidden rounded-lg p-2 text-muted-400 hover:bg-muted-950 hover:text-white focus-ring">
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
      <footer className="border-t border-muted-900 bg-muted-950/50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-purple-600 text-white font-bold text-sm">
                  A
                </div>
                <span className="text-title-3 font-bold text-white">
                  AgentCraft
                </span>
              </div>
              <p className="text-body-2 text-muted-400 max-w-md">
                Experience the future of AI conversation with our revolutionary neural architecture. 
                Built for innovators, creators, and forward-thinkers.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-muted-400 hover:text-accent-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-400 hover:text-accent-500 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 text-body-1 font-semibold text-white">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-body-1 font-semibold text-white">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-body-2 text-muted-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-muted-900 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-caption-1 text-muted-500">
                © 2025 AgentCraft. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-caption-1">
                <a href="#" className="text-muted-500 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-500 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 