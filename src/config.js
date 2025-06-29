// Configuration for API endpoints
const config = {
  // Development environment (local)
  development: {
    apiUrl: 'http://localhost:5005/api/query'
  },
  // Production environment (ngrok)
  production: {
    apiUrl: 'https://7358-2401-4900-8fca-8451-2808-3868-77e4-817d.ngrok-free.app/api/query'
  }
};

// Use environment variable if available, otherwise use config based on environment
const envApiUrl = import.meta.env.VITE_API_URL;
const isDevelopment = import.meta.env.DEV;
const currentConfig = isDevelopment ? config.development : config.production;

export const API_URL = envApiUrl || currentConfig.apiUrl;
export default config; 