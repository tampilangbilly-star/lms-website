import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

// Set token on app start if exists
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadProfileImage: (formData) => api.post('/users/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

// Materi API
export const materiAPI = {
  getAll: () => api.get('/materi'),
  getMyMateri: () => api.get('/materi/my-materi'),
  getById: (id) => api.get(`/materi/${id}`),
  create: (formData) => api.post('/materi', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createYouTube: (data) => api.post('/materi/video/youtube', data),
  uploadVideo: (id, formData) => api.post(`/materi/${id}/video`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/materi/${id}`, data),
  delete: (id) => api.delete(`/materi/${id}`),
};

// Tugas API
export const tugasAPI = {
  getAll: () => api.get('/tugas'),
  getById: (id) => api.get(`/tugas/${id}`),
  submit: (formData) => api.post('/tugas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/tugas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grade: (id, gradeData) => api.put(`/tugas/${id}/grade`, gradeData),
  delete: (id) => api.delete(`/tugas/${id}`),
  getPending: () => api.get('/tugas/pending/list'),
  getGraded: () => api.get('/tugas/graded/list'),
};

// Kritik Saran API
export const kritikSaranAPI = {
  getAll: () => api.get('/kritik-saran'),
  getById: (id) => api.get(`/kritik-saran/${id}`),
  submit: (data) => api.post('/kritik-saran', data),
  update: (id, data) => api.put(`/kritik-saran/${id}`, data),
  respond: (id, response) => api.put(`/kritik-saran/${id}/respond`, response),
  delete: (id) => api.delete(`/kritik-saran/${id}`),
  getOpen: () => api.get('/kritik-saran/status/open'),
  getClosed: () => api.get('/kritik-saran/status/closed'),
};

export default api;