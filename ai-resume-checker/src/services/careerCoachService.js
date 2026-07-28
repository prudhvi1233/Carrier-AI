import api from './api';

export const careerCoachService = {
  // Send a message to the AI coach
  sendMessage: async (message) => {
    try {
      const response = await api.post(`/career-coach/chat`, { message });
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
      const response = await api.get(`/career-coach/history`);
      return response.data; // Array of ChatMessageBase
    } catch (error) {
      console.error('Failed to load chat history:', error);
      throw new Error('Could not load chat history.');
    }
  },

  // Clear chat history
  clearHistory: async () => {
    try {
      const response = await api.delete(`/career-coach/history`);
      return response.data;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw new Error('Could not clear chat history.');
    }
  }
};
