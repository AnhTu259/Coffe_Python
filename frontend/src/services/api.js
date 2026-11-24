import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').trim();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach user token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = async (url, params) => {
  const response = await api.get(url, { params });
  return response.data;
};

export const post = async (url, data) => {
  const response = await api.post(url, data);
  return response.data;
};

export const put = async (url, data) => {
  const response = await api.put(url, data);
  return response.data;
};

export const del = async (url) => {
  const response = await api.delete(url);
  return response.data;
};

// ==================== AUTH ====================

export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data; // { access_token, token_type }
};

export const register = async (username, password) => {
  const res = await api.post('/auth/register', { username, password });
  return res.data; // user object
};

// ==================== PRODUCTS API ====================

// Lấy danh sách tất cả sản phẩm
export const getProducts = async (category = null, inStock = null) => {
  const params = {};
  if (category) params.category = category;
  if (inStock !== null) params.in_stock = inStock;
  const response = await api.get('/api/products', { params });
  return response.data;
};

// Lấy một sản phẩm theo ID
export const getProduct = async (productId) => {
  const response = await api.get(`/api/products/${productId}`);
  return response.data;
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (category) => {
  const response = await api.get(`/api/products/category/${category}`);
  return response.data;
};

// Tạo sản phẩm mới (admin)
export const createProduct = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

// Cập nhật sản phẩm (admin)
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/admin/products/${productId}`, productData);
  return response.data;
};

// Xóa sản phẩm (admin)
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

// ==================== ORDERS API ====================

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', orderData);
  return response.data;
};

// Lấy danh sách đơn hàng (admin)
export const getOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

// Lấy một đơn hàng theo ID
export const getOrder = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

// ==================== INVENTORY API ====================

export const getInventoryMovements = async () => {
  const response = await api.get('/admin/inventory/movements');
  return response.data;
};

export const importInventory = async ({ product_id, quantity, note }) => {
  const response = await api.post('/admin/inventory/import', { product_id, quantity, note });
  return response.data;
};

export const exportInventory = async ({ product_id, quantity, note }) => {
  const response = await api.post('/admin/inventory/export', { product_id, quantity, note });
  return response.data;
};

export const getInventorySummary = async () => {
  const response = await api.get('/admin/inventory/summary');
  return response.data;
};

