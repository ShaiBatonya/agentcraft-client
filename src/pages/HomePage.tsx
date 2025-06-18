// Homepage component with hero section and call-to-action
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/ui';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AgentCraft
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of AI conversation with our intelligent chat assistant.
              Get instant responses, creative solutions, and helpful insights.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Intelligent AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Powered by advanced AI technology for natural conversations
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Fast Responses
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant replies with lightning-fast processing
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Creative Solutions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate creative ideas and solve complex problems
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 mt-12">
            <Link to="/chat">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Chatting Now
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No sign-up required • Free to use • Instant access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 