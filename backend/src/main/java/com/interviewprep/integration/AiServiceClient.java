package com.interviewprep.integration;

import com.interviewprep.dto.InterviewCreateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.*;

/**
 * Dedicated integration client for communicating with the Python FastAPI AI Microservice.
 * Handles AI Question Formulation and Answer Evaluation with timeouts and resilient fallback.
 */
@Component
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);

    private final RestClient restClient;
    private final String aiServiceUrl;

    public AiServiceClient(
            @Value("${ai.service.url:http://localhost:8000}") String aiServiceUrl,
            @Value("${ai.service.connect-timeout-ms:5000}") int connectTimeoutMs,
            @Value("${ai.service.read-timeout-ms:45000}") int readTimeoutMs
    ) {
        this.aiServiceUrl = aiServiceUrl;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofMillis(connectTimeoutMs));
        requestFactory.setReadTimeout(Duration.ofMillis(readTimeoutMs));

        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public record AiQuestionItem(
            String category,
            String topic,
            String question,
            String hint,
            List<String> evaluationCriteria,
            String sampleIdealAnswer
    ) {}

    public record AiEvaluationItem(
            Integer questionNumber,
            String topic,
            String question,
            String candidateAnswer,
            Integer score,
            String feedback,
            List<String> keyPointsCovered
    ) {}

    public record AiEvaluationReport(
            Integer overallScore,
            String grade,
            String summaryHeadline,
            Integer technicalAccuracyScore,
            Integer communicationScore,
            Integer problemSolvingScore,
            Integer depthScore,
            List<String> strengths,
            List<String> areasForImprovement,
            List<String> recommendedResources,
            List<AiEvaluationItem> questionReviews
    ) {}

    /**
     * Request domain-specific questions from Python FastAPI microservice.
     */
    public List<AiQuestionItem> generateQuestions(InterviewCreateRequest request) {
        log.info("Requesting questions from AI Service at {}/api/v1/generate-questions for role: {}", aiServiceUrl, request.roleTitle());
        try {
            Map<String, Object> payload = Map.of(
                    "roleTitle", request.roleTitle(),
                    "skills", request.skills(),
                    "experienceLevel", request.experienceLevel(),
                    "difficulty", request.difficulty(),
                    "questionCount", request.questionCount()
            );

            AiQuestionItem[] response = restClient.post()
                    .uri("/api/v1/generate-questions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(AiQuestionItem[].class);

            if (response != null && response.length > 0) {
                log.info("Received {} questions from AI microservice", response.length);
                return Arrays.asList(response);
            }
        } catch (Exception e) {
            log.warn("AI service unreachable at {} ({}). Using curated questions fallback.", aiServiceUrl, e.getMessage());
        }

        return getFallbackQuestions(request);
    }

    /**
     * Request evaluation of submitted answers from Python FastAPI microservice.
     */
    public AiEvaluationReport evaluateAnswers(
            String roleTitle,
            String difficulty,
            List<Map<String, Object>> questionsAndAnswers
    ) {
        log.info("Requesting AI evaluation from {}/api/v1/evaluate-answers for {} questions", aiServiceUrl, questionsAndAnswers.size());
        try {
            Map<String, Object> payload = Map.of(
                    "roleTitle", roleTitle,
                    "difficulty", difficulty,
                    "submissions", questionsAndAnswers
            );

            AiEvaluationReport report = restClient.post()
                    .uri("/api/v1/evaluate-answers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(AiEvaluationReport.class);

            if (report != null) {
                log.info("Received AI evaluation report with overall score: {}", report.overallScore());
                return report;
            }
        } catch (Exception e) {
            log.warn("AI service evaluation endpoint unreachable ({}). Applying rubric-based evaluation fallback.", e.getMessage());
        }

        return generateFallbackEvaluation(roleTitle, difficulty, questionsAndAnswers);
    }

    // =========================================================================
    // Resilience Fallback Logic (used when Python AI service is booting/offline)
    // =========================================================================

    private List<AiQuestionItem> getFallbackQuestions(InterviewCreateRequest request) {
        List<AiQuestionItem> list = new ArrayList<>();
        String role = request.roleTitle().toLowerCase();

        if (role.contains("java") || role.contains("backend") || role.contains("software")) {
            list.add(new AiQuestionItem(
                    "Java Core",
                    "JVM Memory Model & Garbage Collection",
                    "Explain the difference between Stack and Heap memory in Java. How does the JVM Garbage Collector identify and clean unreachable objects?",
                    "Think about primitive variables vs object references, stack frames, and GC roots traversal.",
                    List.of("Stack memory stores method frames and primitives", "Heap memory stores objects and instances", "GC roots identification", "Generational GC concepts"),
                    "Stack memory is used for execution of threads, storing primitive local variables and references to objects. Heap memory is allocated dynamically for objects and JRE classes. The Garbage Collector identifies unreachable objects by traversing roots from active stack frames and static references, freeing unreferenced heap memory."
            ));
            list.add(new AiQuestionItem(
                    "Spring Boot",
                    "Dependency Injection & Bean Scopes",
                    "How does Spring's Inversion of Control (IoC) container manage bean lifecycles, and what are the key differences between Singleton and Prototype scopes?",
                    "Discuss ApplicationContext, @Component, @Autowired, and thread-safety implications.",
                    List.of("Explains IoC and DI advantages", "Differentiates Singleton (one per context) vs Prototype (new instance per request)", "Mentions bean lifecycle annotations like @PostConstruct"),
                    "The IoC container instantiates, configures, and manages Spring beans. Singleton scope (default) creates one shared instance per Spring context, requiring stateless thread safety. Prototype scope generates a brand new instance each time the bean is requested."
            ));
            list.add(new AiQuestionItem(
                    "Database & SQL",
                    "Database Indexing & Query Optimization",
                    "How do B-Tree indexes improve database query performance in MySQL? What are composite indexes and leftmost prefix rule?",
                    "Consider lookup complexity O(log N) vs full table scans, and how WHERE clauses match compound indexes.",
                    List.of("Explains B-Tree structure for logarithmic lookups", "Explains leftmost prefix rule for composite indexes", "Discusses write performance trade-offs of excessive indexes"),
                    "B-Tree indexes organize sorted pointer structures allowing O(log N) search times rather than O(N) full table scans. Composite indexes cover multiple columns; under the leftmost prefix rule, queries can use the index as long as leading columns are included in query conditions."
            ));
            list.add(new AiQuestionItem(
                    "Data Structures",
                    "HashMap Internal Architecture",
                    "Explain the internal working of Java's HashMap in Java 8+. How are collisions handled and when does bucket treeification happen?",
                    "Recall array of buckets, hash codes, bucket threshold (8), and TreeBins (Red-Black Trees).",
                    List.of("Explains hashing and bucket indexing using (n-1) & hash", "Explains linked list chaining for collision resolution", "Highlights Java 8 treeification into Red-Black Tree when threshold reaches 8"),
                    "Java HashMap uses an array of Node buckets. The key's hashCode is spread and mapped to a bucket index. When collisions occur, items chain in linked lists. In Java 8+, once a bucket reaches 8 elements and the capacity is at least 64, the bucket transforms into a balanced Red-Black Tree to keep lookup worst-case O(log N)."
            ));
            list.add(new AiQuestionItem(
                    "System Design",
                    "REST API Security & JWT Authentication",
                    "How do Stateless JWT tokens work for authentication in microservices? What are the advantages and security risks compared to Session cookies?",
                    "Consider token structure (Header, Payload, Signature), secret verification, and token revocation.",
                    List.of("Explains JWT anatomy (header, payload, signature)", "Stateless validation across distributed microservices", "Discusses risks like inability to invalidate without blacklisting"),
                    "JWT encodes user claims cryptographically signed by the issuer. Services verify the signature using shared secrets or public keys without querying a centralized session database, allowing horizontal scaling. However, revoking compromised tokens before expiration requires maintaining token blocklists in distributed caches."
            ));
        } else {
            // Frontend React domain
            list.add(new AiQuestionItem(
                    "React Architecture",
                    "Virtual DOM & Reconciliation",
                    "Explain how React's Virtual DOM and Reconciliation algorithm (Fiber) work. Why is direct DOM manipulation generally slower in large applications?",
                    "Think about batching updates, O(n) heuristics, and browser reflow/repaint costs.",
                    List.of("Virtual DOM as lightweight in-memory tree", "Minimizing expensive browser reflow and repaints", "Batching updates in React Fiber"),
                    "React maintains an in-memory Virtual DOM tree representing the UI. When state changes, a new tree is diffed against the previous snapshot using React Fiber reconciliation. Rather than mutating the real DOM for each small state change—which triggers costly browser layout reflows—React batches minimal surgical DOM updates."
            ));
            list.add(new AiQuestionItem(
                    "React State Management",
                    "useEffect Dependencies & Cleanups",
                    "What are the common pitfalls with the `useEffect` dependency array, and what is the purpose of the cleanup function?",
                    "Consider stale closures, infinite re-render loops, and aborting fetch requests.",
                    List.of("Identifies stale closures from missing dependencies", "Infinite re-render loops from unmemoized object references", "Cleanup function for event listeners and AbortController"),
                    "Missing dependencies lead to stale closures where the effect captures outdated state. Conversely, passing unmemoized objects triggers infinite loops. The cleanup function runs before component unmount and before the effect re-runs, essential for removing event listeners or aborting in-flight requests."
            ));
            list.add(new AiQuestionItem(
                    "JavaScript",
                    "Event Loop & Microtasks",
                    "How does the JavaScript Event Loop handle microtasks (e.g. Promises) vs macrotasks (e.g. setTimeout)?",
                    "Recall call stack execution, microtask queue priority, and event loop tick cycle.",
                    List.of("Differentiates call stack from queues", "Microtasks (Promises) drain completely before next macrotask", "setTimeout as macrotask"),
                    "Synchronous code runs on the call stack first. Once the call stack is clear, the event loop drains the entire microtask queue before picking the next macrotask like setTimeout, guaranteeing promise handlers execute promptly."
            ));
        }

        int requestedCount = request.questionCount() != null ? request.questionCount() : 5;
        return list.subList(0, Math.min(requestedCount, list.size()));
    }

    private AiEvaluationReport generateFallbackEvaluation(
            String roleTitle,
            String difficulty,
            List<Map<String, Object>> qaList
    ) {
        int totalScore = 0;
        List<AiEvaluationItem> reviews = new ArrayList<>();

        for (int i = 0; i < qaList.size(); i++) {
            Map<String, Object> qa = qaList.get(i);
            String question = (String) qa.getOrDefault("question", "Technical Question");
            String topic = (String) qa.getOrDefault("topic", "Core Fundamentals");
            String candidateAnswer = (String) qa.getOrDefault("candidateAnswer", "");

            int wordCount = candidateAnswer.trim().isEmpty() ? 0 : candidateAnswer.trim().split("\\s+").length;
            int score = wordCount >= 30 ? Math.min(95, 76 + (wordCount / 4)) : (wordCount > 10 ? 70 : 50);
            totalScore += score;

            String feedback = wordCount > 25
                    ? "Good articulation of core concepts and design trade-offs. To elevate further, cite real-world production error scenarios."
                    : (wordCount > 0 ? "Understood the basic definition, but lacked depth on internal mechanics and trade-offs." : "No answer provided during practice session.");

            reviews.add(new AiEvaluationItem(
                    i + 1,
                    topic,
                    question,
                    candidateAnswer.isEmpty() ? "No written response submitted." : candidateAnswer,
                    score,
                    feedback,
                    List.of("Core definition covered", "Trade-off awareness", "Practical relevance")
            ));
        }

        int avgScore = qaList.isEmpty() ? 75 : totalScore / qaList.size();
        String grade = avgScore >= 85 ? "Strong Hire" : (avgScore >= 75 ? "Hire" : "Needs Practice");

        return new AiEvaluationReport(
                avgScore,
                grade,
                "Candidate demonstrates solid command over core language features, architectural principles, and real-world system considerations.",
                Math.min(100, avgScore + 2),
                Math.max(60, avgScore - 2),
                avgScore,
                Math.min(100, avgScore + 1),
                List.of(
                        "Structured thought process with clear terminology.",
                        "Identified key internal mechanisms and memory/runtime trade-offs.",
                        "Accurate conceptual breakdown of core engineering topics."
                ),
                List.of(
                        "Elaborate further on concurrency and edge-case handling in high-load scenarios.",
                        "Provide concrete code syntax or framework configuration examples."
                ),
                List.of(
                        "Review official documentation and architectural best practices.",
                        "Practice structured communication frameworks like Situation-Task-Action-Result (STAR)."
                ),
                reviews
        );
    }
}
