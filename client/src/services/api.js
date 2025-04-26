import axios from 'axios';

// Use 127.0.0.1 instead of localhost to ensure consistency
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

// Create axios instance with timeout
const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers
        });
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
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            response: error.response?.data
        });

        if (error.code === 'ECONNABORTED') {
            throw new Error('Connection timeout. Please check if the server is running.');
        }

        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                throw new Error('Session expired. Please log in again.');
            }
            throw error;
        }

        if (!error.response) {
            throw new Error('Unable to connect to server. Please check your connection.');
        }

        throw error;
    }
);

// Auth service
export const auth = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    verifyToken: () => api.get('/api/auth/me'),
    getUser: () => api.get('/api/auth/me'),
};

// Upload service
export const upload = {
    uploadFile: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/api/upload/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    listFiles: () => api.get('/api/upload/list'),
    deleteFile: (filename) => api.delete(`/api/upload/${filename}`),
};

// Prediction service
export const predict = {
    getModelInfo: () => api.get('/api/predict/model-info'),
    makePrediction: (data) => api.post('/api/predict/predict', data),
    makeBatchPrediction: (data) => api.post('/api/predict/batch-predict', data),
};

// Data service
export const data = {
    getStats: () => api.get('/api/data/stats'),
    getChartData: (chartType) => api.get(`/api/data/chart/${chartType}`),
};

// Chat service
export const chat = {
    sendMessage: (message) => api.post('/api/chat/message', { message }),
    getHistory: () => api.get('/api/chat/history'),
};

// Report service
export const report = {
    generateReport: (data) => api.post('/api/report/generate', data),
    getReport: (reportId) => api.get(`/api/report/${reportId}`),
};

export default api; 