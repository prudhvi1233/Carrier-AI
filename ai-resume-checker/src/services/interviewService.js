import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const interviewService = {
  startInterview: async (jobRole, interviewType, difficulty) => {
    const response = await axios.post(`${API_URL}/interview/start`, {
      job_role: jobRole,
      interview_type: interviewType,
      difficulty: difficulty
    }, getAuthHeaders());
    return response.data;
  },

  submitAnswer: async (sessionId, questionIndex, answer) => {
    const response = await axios.post(`${API_URL}/interview/${sessionId}/answer`, {
      question_index: questionIndex,
      answer: answer
    }, getAuthHeaders());
    return response.data;
  },

  completeInterview: async (sessionId) => {
    const response = await axios.post(`${API_URL}/interview/${sessionId}/complete`, {}, getAuthHeaders());
    return response.data;
  },

  getHistory: async () => {
    const response = await axios.get(`${API_URL}/interview/history`, getAuthHeaders());
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await axios.get(`${API_URL}/interview/${sessionId}`, getAuthHeaders());
    return response.data;
  }
};
