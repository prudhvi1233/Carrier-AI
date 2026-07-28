import api from './api';

export const builderService = {
  initResume: async () => {
    const response = await api.get(`/resume-builder/init`);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get(`/resume-builder/history`);
    return response.data;
  },

  saveDraft: async (draftData) => {
    const response = await api.post(`/resume-builder/save`, draftData);
    return response.data;
  },

  improveTextWithAI: async (text, instruction) => {
    const response = await api.post(`/resume-builder/ai/improve`, { text, instruction });
    return response.data.improved_text;
  },

  exportPdf: async (resumeData) => {
    const response = await api.post(`/resume-builder/export/pdf`, resumeData, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportDocx: async (resumeData) => {
    const response = await api.post(`/resume-builder/export/docx`, resumeData, {
      responseType: 'blob'
    });
    return response.data;
  }
};
