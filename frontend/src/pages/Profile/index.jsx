import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Mail,
  Calendar,
  Sparkles,
  Settings,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Save,
  Cpu
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockUser } from '../../data/mockUser';

export default function Profile() {
  const [profileData, setProfileData] = useState(mockUser);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Candidate Profile & Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal academic background, target placement roles, and interview simulation preferences.
          </p>
        </div>

        {isSaved && (
          <Badge variant="emerald" size="md">
            Preferences Saved!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Card & Academic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main User Bio Card */}
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profileData.avatarUrl}
                  alt={profileData.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50 shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </span>
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                {profileData.name}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                {profileData.targetRole}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profileData.email}</span>
              </div>

              <p className="mt-4 text-xs text-slate-600 leading-relaxed text-left border-t border-slate-100 pt-4">
                {profileData.bio}
              </p>
            </div>
          </Card>

          {/* Academic Background Card */}
          <Card title="Academic Background" subtitle="College & graduation track">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {profileData.college}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {profileData.degree}
                  </div>
                  <div className="text-slate-400 mt-0.5 font-medium">
                    Graduation Batch: {profileData.graduationYear}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Academic Project Track
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">
                    InterviewPrep AI (College Minor Project)
                  </div>
                  <div>Status: Frontend Prototype Milestone Completed</div>
                  <div className="text-emerald-600 font-semibold">
                    ✓ Modular React architecture ready for Spring Boot integration
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: Skills, Target Roles, and Preferences Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Skills & Tech Stack */}
          <Card
            title="Core Skills & Technologies"
            subtitle="Skills highlighted during AI mock question formulation"
          >
            <div className="flex flex-wrap gap-2">
              {profileData.topSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/60 inline-flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Interview Preferences Form */}
          <Card
            title="Interview Simulation Preferences"
            subtitle="Configure default settings for future mock sessions"
          >
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Default Question Count
                  </label>
                  <select
                    value={profileData.preferences.defaultQuestionCount}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          defaultQuestionCount: Number(e.target.value)
                        }
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={3}>3 Questions (Quick Drill)</option>
                    <option value={5}>5 Questions (Standard Practice)</option>
                    <option value={10}>10 Questions (Comprehensive)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Default Difficulty Target
                  </label>
                  <select
                    value={profileData.preferences.preferredDifficulty}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          preferredDifficulty: e.target.value
                        }
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Fundamental (Easy)</option>
                    <option value="Medium">Standard (Medium)</option>
                    <option value="Hard">Advanced (Hard)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Speech-to-Text Prototype Mode
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Enable the simulated audio transcription button during interview sessions
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.speechToTextPrototype}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          speechToTextPrototype: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Real-time Sound Cues & Timer Alerts
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Chime audio feedback when transitioning between questions
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.soundEffects}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          soundEffects: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Save}
                >
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>

          {/* Project Architecture Overview Card */}
          <Card
            title="System Architecture Decoupling"
            subtitle="Frontend independently operates without requiring Spring Boot or Python AI services"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Frontend Layer
                </div>
                <div className="text-[11px] text-slate-500">
                  Vite + React.js + Tailwind CSS
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Status: Fully Functional
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Backend Service
                </div>
                <div className="text-[11px] text-slate-500">
                  Java Spring Boot REST API
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Status: Independent (Phase 2)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  AI Service
                </div>
                <div className="text-[11px] text-slate-500">
                  LLM / Python Microservice
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Status: Independent (Phase 2)
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
