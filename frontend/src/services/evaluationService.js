import api from './api';

export const evaluationService = {
  /**
   * Fetch complete evaluation results for a finished interview directly from Spring Boot backend
   */
  async getInterviewResults(interviewId) {
    const response = await api.get(`/api/interviews/${interviewId}/results`);
    return response.data;
  }
};

export default evaluationService;
