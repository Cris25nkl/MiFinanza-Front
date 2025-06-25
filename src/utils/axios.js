import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createTransaction = async (transaction, token) => {
  return axios.post(`${API_URL}/transactions`, transaction, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getTransactions = async (token) => {
  return axios.get(`${API_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};