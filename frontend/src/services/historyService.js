import api from './api';

export const historyService = {
  /**
   * Fetch all interview history for the authenticated user from Spring Boot backend
   */
  async getUserHistory() {
    const response = await api.get('/api/interviews');
    return { data: response.data || [], source: 'backend' };
  },

  /**
   * Fetch high-level performance summary metrics directly from Spring Boot backend
   */
  async getPerformanceSummary() {
    const response = await api.get('/api/performance/summary');
    return { ...response.data, source: 'backend' };
  },

  /**
   * Fetch in-depth analytics directly from Spring Boot backend
   */
  async getPerformanceAnalytics() {
    const response = await api.get('/api/performance/analytics');
    return { ...response.data, source: 'backend' };
  },

  /**
   * Delete single interview history entry directly from Spring Boot backend
   */
  async deleteHistoryItem(interviewId) {
    await api.delete(`/api/interviews/${interviewId}`);
    return { success: true };
  }
};

export default historyService;
