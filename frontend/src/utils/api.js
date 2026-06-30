import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitacure_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product API calls
export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data.data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
};

export const getProductsByTag = async (tag) => {
  const { data } = await api.get(`/products/tag/${tag}`);
  return data.data;
};

// Order API calls
export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const getOrder = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.data;
};

// Auth API calls
export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  if (data.token) {
    localStorage.setItem('vitacure_token', data.token);
    localStorage.setItem('vitacure_user', JSON.stringify(data.user));
  }
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data.data;
};

export const logout = () => {
  localStorage.removeItem('vitacure_token');
  localStorage.removeItem('vitacure_user');
};

export default api;
