# InterviewPrep AI - Frontend

College Minor Project: **AI-Powered Interview Preparation System (InterviewPrep AI)**

Modern, professional SaaS frontend built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React**.

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates production-ready bundled assets into `frontend/dist/`.

---

## 📁 Architecture & File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI primitives (Badge, Button, Card, Modal, ProgressBar, StatCard)
│   │   └── layout/             # Application shell (DashboardLayout, Sidebar, TopNavbar)
│   ├── context/
│   │   └── InterviewContext.jsx # In-memory interview session manager (active question, answers, scoring)
│   ├── data/                   # Realistic, structured sample data (standalone)
│   │   ├── mockUser.js         # Student candidate profile & academic track
│   │   ├── mockRolesAndSkills.js # Available job titles, skills, difficulty options
│   │   ├── mockQuestions.js    # Technical question bank with hints & evaluation criteria
│   │   ├── mockHistory.js      # Completed interview history logs
│   │   └── mockEvaluation.js   # Detailed AI scorecard, strengths, improvement areas
│   ├── pages/
│   │   ├── Dashboard/          # Welcome banner, KPI metric cards, performance chart, recent activity
│   │   ├── StartInterview/     # 5-step configuration wizard (Role, Skills, Level, Difficulty, Qty)
│   │   ├── InterviewSession/   # Focus environment (Timer, question navigator, answer input, tips)
│   │   ├── Evaluation/         # AI Scorecard, competency radar, detailed question review
│   │   ├── History/            # Filterable & searchable interview history
│   │   └── Profile/            # Student profile, target roles, simulation preferences
│   ├── App.jsx                 # Client-side routing with React Router
│   ├── main.jsx                # Application root entry point
│   └── index.css               # Tailwind CSS directives & custom utility classes
├── index.html                  # HTML entry point for Vite
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🔒 Decoupled Architecture Note

This frontend operates independently in **prototype simulation mode**. It does not make unauthorized assumptions or mock network requests to backend endpoints, allowing it to seamlessly connect to the Spring Boot REST API and AI microservice in subsequent phases.
