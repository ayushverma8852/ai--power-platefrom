export const mockEvaluationResult = {
  id: "eval-2026-001",
  interviewId: "int-2026-001",
  roleTitle: "Frontend React Developer",
  difficulty: "Medium",
  date: "2026-11-12",
  completedAt: "11:42 AM",
  durationMinutes: 22,
  overallScore: 86,
  grade: "Strong Hire",
  summaryHeadline: "Demonstrates solid grasp of modern React lifecycle, virtual DOM diffing heuristics, and async JavaScript fundamentals.",
  detailedMetrics: [
    { name: "Technical Accuracy", score: 88, maxScore: 100, label: "Core understanding of architectural concepts & syntax" },
    { name: "Communication & Structure", score: 84, maxScore: 100, label: "Clarity, logical progression, and terminology precision" },
    { name: "Problem Solving & Trade-offs", score: 85, maxScore: 100, label: "Awareness of edge cases, performance trade-offs & scale" },
    { name: "Depth & Practicality", score: 87, maxScore: 100, label: "Real-world engineering insights and error mitigation" }
  ],
  strengths: [
    "Clear explanation of browser repaint and reflow costs when explaining the Virtual DOM and React Fiber.",
    "Correctly highlighted the hazards of missing items in useEffect dependency arrays (stale closures).",
    "Good distinction between microtask queue priority (Promises) and macrotasks (setTimeout) in the event loop.",
    "Recognized that over-memoizing trivial components with useMemo introduces memory overhead and reference-check penalties."
  ],
  areasForImprovement: [
    "Could have elaborated on AbortController implementation for network request cancellation in useEffect cleanups.",
    "Mentioned Cross-Site Scripting (XSS) defenses, but missed discussing Content Security Policy (CSP) headers in depth.",
    "Could use concrete structured frameworks (like STAR or Situation-Complication-Solution) when formulating longer technical answers."
  ],
  recommendedResources: [
    { title: "React Official Docs: Synchronizing with Effects", url: "#", type: "Documentation" },
    { title: "MDN Web Docs: In-depth Event Loop and Microtasks", url: "#", type: "Guide" },
    { title: "OWASP Top 10: Cross-Site Scripting (XSS) Prevention", url: "#", type: "Security" }
  ],
  questionReviews: [
    {
      questionNumber: 1,
      topic: "Virtual DOM & Reconciliation",
      question: "Explain how React's Virtual DOM and Reconciliation algorithm (Fiber) work. Why is direct DOM manipulation generally slower in large applications?",
      candidateAnswer: "The virtual DOM is an in-memory lightweight representation of the actual DOM elements. Whenever state updates occur, React generates a new Virtual DOM tree and diffs it against the previous snapshot using Fiber reconciliation. Direct DOM mutations are expensive because the browser recomputes layout geometry (reflow) and repaints pixels on every change. React batches these mutations and updates only the altered nodes.",
      score: 92,
      feedback: "Excellent answer. You articulated the browser performance bottleneck (reflow/repaint) and accurately explained React's batching strategy.",
      keyPointsCovered: ["In-memory representation", "Heuristic O(n) diffing", "Reflow/repaint cost", "Batching DOM mutations"]
    },
    {
      questionNumber: 2,
      topic: "useEffect Dependencies & Cleanups",
      question: "What are the common pitfalls with the `useEffect` dependency array, and what is the purpose of the cleanup function? Provide a concrete example.",
      candidateAnswer: "If you omit variables that the effect depends on, you can get stale closures where variables don't update. If you include objects recreated on every render without useMemo, you cause infinite loops. The cleanup function runs before the component unmounts or before the effect runs again, which is useful for removing event listeners or timers.",
      score: 85,
      feedback: "Strong conceptual understanding. To elevate this to top-tier, explicitly mention AbortController for race condition mitigation in fetch calls.",
      keyPointsCovered: ["Stale closures identified", "Infinite render loop mechanics", "Cleanup timing before re-execution"]
    },
    {
      questionNumber: 3,
      topic: "Event Loop & Asynchronous Microtasks",
      question: "How does the JavaScript Event Loop handle microtasks (e.g. Promises) vs macrotasks (e.g. setTimeout)? What will be the output order and why?",
      candidateAnswer: "Synchronous operations run on the call stack first. Once the stack is clear, the event loop drains the entire microtask queue (Promise .then callbacks, process.nextTick) before picking any macrotask like setTimeout. Thus, resolved promises always execute before timer callbacks even if setTimeout is 0ms.",
      score: 88,
      feedback: "Very accurate explanation of microtask queue draining behavior before macrotask ticks.",
      keyPointsCovered: ["Call stack execution order", "Microtask queue prioritization", "setTimeout macrotask cycle"]
    },
    {
      questionNumber: 4,
      topic: "Memoization (useMemo, useCallback, React.memo)",
      question: "When should you use `React.memo`, `useMemo`, and `useCallback`, and when might overusing them harm performance?",
      candidateAnswer: "React.memo prevents child components from re-rendering if their props don't change. useCallback memoizes callback functions so child props keep stable references. useMemo caches heavy calculation results. Overusing them is bad because comparing dependencies takes CPU time and caching functions uses more memory than just creating small functions.",
      score: 84,
      feedback: "Accurate perspective on trade-offs. Good job emphasizing that caching itself has memory and comparison costs.",
      keyPointsCovered: ["React.memo prop diffing", "useCallback reference stability", "Memory overhead warning"]
    },
    {
      questionNumber: 5,
      topic: "Frontend Security (XSS & CSRF)",
      question: "How do Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) differ, and what front-end and browser defense mechanisms protect against them?",
      candidateAnswer: "XSS is when an attacker injects rogue JavaScript into the site and steals session tokens. CSRF is when an attacker tricks the user's browser into executing actions on another site where they are logged in. React escapes values by default which stops XSS, and SameSite cookies along with anti-CSRF tokens protect against CSRF.",
      score: 81,
      feedback: "Solid foundation. Mentioning Content Security Policy (CSP) headers and avoiding dangerouslySetInnerHTML would provide a complete security breakdown.",
      keyPointsCovered: ["XSS vs CSRF distinction", "React JSX auto-escaping", "SameSite cookie attributes"]
    }
  ]
};
