import { z } from 'zod';

// Development API URL
const DEV_API_URL = 'http://localhost:5000/api';

// Environment schema
const envSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().default('AgentCraft'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse environment variables
const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  MODE: import.meta.env.MODE,
});

// Export validated environment
export const config = {
  // IMPORTANT: Render static sites don't support proxying to external services
  // So in production, we must use the direct backend URL for all API calls
  apiUrl: env.VITE_API_URL || (env.MODE === 'production' 
    ? 'https://agentcraft-backend-1.onrender.com/api' 
    : DEV_API_URL),
  // Backend URL for direct calls (OAuth, etc.)
  backendUrl: env.MODE === 'production' 
    ? 'https://agentcraft-backend-1.onrender.com' 
    : `http://localhost:5000`,
  appName: env.VITE_APP_NAME,
  appVersion: env.VITE_APP_VERSION,
  isDevelopment: env.MODE === 'development',
  isProduction: env.MODE === 'production',
  isTest: env.MODE === 'test',
} as const;

// Log environment in development
if (env.MODE === 'development') {
  console.log('📦 Environment:', {
    apiUrl: config.apiUrl,
    backendUrl: config.backendUrl,
    mode: env.MODE,
  });
}

// Production note: Direct backend URL used since Render static sites don't support proxying
if (env.MODE === 'production') {
  console.log('🌐 Production API calls will go directly to:', config.apiUrl);
} 