import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('expense_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (payload) => api.put('/auth/profile', payload);
export const changePassword = (payload) => api.put('/auth/change-password', payload);
export const fetchExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (payload) => api.post('/expenses', payload);
export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const fetchSummary = () => api.get('/analytics/summary');
export const fetchMonthly = () => api.get('/analytics/monthly');
export const fetchCategories = () => api.get('/analytics/categories');
