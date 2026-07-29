import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email, password, full_name, phone = null) => {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      full_name,
      phone
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, new_password) => {
    const response = await api.post('/auth/reset-password', { token, new_password });
    return response.data;
  }
};
