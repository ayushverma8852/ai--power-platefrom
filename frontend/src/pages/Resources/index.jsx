import React from 'react';
import {
  BookOpen,
  FileText,
  PlayCircle,
  Star,
  ExternalLink,
  Code2,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Resources() {
  const dsaTopics = [
    { title: 'Binary Trees & Traversals', difficulty: 'Medium', questions: 12 },
    { title: 'Dynamic Programming Patterns', difficulty: 'Hard', questions: 18 },
    { title: 'Graph BFS & DFS Implementations', difficulty: 'Medium', questions: 15 },
    { title: 'Two Pointers & Sliding Window', difficulty: 'Easy', questions: 10 }
  ];

  const interviewGuides = [
    { title: 'Top 50 Java & Spring Boot Interview Questions (2026 Edition)', readTime: '15 min read' },
    { title: 'Mastering the STAR Method for Behavioral Rounds', readTime: '8 min read' },
    { title: 'System Design Basics: Scalability, Caching & Load Balancing', readTime: '20 min read' },
    { title: 'Resume Checklist for Pre-Final Year Campus Placements', readTime: '5 min read' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#2563eb]" />
          Study Resources & Preparation Hub
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Handpicked practice sheets, video lectures, and cheat sheets to prepare for your tech interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DSA Practice Section */}
        <Card title="DSA Practice Track" subtitle="Key algorithmic concepts often asked in screening rounds">
          <div className="space-y-3">
            {dsaTopics.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#2563eb] flex items-center justify-center font-bold text-xs">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[11px] text-slate-500">{item.questions} Practice Problems</span>
                  </div>
                </div>

                <Badge
                  variant={item.difficulty === 'Easy' ? 'emerald' : item.difficulty === 'Hard' ? 'rose' : 'brand'}
                  size="sm"
                >
                  {item.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Interview Tips & Guides */}
        <Card title="Interview Guides & Cheat Sheets" subtitle="Practical insights from campus placement drives">
          <div className="space-y-3">
            {interviewGuides.map((guide, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-purple-600 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{guide.title}</h4>
                    <span className="text-[11px] text-slate-500">{guide.readTime}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
