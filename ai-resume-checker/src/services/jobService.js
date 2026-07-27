import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Utility to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const jobRecommendationService = {
  getRecommendations: async () => {
    const response = await axios.get(`${API_URL}/job-recommendations/`, getAuthHeaders());
    return response.data;
  },

  generateRecommendations: async () => {
    const response = await axios.post(`${API_URL}/job-recommendations/generate`, {}, getAuthHeaders());
    return response.data;
  },

  deleteRecommendations: async () => {
    const response = await axios.delete(`${API_URL}/job-recommendations/`, getAuthHeaders());
    return response.data;
  }
};

export const jobTrackerService = {
  getSavedJobs: async () => {
    const response = await axios.get(`${API_URL}/job-tracker/`, getAuthHeaders());
    return response.data;
  },

  addSavedJob: async (jobData) => {
    const response = await axios.post(`${API_URL}/job-tracker/`, jobData, getAuthHeaders());
    return response.data;
  },

  updateSavedJob: async (jobId, jobData) => {
    const response = await axios.put(`${API_URL}/job-tracker/${jobId}`, jobData, getAuthHeaders());
    return response.data;
  },

  deleteSavedJob: async (jobId) => {
    const response = await axios.delete(`${API_URL}/job-tracker/${jobId}`, getAuthHeaders());
    return response.data;
  }
};
