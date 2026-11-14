export const mockQuestionsBank = [
  {
    id: "q-101",
    roleId: "frontend-react",
    difficulty: "medium",
    category: "React Architecture",
    topic: "Virtual DOM & Reconciliation",
    question: "Explain how React's Virtual DOM and Reconciliation algorithm (Fiber) work. Why is direct DOM manipulation generally slower in large applications?",
    hint: "Think about batching updates, the diffing algorithm (O(n) heuristics), keys in lists, and browser reflow/repaint costs.",
    evaluationCriteria: [
      "Mentions Virtual DOM as a lightweight in-memory representation of UI",
      "Explains browser repaint and reflow costs of direct DOM mutations",
      "Discusses React Fiber's incremental rendering and prioritization",
      "Highlights how keys assist list diffing heuristics"
    ],
    sampleIdealAnswer: "React maintains an in-memory Virtual DOM tree representing the UI. When state changes, a new tree is created and diffed against the previous one using React's heuristic O(n) reconciliation algorithm (React Fiber). Rather than modifying the real DOM for each small mutation—which triggers expensive browser layout reflows and repaints—React batches changes and performs minimal surgical real DOM updates."
  },
  {
    id: "q-102",
    roleId: "frontend-react",
    difficulty: "medium",
    category: "React State Management",
    topic: "useEffect Dependencies & Cleanups",
    question: "What are the common pitfalls with the `useEffect` dependency array, and what is the purpose of the cleanup function? Provide a concrete example.",
    hint: "Consider stale closures, infinite render loops, event listeners, and aborting fetch requests.",
    evaluationCriteria: [
      "Addresses stale closures caused by missing dependencies",
      "Explains infinite re-render loops when objects/arrays are declared in render scope",
      "Discusses cleanup function timing (before unmount or before next effect run)",
      "Mentions AbortController for race conditions in network requests"
    ],
    sampleIdealAnswer: "Missing dependencies can lead to stale closures where the effect captures obsolete state. Conversely, passing unmemoized objects or functions causes infinite re-render loops. The cleanup function runs before the component unmounts and before the effect re-runs on dependency changes, crucial for removing event listeners, clearing timers, or canceling in-flight fetch requests with AbortController."
  },
  {
    id: "q-103",
    roleId: "frontend-react",
    difficulty: "medium",
    category: "Modern JavaScript",
    topic: "Event Loop & Asynchronous Microtasks",
    question: "How does the JavaScript Event Loop handle microtasks (e.g. Promises) vs macrotasks (e.g. setTimeout)? What will be the output order and why?",
    hint: "Recall the call stack, microtask queue priority, and event loop tick cycle.",
    evaluationCriteria: [
      "Differentiates call stack execution from task queues",
      "Clarifies microtask queue (Promises, queueMicrotask) priority over macrotasks (setTimeout, setInterval)",
      "Explains that all queued microtasks drain before the next macrotask executes"
    ],
    sampleIdealAnswer: "Synchronous code executes on the call stack first. When asynchronous operations resolve, callbacks enter either the microtask queue (Promises, MutationObserver) or the macrotask queue (setTimeout, setInterval, I/O). After each synchronous frame finishes, the engine drains the entire microtask queue before picking the single next macrotask, ensuring promise reactions execute promptly."
  },
  {
    id: "q-104",
    roleId: "frontend-react",
    difficulty: "medium",
    category: "Performance Optimization",
    topic: "Memoization (useMemo, useCallback, React.memo)",
    question: "When should you use `React.memo`, `useMemo`, and `useCallback`, and when might overusing them harm performance?",
    hint: "Discuss shallow reference equality, props comparison overhead, and garbage collection.",
    evaluationCriteria: [
      "Explains React.memo for component re-rendering prevention",
      "Explains useCallback for preserving function references passed as props",
      "Explains useMemo for caching expensive computational values",
      "Highlights that memoization has a memory overhead and dependency comparison cost"
    ],
    sampleIdealAnswer: "React.memo skips re-rendering a functional component if props haven't shallowly changed. useCallback caches a callback function instance to prevent unnecessary re-renders of memoized child components, while useMemo caches the result of expensive calculations. Overusing them everywhere introduces memory overhead and CPU cycles spent checking dependencies for trivial operations that are cheaper to recalculate."
  },
  {
    id: "q-105",
    roleId: "frontend-react",
    difficulty: "medium",
    category: "Web Architecture & Security",
    topic: "Frontend Security (XSS & CSRF)",
    question: "How do Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) differ, and what front-end and browser defense mechanisms protect against them?",
    hint: "Think about dangerouslySetInnerHTML, sanitized inputs, HttpOnly cookies, SameSite attributes, and CSRF tokens.",
    evaluationCriteria: [
      "Distinguishes XSS (code injection executed in user's browser) from CSRF (unauthorized commands transmitted on user's behalf)",
      "Highlights React's built-in JSX escaping mechanism",
      "Explains SameSite=Lax/Strict cookie flags and anti-CSRF headers",
      "Warns against storing sensitive JWT tokens in localStorage"
    ],
    sampleIdealAnswer: "XSS occurs when malicious JavaScript is injected and executed in the victim's session, often stealing tokens or cookies. CSRF tricks an authenticated user's browser into sending unwanted requests to a trusted server. Defenses include React's automatic JSX string escaping, Content Security Policy (CSP), avoiding dangerouslySetInnerHTML, using HttpOnly SameSite=Strict/Lax cookies, and validating anti-CSRF request tokens."
  }
];
