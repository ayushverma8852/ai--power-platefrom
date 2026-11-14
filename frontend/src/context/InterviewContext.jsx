import React, { createContext, useContext, useState } from 'react';
import { mockQuestionsBank } from '../data/mockQuestions';
import { mockEvaluationResult } from '../data/mockEvaluation';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [config, setConfig] = useState({
    roleId: 'frontend-react',
    roleTitle: 'Frontend React Developer',
    experienceLevel: 'Entry Level (0-1 yrs)',
    difficulty: 'medium',
    skills: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'RESTful APIs'],
    questionCount: 5
  });

  const [activeSession, setActiveSession] = useState({
    isActive: false,
    questions: mockQuestionsBank,
    currentIndex: 0,
    answers: {},
    startedAt: null,
    timeElapsed: 0,
    isSubmitted: false
  });

  const [latestEvaluation, setLatestEvaluation] = useState(mockEvaluationResult);

  const startInterview = (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    // Pick questions matching or defaulting
    const count = updatedConfig.questionCount || 5;
    const selectedQuestions = mockQuestionsBank.slice(0, count);

    setActiveSession({
      isActive: true,
      questions: selectedQuestions,
      currentIndex: 0,
      answers: {},
      startedAt: new Date(),
      timeElapsed: 0,
      isSubmitted: false
    });
  };

  const saveAnswer = (questionId, answerText) => {
    setActiveSession(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerText
      }
    }));
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

  const completeInterview = () => {
    // Generate evaluation referencing active answers
    const generatedEvaluation = {
      ...mockEvaluationResult,
      id: `eval-${Date.now()}`,
      roleTitle: config.roleTitle,
      difficulty: config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1),
      date: new Date().toISOString().split('T')[0],
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: Math.max(1, Math.round(activeSession.timeElapsed / 60) || 12),
      // Map answers to reviews
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
          keyPointsCovered: q.evaluationCriteria.slice(0, 3)
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
      isActive: false,
      questions: mockQuestionsBank,
      currentIndex: 0,
      answers: {},
      startedAt: null,
      timeElapsed: 0,
      isSubmitted: false
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        config,
        setConfig,
        activeSession,
        setActiveSession,
        latestEvaluation,
        startInterview,
        saveAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        completeInterview,
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
