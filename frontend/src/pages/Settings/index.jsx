import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Volume2,
  Shield,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-700" />
            System & User Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure application behavior, timer cues, and session defaults.
          </p>
        </div>

        {saved && (
          <Badge variant="emerald" size="md">
            Settings Updated Successfully!
          </Badge>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <Card title="Interview Session Experience" subtitle="Controls active during live practice sessions">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Sound Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Timer & Question Audio Chimes</div>
                  <div className="text-slate-500 text-[11px]">Play soft chime when advancing through questions</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
              />
            </label>

            {/* Notification Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Daily Practice Reminders</div>
                  <div className="text-slate-500 text-[11px]">Receive subtle reminders to maintain your 3-day practice streak</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
              />
            </label>

            {/* Auto-Save Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Answer Auto-Save Protection</div>
                  <div className="text-slate-500 text-[11px]">Automatically preserve written responses locally to prevent data loss</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={Save}>
                Save Settings
              </Button>
            </div>
          </form>
        </Card>

        {/* Project Information */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">College Minor Project Metadata</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              <strong>Project:</strong> InterviewPrep AI • <strong>Team:</strong> COSMIC CODER'S • <strong>Institution:</strong> OIST.
              The frontend is fully responsive and decoupled from the backend Spring Boot and AI microservices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
