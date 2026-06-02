/**
 * API Configuration based on environment
 */

export const getApiBaseUrl = (): string => {
  const env = import.meta.env.MODE;

  // In test mode, use local API
  if (env === 'test') {
    return 'http://localhost:8000';
  }

  // In production, use env variable or fallback
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Default fallback for production
  return 'http://localhost:8000';
};

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000,
};
