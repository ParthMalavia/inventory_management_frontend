import axios from 'axios';

// Update with your FastAPI backend URL
// const API_BASE_URL = 'https://inventory-management-backend-1-61pk.onrender.com'; 
const API_BASE_URL = 'http://127.0.0.1:8000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Authentication APIs
export const login = (username, password) =>
  api.post('/auth/login', { username, password }); // , grant_type: 'password'
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');

// Category APIs
export const getCategories = (skip = 0, limit = 100) => api.get(`/categories/?skip=${skip}&limit=${limit}`);
export const createCategory = (data) => api.post('/categories/', data);
export const getCategory = (id) => api.get(`/categories/${id}`);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Inventory APIs
export const getInventory = (skip = 0, limit = 100) => api.get(`/inventory/?skip=${skip}&limit=${limit}`);
export const createInventory = (data) => api.post('/inventory/', data);
export const getInventoryItem = (partNumber) => api.get(`/inventory/${partNumber}`);
export const updateInventory = (partNumber, data) => api.put(`/inventory/${partNumber}`, data);
export const deleteInventory = (partNumber) => api.delete(`/inventory/${partNumber}`);
export const updateInventoryQuantity = (partNumber, data) => api.patch(`/inventory/${partNumber}/quantity`, data);
export const getLowStock = () => api.get('/inventory/low-stock/');

// User APIs
export const getAllUsers = () => api.get('/users/users');
export const registerUser = (data) => api.post('/auth/register', data);
export const updateUser = (userId, data) => api.put(`/users/users/${userId}`, data);
export const deleteUser = (userId) => api.delete(`/users/users/${userId}`);


// Supplier APIs
export const getSuppliers = () => api.get('/suppliers');
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (supplierId, data) => api.put(`/suppliers/${supplierId}`, data);
export const deleteSupplier = (supplierId) => api.delete(`/suppliers/${supplierId}`);

// Customer APIs
export const getCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (customerId, data) => api.put(`/customers/${customerId}`, data);
export const deleteCustomer = (customerId) => api.delete(`/customers/${customerId}`);

export default api;
