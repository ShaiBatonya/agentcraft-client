// Shared API utility - now uses centralized configuration
import { api as centralizedApi, apiService } from '@/services/api';

// Export the centralized API instance for backward compatibility
export const api = centralizedApi;

// Export the enhanced API service
export { apiService };

// Legacy support - export the axios instance as default export
export default centralizedApi; 