import api from './api';

export const analysisService = {
  /**
   * Analyze a parsed resume using AI
   * @param {string} resumeId 
   * @param {boolean} force - Force re-analysis even if already exists
   */
  analyzeResume: async (resumeId, force = false) => {
    const response = await api.post(`/analysis/${resumeId}?force=${force}`);
    return response.data;
  },

  /**
   * Get all past analyses for the user
   */
  getAnalysisHistory: async () => {
    const response = await api.get('/analysis/history');
    return response.data;
  },

  /**
   * Get a specific analysis by its ID or Resume ID
   * @param {string} id - Analysis ID or Resume ID
   */
  getAnalysis: async (id) => {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  }
};
