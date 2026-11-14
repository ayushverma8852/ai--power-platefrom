import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Check,
  BarChart2,
  Star,
  Zap,
  Briefcase,
  Code2,
  Signal,
  TrendingUp,
  Link2,
  BookOpen,
  FileText,
  PlayCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { startInterview } = useInterview();

  // State for the "Start a New Interview" form matching reference image
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [skillsFocus, setSkillsFocus] = useState('Java, DSA, Spring Boot');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');

  const handleStartInterview = (e) => {
    e.preventDefault();
    startInterview({
      roleTitle: targetRole,
      skills: skillsFocus.split(',').map(s => s.trim()),
      experienceLevel: experienceLevel,
      difficulty: difficultyLevel.toLowerCase(),
      questionCount: 5
    });
    navigate('/interview-session');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome Hero Banner with AI Interview Assistant Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e8f2fe] via-[#edf5ff] to-[#e4effe] p-6 sm:p-8 border border-blue-100/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Greeting Text */}
          <div className="space-y-2 text-center md:text-left z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-[#2563eb]">Ayush!</span>
            </h1>
            <p className="text-slate-600 font-medium text-base sm:text-lg flex items-center justify-center md:justify-start gap-1.5">
              <span>Let's ace your next interview together</span>
              <span className="inline-block hover:scale-110 transition-transform">🚀</span>
            </p>
          </div>

          {/* Right Vector Illustration: Laptop with Friendly Robot Assistant & Speech Bubble */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Speech Bubble */}
            <div className="absolute -top-3 right-2 sm:right-6 z-20 bg-white px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 animate-bounce [animation-duration:3s]">
              <span>Ready for your next interview?</span>
              {/* Bubble Tail */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100" />
            </div>

            {/* Illustration Canvas */}
            <div className="w-56 sm:w-64 h-36 relative flex items-end justify-center">
              {/* Potted Plant beside laptop */}
              <div className="absolute left-1 bottom-1 flex flex-col items-center">
                {/* Leaves */}
                <div className="relative w-8 h-10">
                  <div className="absolute bottom-0 left-1 w-3 h-7 bg-emerald-500 rounded-full -rotate-25 origin-bottom" />
                  <div className="absolute bottom-0 right-1 w-3 h-8 bg-teal-500 rounded-full rotate-25 origin-bottom" />
                  <div className="absolute bottom-0 left-2 w-3.5 h-9 bg-emerald-600 rounded-full origin-bottom" />
                </div>
                {/* Pot */}
                <div className="w-6 h-5 bg-white border border-slate-200 rounded-b-md shadow-xs" />
              </div>

              {/* Laptop Graphic */}
              <div className="relative flex flex-col items-center">
                {/* Laptop Screen Frame */}
                <div className="w-48 sm:w-52 h-28 bg-[#1e293b] rounded-t-xl border-4 border-[#334155] p-2 relative shadow-lg overflow-hidden flex flex-col items-center justify-center">
                  {/* Screen Content - Digital background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />
                  <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl" />

                  {/* Robot Head inside screen */}
                  <div className="relative z-10 flex flex-col items-center mt-1">
                    {/* Robot Antenna */}
                    <div className="w-1.5 h-2 bg-blue-400 rounded-t-full" />
                    <div className="w-3 h-1 bg-blue-400 rounded-full mb-0.5" />

                    {/* Robot Face Container */}
                    <div className="w-16 h-12 bg-white rounded-2xl p-1 shadow-md flex items-center justify-center relative">
                      {/* Headphones / Ear pads */}
                      <div className="absolute -left-1.5 w-2 h-6 bg-blue-500 rounded-full" />
                      <div className="absolute -right-1.5 w-2 h-6 bg-blue-500 rounded-full" />

                      {/* Screen Visor */}
                      <div className="w-full h-full bg-[#0a1128] rounded-xl flex items-center justify-center gap-2">
                        {/* Glowing Blue Eyes */}
                        <div className="w-2.5 h-3 bg-[#38bdf8] rounded-sm shadow-[0_0_8px_#38bdf8]" />
                        <div className="w-2.5 h-3 bg-[#38bdf8] rounded-sm shadow-[0_0_8px_#38bdf8]" />
                      </div>
                    </div>

                    {/* Robot Body with Blue Tie */}
                    <div className="relative w-12 h-6 bg-white rounded-t-lg mt-0.5 flex justify-center">
                      {/* Blue Tie */}
                      <div className="w-2 h-4 bg-[#2563eb] rounded-b-sm" />
                    </div>
                  </div>
                </div>

                {/* Laptop Keyboard Base */}
                <div className="w-56 sm:w-60 h-3 bg-[#cbd5e1] rounded-b-lg border-t border-slate-300 shadow-md relative flex justify-center">
                  <div className="w-14 h-1 bg-slate-400 rounded-b-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Statistics Cards Matching Reference Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Interviews */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Interviews</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">5</div>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Average Score</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">78%</div>
          </div>
        </div>

        {/* Card 3: Strongest Skill */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-200">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Strongest Skill</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">Java</div>
          </div>
        </div>

        {/* Card 4: Current Streak */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Current Streak</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">3 Days</div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Start a New Interview (Left) & Your Performance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Start a New Interview Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Lightning Bolt */}
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Start a New Interview
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Choose your preferences and begin your personalized interview practice.
            </p>

            {/* 2x2 Selection Fields */}
            <form onSubmit={handleStartInterview} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 1: Target Job Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Job Role
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Briefcase className="w-4 h-4 text-[#2563eb] shrink-0" />
                        <select
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Software Developer">Software Developer</option>
                          <option value="Frontend Developer">Frontend Developer</option>
                          <option value="Backend Java Engineer">Backend Java Engineer</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="AI / ML Engineer">AI / ML Engineer</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Field 2: Skills Focus */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Skills Focus
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Code2 className="w-4 h-4 text-slate-700 shrink-0" />
                        <select
                          value={skillsFocus}
                          onChange={(e) => setSkillsFocus(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Java, DSA, Spring Boot">Java, DSA, Spring Boot</option>
                          <option value="React, JavaScript, Tailwind">React, JavaScript, Tailwind</option>
                          <option value="Python, FastAPI, SQL">Python, FastAPI, SQL</option>
                          <option value="Node.js, Express, MongoDB">Node.js, Express, MongoDB</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Field 3: Experience Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Experience Level
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Signal className="w-4 h-4 text-[#2563eb] shrink-0" />
                        <select
                          value={experienceLevel}
                          onChange={(e) => setExperienceLevel(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Fresher">Fresher</option>
                          <option value="1-2 Years">1-2 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5+ Years">5+ Years</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Field 4: Difficulty Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Difficulty Level
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <select
                          value={difficultyLevel}
                          onChange={(e) => setDifficultyLevel(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Start Interview Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#1d68f2] hover:bg-[#1a5cd6] active:bg-[#1650bd] text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Interview</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Your Performance Chart Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Your Performance
                </h3>
              </div>
              <Link
                to="/performance"
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Line Chart rendered via SVG matching reference screenshot */}
            <div className="mt-4 relative h-48 w-full flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 320 160">
                {/* Horizontal Guide Lines */}
                <line x1="40" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="50" x2="310" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="310" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="110" x2="310" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="310" y2="140" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="32" y="24" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">100%</text>
                <text x="32" y="54" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">75%</text>
                <text x="32" y="84" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">50%</text>
                <text x="32" y="114" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">25%</text>
                <text x="32" y="144" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">0%</text>

                {/* X-Axis Labels */}
                <text x="60" y="156" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">Mon</text>
                <text x="120" y="156" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">Tue</text>
                <text x="180" y="156" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">Wed</text>
                <text x="240" y="156" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">Thu</text>
                <text x="295" y="156" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">Fri</text>

                {/* Smooth Performance Trend Line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="60,92 120,74 180,55 240,65 295,46"
                />

                {/* Points on Line */}
                <circle cx="60" cy="92" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                <circle cx="120" cy="74" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                <circle cx="180" cy="55" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                <circle cx="240" cy="65" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />

                {/* Friday Highlight Point with Tooltip Pill (78%) */}
                <circle cx="295" cy="46" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />

                {/* Tooltip Pill */}
                <g transform="translate(275, 12)">
                  <rect x="0" y="0" width="40" height="20" rx="6" fill="#2563eb" />
                  <text x="20" y="14" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold">
                    78%
                  </text>
                  <polygon points="17,20 23,20 20,24" fill="#2563eb" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Quick Links (Left) & Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Quick Links */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-slate-800" />
              <h3 className="text-base font-bold text-slate-900">
                Quick Links
              </h3>
            </div>

            {/* 4 Quick Link Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* DSA Practice */}
              <Link
                to="/resources"
                className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  DSA Practice
                </span>
              </Link>

              {/* Interview Tips */}
              <Link
                to="/resources"
                className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  Interview Tips
                </span>
              </Link>

              {/* Video Lectures */}
              <Link
                to="/resources"
                className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  Video Lectures
                </span>
              </Link>

              {/* Mock Tests */}
              <Link
                to="/start-interview"
                className="bg-slate-50/70 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  Mock Tests
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Activity */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900">
                  Recent Activity
                </h3>
              </div>
              <Link
                to="/attempts"
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Activity List matching screenshot */}
            <div className="space-y-4">
              {/* Item 1: Interview Completed - Java Developer */}
              <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Interview Completed – Java Developer
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Score: <span className="font-semibold text-slate-700">80%</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 font-medium">
                  2 hours ago
                </div>
              </div>

              {/* Item 2: New Study Material Added */}
              <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      New Study Material Added
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Data Structures
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 font-medium">
                  1 day ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
