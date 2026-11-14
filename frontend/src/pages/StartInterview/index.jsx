import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Award,
  Zap,
  HelpCircle,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  Layout,
  Server,
  BrainCircuit,
  Cloud,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import {
  mockRoles,
  experienceLevels,
  difficultyLevels,
  questionCountOptions
} from '../../data/mockRolesAndSkills';
import { useInterview } from '../../context/InterviewContext';

const roleIcons = {
  Layout,
  Server,
  Layers,
  BrainCircuit,
  Cloud
};

export default function StartInterview() {
  const navigate = useNavigate();
  const { config, startInterview } = useInterview();

  // Local configuration state initialized with context
  const [selectedRole, setSelectedRole] = useState(
    mockRoles.find((r) => r.id === config.roleId) || mockRoles[0]
  );
  const [selectedSkills, setSelectedSkills] = useState(
    config.skills || selectedRole.recommendedSkills.slice(0, 4)
  );
  const [selectedExperience, setSelectedExperience] = useState(
    config.experienceLevel || experienceLevels[0].label
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    config.difficulty || 'medium'
  );
  const [selectedCount, setSelectedCount] = useState(
    config.questionCount || 5
  );

  // When role changes, pre-select that role's recommended skills
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setSelectedSkills(role.recommendedSkills.slice(0, 4));
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleLaunch = () => {
    startInterview({
      roleId: selectedRole.id,
      roleTitle: selectedRole.title,
      skills: selectedSkills,
      experienceLevel: selectedExperience,
      difficulty: selectedDifficulty,
      questionCount: selectedCount
    });
    navigate('/interview-session');
  };

  const selectedCountObj = questionCountOptions.find(
    (q) => q.count === selectedCount
  ) || questionCountOptions[1];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Configure Interview Session
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Customize target domain, tech skills, and difficulty for a realistic mock interview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="md">
            Step 1 of 2: Setup
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Config Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Job Role Selection */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Select Job Role
              </label>
              <span className="text-xs text-slate-400">Choose primary target profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockRoles.map((role) => {
                const IconComponent = roleIcons[role.iconName] || Briefcase;
                const isSelected = selectedRole.id === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleChange(role)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        {role.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Skills Multi-Select */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Focus Skills & Technologies
              </label>
              <span className="text-xs text-slate-500">
                {selectedSkills.length} selected
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Click to toggle focus topics for this session:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {selectedRole.recommendedSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Experience / Knowledge Level */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Experience & Knowledge Level
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {experienceLevels.map((exp) => {
                const isSelected = selectedExperience === exp.label;
                return (
                  <div
                    key={exp.id}
                    onClick={() => setSelectedExperience(exp.label)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {exp.label}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {exp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Difficulty Level */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                Question Difficulty
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {difficultyLevels.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <div
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {diff.label}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {diff.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Number of Questions */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  5
                </span>
                Number of Questions
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {questionCountOptions.map((opt) => {
                const isSelected = selectedCount === opt.count;
                return (
                  <div
                    key={opt.count}
                    onClick={() => setSelectedCount(opt.count)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-extrabold text-slate-900">
                        {opt.count} Questions
                      </span>
                      <Badge
                        variant={isSelected ? 'brand' : 'neutral'}
                        size="sm"
                      >
                        {opt.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {opt.durationEstimate}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right 1 Column: Session Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card
              title="Interview Summary"
              subtitle="Review your setup before beginning"
              className="border-indigo-100 shadow-md shadow-indigo-100/50"
            >
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    Role
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedRole.title}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    Experience Level
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {selectedExperience}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    Difficulty & Format
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="brand" size="sm">
                      {selectedDifficulty.toUpperCase()}
                    </Badge>
                    <span className="text-slate-600 font-medium">
                      {selectedCount} Questions ({selectedCountObj.durationEstimate})
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    Selected Skill Tags ({selectedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Sparkles}
                    onClick={handleLaunch}
                    className="w-full text-sm font-bold shadow-md shadow-indigo-300"
                  >
                    Launch Interview Session
                  </Button>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800 leading-relaxed">
                    💡 <strong>Tip:</strong> Treat this like a real technical interview. Articulate trade-offs, mention potential bottlenecks, and write structured answers.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
