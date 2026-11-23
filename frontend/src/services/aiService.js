/**
 * AI Service for InterviewPrep AI
 * Backend-mediated AI service client.
 * Direct browser calls to third-party LLM endpoints are prohibited for credential security.
 */

import api from './api';

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

export const AI_MODES = {
  LIVE_AI: 'live_ai',
  DETERMINISTIC: 'deterministic'
};

export function getSelectedAIModel() {
  return localStorage.getItem('interviewprep_selected_model') || DEFAULT_GEMINI_MODEL;
}

export function setSelectedAIModel(modelName) {
  localStorage.setItem('interviewprep_selected_model', modelName);
}

export function getEvaluationMode() {
  return localStorage.getItem('interviewprep_eval_mode') || AI_MODES.LIVE_AI;
}

export function setEvaluationMode(mode) {
  localStorage.setItem('interviewprep_eval_mode', mode);
}

/**
 * Check backend and AI microservice health status via Spring Boot API
 */
export async function testGeminiConnection() {
  try {
    const response = await api.get('/api/health');
    if (response.data && response.data.status === 'UP') {
      return {
        success: true,
        model: getSelectedAIModel(),
        message: 'Connected to backend service. AI operations are processed securely via FastAPI microservice.'
      };
    }
    return {
      success: false,
      error: 'Backend health check returned non-OK status.'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Cannot connect to backend server. Make sure Spring Boot is running on port 8080.'
    };
  }
}
