// Application configuration
export const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Analysis Configuration
  maxTextLength: 10000,
  minTextLength: 10,
  
  // UI Configuration
  animationDuration: 300,
  refreshInterval: 30000, // 30 seconds
  
  // Feature Flags
  features: {
    exportResults: true,
    shareResults: false,
    userAccounts: false,
    advancedAnalytics: true
  }
};

export default config;
