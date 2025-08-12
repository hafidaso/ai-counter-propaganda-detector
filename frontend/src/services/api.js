import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for complex LLM analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  // Analyze text
  async analyzeText(text, payload = {}) {
    try {
      const requestPayload = typeof text === 'string' ? { text, ...payload } : text;
      const response = await api.post('/api/analyze', requestPayload);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(`Analysis failed: ${error.message}`);
    }
  },

  // Compare multiple texts
  async compareTexts(payload) {
    try {
      const response = await api.post('/api/compare', payload);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(`Comparison failed: ${error.message}`);
    }
  },

  // Get LLM health status
  async getLLMHealth() {
    try {
      const response = await api.get('/api/llm/health');
      return response.data;
    } catch (error) {
      throw new Error(`LLM health check failed: ${error.message}`);
    }
  },

  // Get models status
  async getModelsStatus() {
    try {
      const response = await api.get('/api/models/status');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get models status: ${error.message}`);
    }
  }
};

export default api;
