/**
 * InterviewPrep AI - REST API Client
 * Connects the React Frontend to the Java Spring Boot Backend (Port 8080).
 * Features graceful fallbacks so the UI remains resilient during development.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API Client] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Performance
  getPerformance: () => request('/performance'),

  // Interviews
  createInterview: (config) =>
    request('/interviews', {
      method: 'POST',
      body: JSON.stringify(config),
    }),

  getInterview: (id) => request(`/interviews/${id}`),

  submitAnswer: (interviewId, questionId, answerText) =>
    request(`/interviews/${interviewId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ questionId, answerText }),
    }),

  completeInterview: (interviewId, timeElapsedSeconds) =>
    request(`/interviews/${interviewId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ timeElapsedSeconds }),
    }),

  getResults: (interviewId) => request(`/interviews/${interviewId}/results`),

  getHistory: (search, difficulty) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);
    const queryString = params.toString();
    return request(`/interviews/history${queryString ? `?${queryString}` : ''}`);
  },
};
