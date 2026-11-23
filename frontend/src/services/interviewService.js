import api from './api';

export const interviewService = {
  /**
   * Create new interview session directly on Spring Boot backend
   */
  async createInterview({ technology, difficulty, interviewType, numberOfQuestions = 5 }) {
    const response = await api.post('/api/interviews', {
      technology,
      difficulty,
      interviewType,
      numberOfQuestions
    });
    return response.data;
  },

  /**
   * Fetch single interview session by ID directly from Spring Boot backend
   */
  async getInterviewById(interviewId) {
    const response = await api.get(`/api/interviews/${interviewId}`);
    return response.data;
  },

  /**
   * Submit an answer for a specific question directly to Spring Boot backend
   */
  async submitAnswer(interviewId, questionId, studentAnswer) {
    const response = await api.post(`/api/interviews/${interviewId}/submit`, {
      questionId,
      studentAnswer
    });
    return response.data;
  },

  /**
   * Complete interview and trigger evaluation on Spring Boot backend
   */
  async completeInterview(interviewId) {
    const response = await api.post(`/api/interviews/${interviewId}/complete`);
    return response.data;
  },

  /**
   * Delete an interview from history directly on Spring Boot backend
   */
  async deleteInterview(interviewId) {
    const response = await api.delete(`/api/interviews/${interviewId}`);
    return response.data;
  }
};

export default interviewService;
