import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const builderService = {
  initResume: async () => {
    const response = await axios.get(`${API_URL}/resume-builder/init`, getAuthHeaders());
    return response.data;
  },

  getHistory: async () => {
    const response = await axios.get(`${API_URL}/resume-builder/history`, getAuthHeaders());
    return response.data;
  },

  saveDraft: async (draftData) => {
    const response = await axios.post(`${API_URL}/resume-builder/save`, draftData, getAuthHeaders());
    return response.data;
  },

  improveTextWithAI: async (text, instruction) => {
    const response = await axios.post(`${API_URL}/resume-builder/ai/improve`, { text, instruction }, getAuthHeaders());
    return response.data.improved_text;
  },

  exportPdf: async (resumeData) => {
    const response = await axios.post(`${API_URL}/resume-builder/export/pdf`, resumeData, {
      ...getAuthHeaders(),
      responseType: 'blob'
    });
    return response.data;
  },

  exportDocx: async (resumeData) => {
    const response = await axios.post(`${API_URL}/resume-builder/export/docx`, resumeData, {
      ...getAuthHeaders(),
      responseType: 'blob'
    });
    return response.data;
  }
};
