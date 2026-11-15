import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Award,
  Target,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { api } from '../../services/api';

export default function Performance() {
  const [performanceData, setPerformanceData] = useState({
    overallReadiness: 78,
    trendPercentage: 6,
    placementBenchmark: 75,
    strongestTopic: 'Java OOP',
    topicMastery: [
      { name: 'Core Java & OOP Concepts', score: 85, benchmark: 80 },
      { name: 'Data Structures & Algorithms', score: 78, benchmark: 75 },
      { name: 'Spring Boot & Microservices', score: 72, benchmark: 70 },
      { name: 'Database & SQL Indexing', score: 80, benchmark: 75 },
      { name: 'System Design & Scalability', score: 68, benchmark: 70 },
    ]
  });

  useEffect(() => {
    let isMounted = true;
    api.getPerformance()
      .then((data) => {
        if (isMounted && data) {
          setPerformanceData((prev) => ({
            ...prev,
            overallReadiness: data.overallReadiness ?? prev.overallReadiness,
            trendPercentage: data.trendPercentage ?? prev.trendPercentage,
            placementBenchmark: data.placementBenchmark ?? prev.placementBenchmark,
            strongestTopic: data.strongestTopic || prev.strongestTopic,
            topicMastery: data.topicMastery && data.topicMastery.length > 0
              ? data.topicMastery
              : prev.topicMastery
          }));
        }
      })
      .catch((err) => {
        console.warn('[Performance] Could not fetch live metrics, using defaults:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  const topics = performanceData.topicMastery;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Performance & Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Detailed breakdown of your interview metrics, score progression, and placement readiness.
          </p>
        </div>

        <Link to="/start-interview">
          <Button variant="primary" size="sm">
            Start New Practice
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Readiness
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{performanceData.overallReadiness}%</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{performanceData.trendPercentage}% over the last 14 days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Placement Benchmark
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{performanceData.placementBenchmark}%</div>
          <div className="mt-2 text-xs text-slate-500">
            Qualifies for Top Product & Service Firms
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Strongest Topic
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{performanceData.strongestTopic}</div>
          <div className="mt-2 text-xs text-slate-500">
            Top performing domain across technical mock sessions
          </div>
        </div>
      </div>

      {/* Topic-by-Topic Competency */}
      <Card
        title="Technical Topic Mastery"
        subtitle="Evaluated based on your recorded answers and mock sessions"
      >
        <div className="space-y-4">
          {topics.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{item.name}</span>
                <span className="text-slate-900 font-bold">{item.score}%</span>
              </div>
              <ProgressBar
                value={item.score}
                max={100}
                color={item.score >= 80 ? 'emerald' : item.score >= 70 ? 'indigo' : 'amber'}
                showLabel={false}
                size="md"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
