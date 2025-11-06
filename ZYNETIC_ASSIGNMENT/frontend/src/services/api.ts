import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, confirmPassword: string) =>
    api.post('/auth/register', { email, password, confirmPassword }),
};

export const products = {
  getAll: (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
  }) => api.get('/products', { params: filters }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: {
    name: string;
    description: string;
    category: string;
    price: number;
    rating: number;
  }) => api.post('/products', data),
  update: (id: string, data: Partial<{
    name: string;
    description: string;
    category: string;
    price: number;
    rating: number;
  }>) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export default api; 