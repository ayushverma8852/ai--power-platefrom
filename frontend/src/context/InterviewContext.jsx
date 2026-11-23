import React, { createContext, useContext, useState, useEffect } from 'react';
import { interviewService } from '../services/interviewService';
import { evaluationService } from '../services/evaluationService';
import { historyService } from '../services/historyService';
import { useAuth } from './AuthContext';

const InterviewContext = createContext(null);

const DEFAULT_CONFIG = {
  technology: 'Java',
  difficulty: 'Intermediate',
  questionCount: 5,
  interviewType: 'Technical',
  roleTitle: 'Java Developer'
};

export function InterviewProvider({ children }) {
  const { user } = useAuth();
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const [activeSession, setActiveSession] = useState({
    backendId: null,
    isActive: false,
    questions: [],
    currentIndex: 0,
    answers: {},
    startedAt: null,
    timeElapsed: 0,
    isSubmitted: false
  });

  const getUserHistoryKey = (u) => {
    if (!u) return 'interviewprep_history_guest';
    return `interviewprep_history_${u.email || u.id || 'user'}`;
  };

  const getUserEvalKey = (u) => {
    if (!u) return 'interviewprep_latest_eval_guest';
    return `interviewprep_latest_eval_${u.email || u.id || 'user'}`;
  };

  const [history, setHistory] = useState([]);
  const [latestEvaluation, setLatestEvaluation] = useState(null);

  // Load user-specific history whenever active user changes
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLatestEvaluation(null);
      return;
    }

    const key = getUserHistoryKey(user);
    const evalKey = getUserEvalKey(user);

    let initialItems = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          initialItems = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed parsing user history:', e);
    }

    setHistory(initialItems);

    try {
      const rawEval = localStorage.getItem(evalKey);
      if (rawEval) {
        setLatestEvaluation(JSON.parse(rawEval));
      } else {
        setLatestEvaluation(null);
      }
    } catch (e) {
      setLatestEvaluation(null);
    }

    // Attempt sync with backend for authenticated user
    async function syncBackendUserHistory() {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('interviewprep_jwt');
        if (token) {
          const res = await historyService.getUserHistory();
          if (res && res.data && Array.isArray(res.data)) {
            const formatted = res.data.map((item) => ({
              id: item.id,
              interviewId: `int-${item.id}`,
              technology: item.technology,
              roleTitle: `${item.technology} Developer`,
              date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : 'Today',
              timeAgo: 'Recent',
              difficulty: item.difficulty,
              interviewType: item.interviewType,
              questionCount: item.totalQuestions || 5,
              durationMinutes: 15,
              score: item.totalScore ?? 0,
              overallScore: item.totalScore ?? 0,
              grade: (item.totalScore || 0) >= 80 ? 'Strong Hire' : (item.totalScore || 0) >= 60 ? 'Hire' : 'Needs Practice',
              gradeColor: (item.totalScore || 0) >= 80 ? 'emerald' : 'brand',
              strengths: item.strengths || [],
              areasForImprovement: item.areasForImprovement || [],
              topicsCovered: item.topicsCovered || [item.technology]
            }));
            setHistory(formatted);
            localStorage.setItem(key, JSON.stringify(formatted));
          }
        }
      } catch (err) {
        console.warn('Backend history sync skipped:', err.message);
      }
    }

    syncBackendUserHistory();
  }, [user?.email, user?.id]);

  // Persist history to user-specific storage whenever it updates
  useEffect(() => {
    if (user) {
      const key = getUserHistoryKey(user);
      try {
        localStorage.setItem(key, JSON.stringify(history));
      } catch (e) {
        console.error(e);
      }
    }
  }, [history, user]);

  // Persist latest evaluation to user-specific storage
  useEffect(() => {
    if (user && latestEvaluation) {
      const evalKey = getUserEvalKey(user);
      try {
        localStorage.setItem(evalKey, JSON.stringify(latestEvaluation));
      } catch (e) {
        console.error(e);
      }
    }
  }, [latestEvaluation, user]);

  // Start interview with selected configuration via Spring Boot
  const startInterview = async (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    const res = await interviewService.createInterview({
      technology: updatedConfig.technology,
      difficulty: updatedConfig.difficulty,
      interviewType: updatedConfig.interviewType || 'Technical',
      numberOfQuestions: Number(updatedConfig.questionCount) || 5
    });

    if (!res || !res.id) {
      throw new Error('Failed to create interview session on backend.');
    }

    if (!res.questions || res.questions.length === 0) {
      throw new Error('AI microservice generated 0 questions for this configuration.');
    }

    const backendId = res.id;
    const questions = res.questions.map((q, idx) => ({
      id: q.id || idx + 1,
      question: q.questionText,
      topic: q.topic || updatedConfig.technology,
      difficulty: q.difficulty || updatedConfig.difficulty,
      expectedConcepts: q.expectedConcepts
        ? Array.isArray(q.expectedConcepts)
          ? q.expectedConcepts
          : q.expectedConcepts.split(',')
        : [],
      sampleIdealAnswer: q.sampleIdealAnswer || '',
      hint: q.expectedConcepts
        ? `Focus on: ${Array.isArray(q.expectedConcepts) ? q.expectedConcepts.join(', ') : q.expectedConcepts}`
        : 'Explain principles and real-world application'
    }));

    setActiveSession({
      backendId,
      isActive: true,
      questions,
      currentIndex: 0,
      answers: {},
      startedAt: new Date(),
      timeElapsed: 0,
      isSubmitted: false
    });

    return backendId;
  };

  const saveAnswer = (questionId, answerText) => {
    setActiveSession((prev) => {
      if (prev.backendId) {
        interviewService.submitAnswer(prev.backendId, questionId, answerText).catch((e) => console.warn(e));
      }
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answerText
        }
      };
    });
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

  // Complete interview: Run Spring Boot -> FastAPI AI Microservice evaluation
  const completeInterview = async () => {
    if (!activeSession.backendId) {
      throw new Error('No active interview session found to complete.');
    }

    // Explicitly persist all candidate answers to backend prior to completion
    const answerEntries = Object.entries(activeSession.answers || {});
    for (const [qId, text] of answerEntries) {
      if (text !== undefined && text !== null) {
        await interviewService.submitAnswer(activeSession.backendId, Number(qId), text);
      }
    }

    // Trigger backend evaluation and completion transaction
    await interviewService.completeInterview(activeSession.backendId);
    const evalRes = await evaluationService.getInterviewResults(activeSession.backendId);

    if (!evalRes || !evalRes.questions || evalRes.questions.length === 0) {
      throw new Error('Evaluation returned no questions from backend.');
    }

    const overallScore = evalRes.overallScore || 0;
    const detailedReviews = evalRes.questions.map((q, idx) => ({
      questionNumber: idx + 1,
      questionId: q.questionId,
      topic: q.topic || config.technology,
      difficulty: q.difficulty || config.difficulty,
      questionText: q.questionText,
      candidateAnswer: q.studentAnswer || '[No response provided]',
      score: q.score || 0,
      correctnessScore: q.correctness || 0,
      relevanceScore: q.relevance || 0,
      completenessScore: q.completeness || 0,
      matchedKeywords: q.matchedConcepts || [],
      missedKeywords: q.missedConcepts || [],
      strengths: q.strengths || [],
      weaknesses: q.weaknesses || [],
      improvements: q.improvementSuggestions || [],
      sampleIdealAnswer: q.modelAnswer || '',
      feedback: q.explanation || 'Evaluated by AI Microservice'
    }));

    const evaluation = {
      interviewId: `int-${activeSession.backendId}`,
      backendInterviewId: activeSession.backendId,
      date: new Date().toISOString().split('T')[0],
      technology: config.technology,
      difficulty: config.difficulty,
      interviewType: config.interviewType,
      questionCount: activeSession.questions.length,
      durationMinutes: Math.max(1, Math.round((activeSession.timeElapsed || 300) / 60)),
      overallScore,
      grade: overallScore >= 85 ? 'Strong Hire' : overallScore >= 70 ? 'Hire' : overallScore >= 50 ? 'Borderline' : 'Needs Practice',
      gradeColor: overallScore >= 85 ? 'emerald' : overallScore >= 70 ? 'brand' : overallScore >= 50 ? 'amber' : 'rose',
      isLiveAI: true,
      aiModelUsed: 'FastAPI AI Microservice (Configured Provider)',
      detailedMetrics: [
        { name: 'Answer Relevance', score: Math.round(evalRes.questions.reduce((a, b) => a + (b.relevance || 0), 0) / evalRes.questions.length), maxScore: 100, label: 'Direct alignment with question topic' },
        { name: 'Technical Correctness', score: Math.round(evalRes.questions.reduce((a, b) => a + (b.correctness || 0), 0) / evalRes.questions.length), maxScore: 100, label: 'Technical precision and mechanics' },
        { name: 'Completeness & Depth', score: Math.round(evalRes.questions.reduce((a, b) => a + (b.completeness || 0), 0) / evalRes.questions.length), maxScore: 100, label: 'Elaboration and coverage' },
        { name: 'Quality & Structure', score: overallScore, maxScore: 100, label: 'Logical phrasing and explanation' }
      ],
      strengths: evalRes.overallStrengths && evalRes.overallStrengths.length > 0 ? evalRes.overallStrengths : ['Demonstrated technical understanding of core concepts.'],
      areasForImprovement: evalRes.overallWeaknesses && evalRes.overallWeaknesses.length > 0 ? evalRes.overallWeaknesses : ['Expand coverage of edge-cases and architectural trade-offs.'],
      questionReviews: detailedReviews
    };

    setLatestEvaluation(evaluation);

    // Update history
    const historyItem = {
      id: activeSession.backendId,
      interviewId: `int-${activeSession.backendId}`,
      technology: config.technology,
      roleTitle: `${config.technology} Developer`,
      date: evaluation.date,
      timeAgo: 'Just now',
      difficulty: config.difficulty,
      interviewType: config.interviewType,
      questionCount: activeSession.questions.length,
      durationMinutes: evaluation.durationMinutes,
      score: evaluation.overallScore,
      overallScore: evaluation.overallScore,
      grade: evaluation.grade,
      isLiveAI: true,
      aiModelUsed: evaluation.aiModelUsed,
      topicsCovered: activeSession.questions.map(q => q.topic || config.technology),
      gradeColor: evaluation.gradeColor,
      detailedMetrics: evaluation.detailedMetrics,
      strengths: evaluation.strengths,
      areasForImprovement: evaluation.areasForImprovement,
      questionReviews: evaluation.questionReviews
    };

    setHistory(prev => [historyItem, ...prev.filter(h => h.id !== activeSession.backendId)]);

    setActiveSession(prev => ({
      ...prev,
      isActive: false,
      isSubmitted: true
    }));

    return evaluation;
  };

  const loadEvaluation = (evalData) => {
    setLatestEvaluation(evalData);
  };

  const deleteHistoryItem = async (id) => {
    await historyService.deleteHistoryItem(id);
    setHistory(prev => prev.filter(item => item.id !== id));
    if (user) {
      try {
        const key = getUserHistoryKey(user);
        const updated = history.filter(item => item.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (e) {
        // cache write failure non-blocking
      }
    }
  };

  const clearAllHistory = async () => {
    for (const item of history) {
      try {
        await historyService.deleteHistoryItem(item.id);
      } catch (e) {
        console.warn('Failed deleting item on backend:', item.id, e.message);
      }
    }
    setHistory([]);
    setLatestEvaluation(null);
    if (user) {
      try {
        localStorage.removeItem(getUserHistoryKey(user));
        localStorage.removeItem(getUserEvalKey(user));
      } catch (e) {
        // ignore
      }
    }
  };

  const resetSession = () => {
    setActiveSession({
      backendId: null,
      isActive: false,
      questions: [],
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
        history,
        startInterview,
        saveAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        completeInterview,
        loadEvaluation,
        deleteHistoryItem,
        clearAllHistory,
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

export default InterviewContext;
