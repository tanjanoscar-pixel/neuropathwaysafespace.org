import axios from 'axios';
import { getToken, logout } from './auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const contactAPI = {
  submit: (data) => apiClient.post('/contact', data),
};

export const questionnaireAPI = {
  submit: (data) => apiClient.post('/questionnaires/submit', data),
  getHistory: () => apiClient.get('/questionnaires/history'),
};

export const evidenceAPI = {
  add: (data) => apiClient.post('/evidence/add', data),
  list: (userId) => apiClient.get(`/evidence/list/${userId}`),
};

export const ehcpAPI = {
  generate: (userId) => apiClient.post(`/ehcp/generate/${userId}`),
};

export const supportAPI = {
  emotional: (data) => apiClient.post('/support/emotional', data),
};

export const analyticsAPI = {
  patterns: (userId) => apiClient.get(`/analytics/patterns/${userId}`),
};
