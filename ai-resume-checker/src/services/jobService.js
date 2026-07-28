import api from './api';

export const jobRecommendationService = {
  getRecommendations: async () => {
    const response = await api.get(`/job-recommendations/`);
    return response.data;
  },

  generateRecommendations: async () => {
    const response = await api.post(`/job-recommendations/generate`);
    return response.data;
  },

  deleteRecommendations: async () => {
    const response = await api.delete(`/job-recommendations/`);
    return response.data;
  }
};

export const jobTrackerService = {
  getSavedJobs: async () => {
    const response = await api.get(`/job-tracker/`);
    return response.data;
  },

  addSavedJob: async (jobData) => {
    const response = await api.post(`/job-tracker/`, jobData);
    return response.data;
  },

  updateSavedJob: async (jobId, jobData) => {
    const response = await api.put(`/job-tracker/${jobId}`, jobData);
    return response.data;
  },

  deleteSavedJob: async (jobId) => {
    const response = await api.delete(`/job-tracker/${jobId}`);
    return response.data;
  }
};
