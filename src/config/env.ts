import { z } from 'zod';

// Production API URL - use relative path for rewrite proxy
const PROD_API_URL = '/api';

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
  // If VITE_API_URL is not set, use the appropriate default based on mode
  apiUrl: env.VITE_API_URL || (env.MODE === 'production' ? PROD_API_URL : DEV_API_URL),
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
    mode: env.MODE,
  });
} 