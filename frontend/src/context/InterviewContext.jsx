import React, { createContext, useContext, useState } from 'react';
import { mockQuestionsBank } from '../data/mockQuestions';
import { mockEvaluationResult } from '../data/mockEvaluation';
import { api } from '../services/api';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [config, setConfig] = useState({
    roleId: 'frontend-react',
    roleTitle: 'Software Developer',
    experienceLevel: 'Fresher',
    difficulty: 'medium',
    skills: ['Java', 'DSA', 'Spring Boot'],
    questionCount: 5
  });

  const [activeSession, setActiveSession] = useState({
    interviewId: null,
    isActive: false,
    questions: mockQuestionsBank,
    currentIndex: 0,
    answers: {},
    startedAt: null,
    timeElapsed: 0,
    isSubmitted: false
  });

  const [latestEvaluation, setLatestEvaluation] = useState(mockEvaluationResult);

  const startInterview = async (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    try {
      // Connect to Spring Boot backend API
      const created = await api.createInterview({
        roleTitle: updatedConfig.roleTitle,
        skills: updatedConfig.skills,
        experienceLevel: updatedConfig.experienceLevel,
        difficulty: updatedConfig.difficulty,
        questionCount: updatedConfig.questionCount || 5
      });

      setActiveSession({
        interviewId: created.id,
        isActive: true,
        questions: created.questions && created.questions.length > 0 ? created.questions : mockQuestionsBank.slice(0, updatedConfig.questionCount || 5),
        currentIndex: 0,
        answers: {},
        startedAt: new Date(),
        timeElapsed: 0,
        isSubmitted: false
      });
      return created;
    } catch (err) {
      console.warn('[InterviewContext] Backend interview creation failed, using client-side fallback:', err.message);
      
      const count = updatedConfig.questionCount || 5;
      const selectedQuestions = mockQuestionsBank.slice(0, count);

      setActiveSession({
        interviewId: 'local-session-' + Date.now(),
        isActive: true,
        questions: selectedQuestions,
        currentIndex: 0,
        answers: {},
        startedAt: new Date(),
        timeElapsed: 0,
        isSubmitted: false
      });
    }
  };

  const saveAnswer = (questionId, answerText) => {
    // 1. Optimistic UI update
    setActiveSession(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerText
      }
    }));

    // 2. Sync to Spring Boot Backend asynchronously
    if (activeSession.interviewId && !activeSession.interviewId.startsWith('local-')) {
      api.submitAnswer(activeSession.interviewId, questionId, answerText).catch(err => {
        console.warn('[InterviewContext] Failed to sync answer to backend:', err.message);
      });
    }
  };

  const nextQuestion = () => {
    setActiveSession(prev => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.questions.length - 1)
    }));
  };

  const prevQuestion = () => {
    setActiveSession(prev => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0)
    }));
  };

  const jumpToQuestion = (index) => {
    setActiveSession(prev => ({
      ...prev,
      currentIndex: index
    }));
  };

  const completeInterview = async () => {
    const interviewId = activeSession.interviewId;

    if (interviewId && !interviewId.startsWith('local-')) {
      try {
        const evaluationReport = await api.completeInterview(interviewId, activeSession.timeElapsed || 1200);
        setLatestEvaluation(evaluationReport);
        setActiveSession(prev => ({
          ...prev,
          isActive: false,
          isSubmitted: true
        }));
        return evaluationReport;
      } catch (err) {
        console.warn('[InterviewContext] Backend complete evaluation failed, using client fallback:', err.message);
      }
    }

    // Fallback evaluation generation
    const generatedEvaluation = {
      ...mockEvaluationResult,
      id: `eval-${Date.now()}`,
      roleTitle: config.roleTitle,
      difficulty: config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1),
      date: new Date().toISOString().split('T')[0],
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: Math.max(1, Math.round(activeSession.timeElapsed / 60) || 12),
      questionReviews: activeSession.questions.map((q, idx) => {
        const candidateAns = activeSession.answers[q.id] || "No written response submitted during practice session.";
        const wordCount = candidateAns.trim().split(/\s+/).filter(Boolean).length;
        const score = wordCount > 20 ? Math.min(95, 75 + Math.floor(wordCount / 2)) : 70;
        return {
          questionNumber: idx + 1,
          topic: q.topic,
          question: q.question,
          candidateAnswer: candidateAns,
          score: score,
          feedback: `Your response touched on key fundamentals. Make sure to clearly state real-world trade-offs and edge-case handling.`,
          keyPointsCovered: q.evaluationCriteria ? q.evaluationCriteria.slice(0, 3) : ["Core concept covered"]
        };
      })
    };

    setLatestEvaluation(generatedEvaluation);
    setActiveSession(prev => ({
      ...prev,
      isActive: false,
      isSubmitted: true
    }));
    return generatedEvaluation;
  };

  const resetSession = () => {
    setActiveSession({
      interviewId: null,
      isActive: false,
      questions: mockQuestionsBank,
      currentIndex: 0,
      answers: {},
      startedAt: null,
      timeElapsed: 0,
      isSubmitted: false
    });
  };

  const loadEvaluationById = async (interviewId) => {
    if (!interviewId) return null;
    try {
      const report = await api.getResults(interviewId);
      if (report) {
        setLatestEvaluation(report);
        return report;
      }
    } catch (err) {
      console.warn('[InterviewContext] Could not load evaluation for interviewId:', interviewId, err.message);
    }
    return null;
  };

  return (
    <InterviewContext.Provider
      value={{
        config,
        setConfig,
        activeSession,
        setActiveSession,
        latestEvaluation,
        setLatestEvaluation,
        startInterview,
        saveAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        completeInterview,
        loadEvaluationById,
        resetSession
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
