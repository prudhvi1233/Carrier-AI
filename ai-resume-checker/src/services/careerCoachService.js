import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/career-coach';

// Utility to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const careerCoachService = {
  // Send a message to the AI coach
  sendMessage: async (message) => {
    try {
      const response = await axios.post(`${API_URL}/chat`, { message }, getAuthHeaders());
      return response.data; // { reply: string }
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to communicate with AI Career Coach. Please try again.');
    }
  },

  // Get previous chat history
  getHistory: async () => {
    try {
      const response = await axios.get(`${API_URL}/history`, getAuthHeaders());
      return response.data; // Array of ChatMessageBase
    } catch (error) {
      console.error('Failed to load chat history:', error);
      throw new Error('Could not load chat history.');
    }
  },

  // Clear chat history
  clearHistory: async () => {
    try {
      const response = await axios.delete(`${API_URL}/history`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw new Error('Could not clear chat history.');
    }
  }
};
