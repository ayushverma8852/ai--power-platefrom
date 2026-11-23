export const mockRoles = [
  {
    id: "frontend-react",
    title: "Frontend React Developer",
    iconName: "Layout",
    description: "Component architecture, state management, hooks, modern JavaScript, and responsive UI design.",
    recommendedSkills: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "React Router", "Redux Toolkit", "TypeScript", "Performance & Web Vitals", "RESTful APIs"]
  },
  {
    id: "backend-java",
    title: "Backend Java / Spring Boot Engineer",
    iconName: "Server",
    description: "Microservices, Spring Boot, JPA/Hibernate, relational DBs, API security, and concurrency.",
    recommendedSkills: ["Java 17+", "Spring Boot", "Spring Data JPA", "PostgreSQL / MySQL", "REST APIs", "JWT Authentication", "System Design", "Docker Basics"]
  },
  {
    id: "fullstack-web",
    title: "Full-Stack Web Developer",
    iconName: "Layers",
    description: "End-to-end web apps, connecting modern frontend frameworks with robust backend services.",
    recommendedSkills: ["React.js", "Node.js / Express", "MongoDB / SQL", "Tailwind CSS", "REST / GraphQL", "Git & CI/CD", "State Management", "Authentication"]
  },
  {
    id: "aiml-engineer",
    title: "AI / ML Solutions Engineer",
    iconName: "BrainCircuit",
    description: "Machine learning fundamentals, model integration, Python, FastAPI, and prompt engineering.",
    recommendedSkills: ["Python", "PyTorch / TensorFlow", "FastAPI", "Prompt Engineering", "Data Preprocessing", "LLM Fine-tuning", "Scikit-Learn", "Vector Databases"]
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps Intern",
    iconName: "Cloud",
    description: "CI/CD pipelines, containerization, cloud infrastructure (AWS/GCP), and Linux environments.",
    recommendedSkills: ["Linux / Bash", "Docker", "Kubernetes", "AWS Basics", "GitHub Actions", "Terraform", "Monitoring & Logs", "Networking"]
  }
];

export const experienceLevels = [
  {
    id: "entry",
    label: "Entry Level (0-1 yrs)",
    description: "College students, new graduates, or junior developers building foundational confidence."
  },
  {
    id: "mid",
    label: "Mid Level (2-4 yrs)",
    description: "Practicing developers with project experience tackling architectural and edge-case questions."
  },
  {
    id: "senior",
    label: "Senior Level (5+ yrs)",
    description: "Seasoned engineers focusing on high-level system design, scalability, and technical leadership."
  }
];

export const difficultyLevels = [
  {
    id: "easy",
    label: "Fundamental (Easy)",
    color: "emerald",
    description: "Core definitions, syntax conventions, and standard conceptual explanations."
  },
  {
    id: "medium",
    label: "Standard (Medium)",
    color: "indigo",
    description: "Real-world scenarios, debugging logic, best practices, and trade-off considerations."
  },
  {
    id: "hard",
    label: "Advanced (Hard)",
    color: "rose",
    description: "Deep dive edge cases, architectural patterns, concurrency, and performance bottlenecks."
  }
];

export const questionCountOptions = [
  { count: 3, durationEstimate: "10-15 mins", badge: "Quick Drill" },
  { count: 5, durationEstimate: "20-25 mins", badge: "Recommended" },
  { count: 10, durationEstimate: "45-50 mins", badge: "Full Mock" }
];
