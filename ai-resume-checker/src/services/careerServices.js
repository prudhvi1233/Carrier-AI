import api from './api';

export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
  getInsights: async () => {
    const response = await api.get('/analytics/insights');
    return response.data;
  }
};

export const goalService = {
  getGoalsAndTasks: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  createGoal: async (goalData) => {
    const response = await api.post('/goals/goals', goalData);
    return response.data;
  },
  incrementGoal: async (id) => {
    const response = await api.put(`/goals/goals/${id}/increment`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post('/goals/tasks', taskData);
    return response.data;
  },
  toggleTask: async (id) => {
    const response = await api.put(`/goals/tasks/${id}/toggle`);
    return response.data;
  }
};

export const activityService = {
  getTimeline: async () => {
    const response = await api.get('/activity');
    return response.data;
  }
};

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  }
};

export const searchService = {
  search: async (q) => {
    const response = await api.get(`/search?q=${q}`);
    return response.data;
  }
};

export const jobMatchService = {
  analyzeMatch: async (jobData) => {
    const response = await api.post('/job-match/analyze', jobData);
    return response.data;
  }
};
