import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// axios instance with some sensible defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // bumped up to 60 seconds for complex LLM analysis
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor - useful for debugging
api.interceptors.request.use(
    (config) => {
        console.log('sending request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('request error:', error);
        return Promise.reject(error);
    }
);

// response interceptor - catch errors and log them
api.interceptors.response.use(
    (response) => {
        console.log('got response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// health check endpoint
export const checkHealth = async () => {
    try {
        const response = await api.get('/api/health');
        return response.data;
    } catch (error) {
        throw new Error('backend is not responding');
    }
};

// analyze text endpoint
export const analyzeText = async (text, options = {}) => {
    try {
        const response = await api.post('/api/analyze', {
            text,
            ...options
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'analysis failed');
    }
};

// compare multiple texts endpoint
export const compareTexts = async (texts, options = {}) => {
    try {
        const response = await api.post('/api/compare', {
            texts,
            ...options
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'comparison failed');
    }
};

// get LLM health status
export const getLLMHealth = async () => {
    try {
        const response = await api.get('/api/llm/health');
        return response.data;
    } catch (error) {
        throw new Error('could not check LLM status');
    }
};

// get available models
export const getModelsStatus = async () => {
    try {
        const response = await api.get('/api/models/status');
        return response.data;
    } catch (error) {
        throw new Error('could not get models status');
    }
};
