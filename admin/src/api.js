import axios from 'axios';

// Allow overriding the backend base URL via environment variables (useful for Docker)
const API_BASE_URL = (process.env.REACT_APP_ADMIN_API || 'http://localhost:5000').trim();

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const res = await adminApi.post('/auth/login', { username, password });
  return res.data;
};

// Products (admin)
export const listProducts = async () => (await adminApi.get('/api/products')).data;
export const createProduct = async (data) => (await adminApi.post('/admin/products', data)).data;
export const updateProduct = async (id, data) => (await adminApi.put(`/admin/products/${id}`, data)).data;
export const deleteProduct = async (id) => (await adminApi.delete(`/admin/products/${id}`)).data;

// Orders (admin)
export const listOrders = async () => (await adminApi.get('/admin/orders')).data;
export const updateOrder = async (id, data) => (await adminApi.put(`/admin/orders/${id}`, data)).data;

// Inventory (admin)
export const inventorySummary = async () => (await adminApi.get('/admin/inventory/summary')).data;
export const inventoryMovements = async () => (await adminApi.get('/admin/inventory/movements')).data;
export const inventoryImport = async (payload) => (await adminApi.post('/admin/inventory/import', payload)).data;
export const inventoryExport = async (payload) => (await adminApi.post('/admin/inventory/export', payload)).data;


