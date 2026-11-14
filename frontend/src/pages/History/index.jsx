import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  FileText,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockHistory } from '../../data/mockHistory';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch =
      item.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topicsCovered.some((t) =>
        t.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      item.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const getScoreBadge = (score) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Award className="w-3.5 h-3.5" />
          {score} / 100
        </span>
      );
    }
    if (score >= 75) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Award className="w-3.5 h-3.5" />
          {score} / 100
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Award className="w-3.5 h-3.5" />
        {score} / 100
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Interview History
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review past mock interviews, scores, and track your long-term preparation trajectory.
          </p>
        </div>

        <Link to="/start-interview">
          <Button variant="primary" size="sm" icon={RotateCcw}>
            Start New Session
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role or key topics (e.g. React, Docker, Event Loop)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (Fundamental)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="hard">Hard (Advanced)</option>
          </select>
        </div>
      </div>

      {/* History Table / Records */}
      <Card
        title={`Recorded Sessions (${filteredHistory.length})`}
        subtitle="Chronological list of all evaluated sessions"
      >
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">No mock sessions found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or difficulty filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-6">Interview Session</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Topics Covered</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.roleTitle}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.experienceLevel}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      <div className="font-medium text-slate-800">{item.date}</div>
                      <div className="text-[11px] text-slate-400">{item.timeAgo}</div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          item.difficulty === 'Easy'
                            ? 'emerald'
                            : item.difficulty === 'Hard'
                            ? 'rose'
                            : 'brand'
                        }
                        size="sm"
                      >
                        {item.difficulty}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      <div>{item.questionCount} Questions</div>
                      <div className="text-[11px] text-slate-400">{item.durationMinutes} mins</div>
                    </td>

                    <td className="py-4 px-4">
                      {getScoreBadge(item.score)}
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {item.topicsCovered.slice(0, 3).map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                        {item.topicsCovered.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold self-center">
                            +{item.topicsCovered.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link to="/evaluation">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconRight={ChevronRight}
                          className="text-indigo-600 font-semibold"
                        >
                          View Report
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
