import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import StartInterview from './pages/StartInterview';
import InterviewSession from './pages/InterviewSession';
import Evaluation from './pages/Evaluation';
import History from './pages/History';
import Profile from './pages/Profile';
import Performance from './pages/Performance';
import Resources from './pages/Resources';
import Settings from './pages/Settings';

export default function App() {
  return (
    <InterviewProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/start-interview" element={<StartInterview />} />
            <Route path="/interview-session" element={<InterviewSession />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/attempts" element={<History />} />
            <Route path="/history" element={<History />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </InterviewProvider>
  );
}
