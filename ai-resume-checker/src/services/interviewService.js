import api from './api';

export const interviewService = {
  startInterview: async (jobRole, interviewType, difficulty) => {
    const response = await api.post(`/interview/start`, {
      job_role: jobRole,
      interview_type: interviewType,
      difficulty: difficulty
    });
    return response.data;
  },

  submitAnswer: async (sessionId, questionIndex, answer) => {
    const response = await api.post(`/interview/${sessionId}/answer`, {
      question_index: questionIndex,
      answer: answer
    });
    return response.data;
  },

  completeInterview: async (sessionId) => {
    const response = await api.post(`/interview/${sessionId}/complete`, {});
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get(`/interview/history`);
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/interview/${sessionId}`);
    return response.data;
  }
};
