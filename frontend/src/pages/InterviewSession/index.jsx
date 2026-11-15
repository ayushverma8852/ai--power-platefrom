import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  HelpCircle,
  Mic,
  MicOff,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Flag,
  FileCheck2,
  Loader2
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Modal from '../../components/common/Modal';
import { useInterview } from '../../context/InterviewContext';

export default function InterviewSession() {
  const navigate = useNavigate();
  const {
    config,
    activeSession,
    saveAnswer,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    completeInterview
  } = useInterview();

  const questions = activeSession.questions;
  const currentIndex = activeSession.currentIndex;
  const currentQuestion = questions[currentIndex] || questions[0];

  const currentAnswer = activeSession.answers[currentQuestion?.id] || '';

  // Local seconds counter for timer
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerChange = (e) => {
    saveAnswer(currentQuestion.id, e.target.value);
  };

  const handleSimulateVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech to text snippet after brief delay
      setTimeout(() => {
        const simulatedText = currentQuestion.sampleIdealAnswer.slice(0, 150) + "...";
        saveAnswer(
          currentQuestion.id,
          currentAnswer ? `${currentAnswer}\n\n[Voice Note]: ${simulatedText}` : `[Voice Note]: ${simulatedText}`
        );
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleFinish = async () => {
    setShowFinishModal(false);
    setIsEvaluating(true);
    try {
      await completeInterview();
      navigate('/evaluation');
    } catch (err) {
      console.warn('Evaluation failed:', err);
      navigate('/evaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(activeSession.answers).filter(
    (k) => (activeSession.answers[k] || '').trim().length > 0
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Session Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {config.roleTitle}
              </h2>
              <Badge variant="brand" size="sm">
                {config.difficulty.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Live Mock Simulation • {questions.length} Total Questions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 self-end md:self-auto">
          {/* Timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 text-slate-700 font-mono text-sm font-semibold border border-slate-200">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{formatTimer(seconds)}</span>
          </div>

          {/* End Session Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFinishModal(true)}
            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            End Interview
          </Button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="px-1">
        <ProgressBar
          value={currentIndex + 1}
          max={questions.length}
          label={`Question ${currentIndex + 1} of ${questions.length}`}
          valueText={`${answeredCount} of ${questions.length} Answered`}
          size="sm"
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Navigator & Tips */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="Questions" subtitle="Jump between questions">
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = (activeSession.answers[q.id] || '').trim().length > 0;
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : hasAnswer
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/60'
                        : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isCurrent
                            ? 'bg-white/20 text-white'
                            : hasAnswer
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate max-w-[130px]">{q.topic}</span>
                    </div>

                    {hasAnswer && !isCurrent && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Contextual Interview Tip Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Answering Tip</span>
            </div>
            <p className="text-indigo-800/80 leading-relaxed text-[11px]">
              Use the <strong>Context-Action-Result</strong> structure. State the fundamental concept, describe real-world application, and address performance trade-offs.
            </p>
          </div>
        </div>

        {/* Right 3 Columns: Active Question & Answer Area */}
        <div className="lg:col-span-3 space-y-5">
          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">
                  {currentQuestion.category}
                </Badge>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-700">
                  {currentQuestion.topic}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'View Hint'}</span>
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h3>

              {showHint && (
                <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-in fade-in">
                  <strong>💡 Clue:</strong> {currentQuestion.hint}
                </div>
              )}
            </div>
          </div>

          {/* Response Textarea */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Answer
              </label>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>

                {/* Voice Simulation Button */}
                <button
                  type="button"
                  onClick={handleSimulateVoiceInput}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    isRecording
                      ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Speech-to-text prototype"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-600" />
                      <span>Transcribing...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Voice Input (Mock)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={currentAnswer}
              onChange={handleAnswerChange}
              placeholder="Type your structured technical explanation here... Mention core definitions, internal mechanics, performance considerations, and real-world examples."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y font-normal leading-relaxed"
            />

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                icon={ChevronLeft}
                onClick={prevQuestion}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!isLastQuestion ? (
                  <Button
                    variant="primary"
                    size="md"
                    iconRight={ChevronRight}
                    onClick={nextQuestion}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="md"
                    icon={FileCheck2}
                    onClick={() => setShowFinishModal(true)}
                    className="font-bold shadow-md shadow-emerald-200"
                  >
                    Finish & Generate AI Report
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Finish Modal */}
      <Modal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="Complete Mock Interview?"
        description="Your responses will be evaluated against technical accuracy and clarity criteria."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Questions:</span>
              <span className="font-semibold text-slate-800">{questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Answered Questions:</span>
              <span className="font-semibold text-slate-800">{answeredCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Session Duration:</span>
              <span className="font-semibold text-slate-800">{formatTimer(seconds)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFinishModal(false)}
            >
              Resume Interview
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={handleFinish}
            >
              Submit & View AI Report
            </Button>
          </div>
        </div>
      </Modal>

      {/* Evaluating AI Scorecard Modal Overlay */}
      {isEvaluating && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              AI Evaluation in Progress...
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Evaluating your answers against industry benchmarks, technical depth, and communication structure. Your scorecard will be ready in moments!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
