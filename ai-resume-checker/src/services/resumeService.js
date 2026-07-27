import api from './api';

export const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Using the Phase 3 resume upload endpoint
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  parseResume: async (id) => {
    const response = await api.post(`/resume/${id}/parse`);
    return response.data;
  },

  getParsedResume: async (id) => {
    const response = await api.get(`/resume/${id}/parsed`);
    return response.data;
  },

  getResumeHistory: async () => {
    const response = await api.get('/resume/');
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  }
};
