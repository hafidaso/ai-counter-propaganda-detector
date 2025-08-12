// app configuration
export const config = {
    // API config
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    
    // analysis settings
    maxTextLength: 10000,
    minTextLength: 10,
    
    // UI settings
    refreshInterval: 30000, // 30 seconds
    animationDuration: 300,
    
    // feature flags
    enableLLM: true,
    enableFallback: true,
    enableRealTime: true
};
