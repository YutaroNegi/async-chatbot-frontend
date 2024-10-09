import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const login = async (email: string, password: string) => {
  try {
    await api.post('/users/login', { email, password });
  } catch (error) {
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    await api.post('/users/register', { email, password });
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/users/logout');
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
