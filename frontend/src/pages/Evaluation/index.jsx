import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  BarChart2,
  TrendingUp,
  Check,
  Brain
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import { useInterview } from '../../context/InterviewContext';

export default function Evaluation() {
  const { latestEvaluation } = useInterview();
  const evaluation = latestEvaluation;

  // Manage accordion open state per question review
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true });

  const toggleAccordion = (idx) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 85) return 'emerald';
    if (score >= 75) return 'brand';
    return 'amber';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Session ID: {evaluation.id}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              Completed on {evaluation.date} at {evaluation.completedAt}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Evaluation & Feedback Report
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/start-interview">
            <Button variant="secondary" size="sm" icon={RotateCcw}>
              Practice Again
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={() => window.print()}
          >
            Export Summary
          </Button>
        </div>
      </div>

      {/* Hero Scorecard */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Score Radial */}
          <div className="flex flex-col sm:flex-row items-center gap-5 md:col-span-1 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - evaluation.overallScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {evaluation.overallScore}
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                  out of 100
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <Badge variant="emerald" size="md" dot>
                {evaluation.grade}
              </Badge>
              <h3 className="mt-2 text-base font-bold text-white">
                {evaluation.roleTitle}
              </h3>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Difficulty: {evaluation.difficulty} • {evaluation.durationMinutes} mins
              </p>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="md:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Assessment Synthesis</span>
            </div>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal">
              "{evaluation.summaryHeadline}"
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-indigo-300">
              <span><strong>Accuracy:</strong> 88%</span>
              <span>•</span>
              <span><strong>Clarity:</strong> 84%</span>
              <span>•</span>
              <span><strong>Structure:</strong> 85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluation.detailedMetrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>{metric.name}</span>
              <span className="text-slate-900 font-bold text-sm">
                {metric.score}%
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar
                value={metric.score}
                max={metric.maxScore}
                color={getScoreBadgeVariant(metric.score)}
                size="md"
                showLabel={false}
              />
            </div>
            <p className="mt-3 text-[11px] text-slate-500 leading-normal">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* Strengths & Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <Card
          title="Demonstrated Strengths"
          subtitle="Areas where your technical foundation and clarity shone"
        >
          <ul className="space-y-3">
            {evaluation.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Areas for Improvement */}
        <Card
          title="Recommended Improvements"
          subtitle="Focus topics to polish before your real-world campus interviews"
        >
          <ul className="space-y-3">
            {evaluation.areasForImprovement.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Question-by-Question Deep Dive Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Question-by-Question Detailed Review
            </h3>
            <p className="text-xs text-slate-500">
              Compare your recorded responses with key conceptual benchmarks
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {evaluation.questionReviews.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {evaluation.questionReviews.map((rev, idx) => {
            const isExpanded = !!expandedQuestions[idx];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="cursor-pointer p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      Q{rev.questionNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                          {rev.topic}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                        {rev.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={getScoreBadgeVariant(rev.score)} size="sm">
                      {rev.score} / 100
                    </Badge>
                    <button className="text-slate-400 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                    {/* Candidate Answer */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                        Your Submitted Answer
                      </div>
                      <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                        "{rev.candidateAnswer}"
                      </p>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900 uppercase tracking-wider text-[10px] mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Evaluator Commentary</span>
                      </div>
                      <p className="text-indigo-950 leading-relaxed">
                        {rev.feedback}
                      </p>
                    </div>

                    {/* Key Criteria Covered */}
                    <div>
                      <div className="font-semibold text-slate-700 text-[11px] mb-2">
                        Key Concepts Identified:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {rev.keyPointsCovered.map((kp, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {kp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Reading Resources */}
      <Card
        title="Recommended Study Resources"
        subtitle="Curated documentation and guides to bridge identified knowledge gaps"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {evaluation.recommendedResources.map((res, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <Badge variant="brand" size="sm">
                  {res.type}
                </Badge>
                <h5 className="font-bold text-slate-900 text-xs mt-2">
                  {res.title}
                </h5>
              </div>
              <a
                href={res.url}
                onClick={(e) => e.preventDefault()}
                className="mt-3 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Review Topic
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
