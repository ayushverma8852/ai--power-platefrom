package com.interviewprep.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.*;
import com.interviewprep.entity.*;
import com.interviewprep.integration.AiServiceClient;
import com.interviewprep.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewServiceImpl implements InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewServiceImpl.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.systemDefault());
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a").withZone(ZoneId.systemDefault());

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final EvaluationRepository evaluationRepository;
    private final AiServiceClient aiServiceClient;
    private final ObjectMapper objectMapper;

    public InterviewServiceImpl(
            InterviewRepository interviewRepository,
            QuestionRepository questionRepository,
            AnswerRepository answerRepository,
            EvaluationRepository evaluationRepository,
            AiServiceClient aiServiceClient,
            ObjectMapper objectMapper
    ) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.evaluationRepository = evaluationRepository;
        this.aiServiceClient = aiServiceClient;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public InterviewResponse createInterview(InterviewCreateRequest request) {
        log.info("Creating interview for role: {}, skills: {}, difficulty: {}",
                request.roleTitle(), request.skills(), request.difficulty());

        String interviewId = "int-" + UUID.randomUUID().toString().substring(0, 8);

        InterviewEntity interview = new InterviewEntity();
        interview.setId(interviewId);
        interview.setRoleTitle(request.roleTitle());
        interview.setExperienceLevel(request.experienceLevel());
        interview.setDifficulty(request.difficulty().substring(0, 1).toUpperCase() + request.difficulty().substring(1).toLowerCase());
        interview.setSkillsSummary(String.join(", ", request.skills()));
        interview.setQuestionCount(request.questionCount() != null ? request.questionCount() : 5);
        interview.setStatus("IN_PROGRESS");
        interview.setCreatedAt(Instant.now());

        // Get questions from AI service
        List<AiServiceClient.AiQuestionItem> aiQuestions = aiServiceClient.generateQuestions(request);

        List<QuestionEntity> questionEntities = new ArrayList<>();
        int qNum = 1;
        for (AiServiceClient.AiQuestionItem item : aiQuestions) {
            QuestionEntity q = new QuestionEntity();
            q.setId("q-" + UUID.randomUUID().toString().substring(0, 8));
            q.setInterview(interview);
            q.setQuestionNumber(qNum++);
            q.setCategory(item.category());
            q.setTopic(item.topic());
            q.setQuestionText(item.question());
            q.setHint(item.hint());
            q.setEvaluationCriteria(toJson(item.evaluationCriteria()));
            q.setSampleIdealAnswer(item.sampleIdealAnswer());
            questionEntities.add(q);
        }

        interview.setQuestions(questionEntities);
        InterviewEntity saved = interviewRepository.save(interview);

        return mapToInterviewResponse(saved, Map.of());
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewResponse getInterview(String interviewId) {
        InterviewEntity interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new NoSuchElementException("Interview not found: " + interviewId));

        List<AnswerEntity> answers = answerRepository.findByInterviewId(interviewId);
        Map<String, String> answerMap = answers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), AnswerEntity::getAnswerText, (v1, v2) -> v2));

        return mapToInterviewResponse(interview, answerMap);
    }

    @Override
    @Transactional
    public AnswerSubmitResponse submitAnswer(String interviewId, AnswerSubmitRequest request) {
        QuestionEntity question = questionRepository.findByIdAndInterviewId(request.questionId(), interviewId)
                .orElseThrow(() -> new NoSuchElementException("Question " + request.questionId() + " not found for interview " + interviewId));

        AnswerEntity answer = answerRepository.findByQuestionId(request.questionId())
                .orElseGet(() -> {
                    AnswerEntity newAns = new AnswerEntity();
                    newAns.setId("ans-" + UUID.randomUUID().toString().substring(0, 8));
                    newAns.setQuestion(question);
                    newAns.setInterviewId(interviewId);
                    return newAns;
                });

        answer.setAnswerText(request.answerText() != null ? request.answerText() : "");
        answer.setSubmittedAt(Instant.now());
        answerRepository.save(answer);

        long answeredCount = answerRepository.countByInterviewId(interviewId);
        InterviewEntity interview = question.getInterview();

        return new AnswerSubmitResponse(
                request.questionId(),
                true,
                answeredCount,
                interview.getQuestionCount()
        );
    }

    @Override
    @Transactional
    public EvaluationResponse completeInterview(String interviewId, InterviewCompleteRequest request) {
        InterviewEntity interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new NoSuchElementException("Interview not found: " + interviewId));

        List<QuestionEntity> questions = questionRepository.findByInterviewIdOrderByQuestionNumberAsc(interviewId);
        List<AnswerEntity> answers = answerRepository.findByInterviewId(interviewId);

        Map<String, String> answerMap = answers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), AnswerEntity::getAnswerText, (v1, v2) -> v2));

        // Prepare submissions for AI evaluation
        List<Map<String, Object>> submissions = new ArrayList<>();
        for (QuestionEntity q : questions) {
            submissions.add(Map.of(
                    "questionNumber", q.getQuestionNumber(),
                    "topic", q.getTopic() != null ? q.getTopic() : q.getCategory(),
                    "question", q.getQuestionText(),
                    "candidateAnswer", answerMap.getOrDefault(q.getId(), ""),
                    "sampleIdealAnswer", q.getSampleIdealAnswer() != null ? q.getSampleIdealAnswer() : "",
                    "evaluationCriteria", fromJsonList(q.getEvaluationCriteria())
            ));
        }

        // Call AI evaluation
        AiServiceClient.AiEvaluationReport report = aiServiceClient.evaluateAnswers(
                interview.getRoleTitle(),
                interview.getDifficulty(),
                submissions
        );

        // Update interview entity
        interview.setStatus("COMPLETED");
        interview.setFinalScore(report.overallScore());
        interview.setCompletedAt(Instant.now());
        if (request != null && request.timeElapsedSeconds() != null) {
            interview.setDurationSeconds(request.timeElapsedSeconds());
        }

        // Save EvaluationEntity
        EvaluationEntity evaluation = new EvaluationEntity();
        evaluation.setId("eval-" + UUID.randomUUID().toString().substring(0, 8));
        evaluation.setInterview(interview);
        evaluation.setOverallScore(report.overallScore());
        evaluation.setGrade(report.grade());
        evaluation.setSummaryHeadline(report.summaryHeadline());
        evaluation.setTechnicalAccuracyScore(report.technicalAccuracyScore());
        evaluation.setCommunicationScore(report.communicationScore());
        evaluation.setProblemSolvingScore(report.problemSolvingScore());
        evaluation.setDepthScore(report.depthScore());
        evaluation.setStrengthsJson(toJson(report.strengths()));
        evaluation.setImprovementsJson(toJson(report.areasForImprovement()));
        evaluation.setResourcesJson(toJson(report.recommendedResources()));
        evaluation.setCreatedAt(Instant.now());

        List<QuestionReviewEntity> reviews = new ArrayList<>();
        for (AiServiceClient.AiEvaluationItem item : report.questionReviews()) {
            QuestionReviewEntity rev = new QuestionReviewEntity();
            rev.setId("rev-" + UUID.randomUUID().toString().substring(0, 8));
            rev.setEvaluation(evaluation);
            rev.setQuestionNumber(item.questionNumber());
            rev.setTopic(item.topic());
            rev.setQuestionText(item.question());
            rev.setCandidateAnswer(item.candidateAnswer());
            rev.setScore(item.score());
            rev.setFeedback(item.feedback());
            rev.setKeyPointsCoveredJson(toJson(item.keyPointsCovered()));
            reviews.add(rev);
        }
        evaluation.setQuestionReviews(reviews);

        interview.setEvaluation(evaluation);
        interviewRepository.save(interview);

        return mapToEvaluationResponse(evaluation, interview);
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluationResponse getEvaluationResults(String interviewId) {
        InterviewEntity interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new NoSuchElementException("Interview not found: " + interviewId));

        EvaluationEntity evaluation = evaluationRepository.findByInterviewId(interviewId)
                .orElseThrow(() -> new NoSuchElementException("Evaluation not yet completed for interview: " + interviewId));

        return mapToEvaluationResponse(evaluation, interview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewHistoryItem> getInterviewHistory(String search, String difficulty) {
        List<InterviewEntity> all = interviewRepository.findAllByOrderByCreatedAtDesc();

        return all.stream()
                .filter(i -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String s = search.toLowerCase();
                        boolean matchRole = i.getRoleTitle().toLowerCase().contains(s);
                        boolean matchSkills = i.getSkillsSummary() != null && i.getSkillsSummary().toLowerCase().contains(s);
                        if (!matchRole && !matchSkills) return false;
                    }
                    if (difficulty != null && !difficulty.equalsIgnoreCase("all")) {
                        return i.getDifficulty().equalsIgnoreCase(difficulty);
                    }
                    return true;
                })
                .map(this::mapToHistoryItem)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // Helper Mappers
    // =========================================================================

    private InterviewResponse mapToInterviewResponse(InterviewEntity entity, Map<String, String> answers) {
        List<QuestionDto> qDtos = entity.getQuestions().stream()
                .map(q -> new QuestionDto(
                        q.getId(),
                        q.getQuestionNumber(),
                        q.getCategory(),
                        q.getTopic(),
                        q.getQuestionText(),
                        q.getHint(),
                        fromJsonList(q.getEvaluationCriteria()),
                        q.getSampleIdealAnswer(),
                        answers.getOrDefault(q.getId(), "")
                ))
                .collect(Collectors.toList());

        return new InterviewResponse(
                entity.getId(),
                entity.getRoleTitle(),
                entity.getExperienceLevel(),
                entity.getDifficulty(),
                entity.getSkillsSummary(),
                entity.getQuestionCount(),
                entity.getDurationSeconds(),
                entity.getStatus(),
                entity.getFinalScore(),
                entity.getCreatedAt(),
                entity.getCompletedAt(),
                qDtos,
                answers
        );
    }

    private EvaluationResponse mapToEvaluationResponse(EvaluationEntity eval, InterviewEntity interview) {
        List<EvaluationResponse.MetricScore> metrics = List.of(
                new EvaluationResponse.MetricScore("Technical Accuracy", eval.getTechnicalAccuracyScore(), 100, "Core understanding of architectural concepts & syntax"),
                new EvaluationResponse.MetricScore("Communication & Structure", eval.getCommunicationScore(), 100, "Clarity, logical progression, and terminology precision"),
                new EvaluationResponse.MetricScore("Problem Solving & Trade-offs", eval.getProblemSolvingScore(), 100, "Awareness of edge cases, performance trade-offs & scale"),
                new EvaluationResponse.MetricScore("Depth & Practicality", eval.getDepthScore(), 100, "Real-world engineering insights and error mitigation")
        );

        List<EvaluationResponse.ResourceItem> resources = fromJsonList(eval.getResourcesJson()).stream()
                .map(str -> new EvaluationResponse.ResourceItem(str, "#", "Recommended Topic"))
                .collect(Collectors.toList());

        List<EvaluationResponse.QuestionReviewItem> reviews = eval.getQuestionReviews().stream()
                .map(r -> new EvaluationResponse.QuestionReviewItem(
                        r.getQuestionNumber(),
                        r.getTopic(),
                        r.getQuestionText(),
                        r.getCandidateAnswer(),
                        r.getScore(),
                        r.getFeedback(),
                        fromJsonList(r.getKeyPointsCoveredJson())
                ))
                .collect(Collectors.toList());

        int durationMins = Math.max(1, (interview.getDurationSeconds() != null ? interview.getDurationSeconds() : 1200) / 60);

        return new EvaluationResponse(
                eval.getId(),
                interview.getId(),
                interview.getRoleTitle(),
                interview.getDifficulty(),
                DATE_FMT.format(eval.getCreatedAt()),
                TIME_FMT.format(eval.getCreatedAt()),
                durationMins,
                eval.getOverallScore(),
                eval.getGrade(),
                eval.getSummaryHeadline(),
                metrics,
                fromJsonList(eval.getStrengthsJson()),
                fromJsonList(eval.getImprovementsJson()),
                resources,
                reviews
        );
    }

    private InterviewHistoryItem mapToHistoryItem(InterviewEntity i) {
        int durationMins = Math.max(1, (i.getDurationSeconds() != null ? i.getDurationSeconds() : 1200) / 60);
        int score = i.getFinalScore() != null ? i.getFinalScore() : 75;

        List<String> topics = i.getQuestions().stream()
                .map(q -> q.getTopic() != null ? q.getTopic() : q.getCategory())
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return new InterviewHistoryItem(
                i.getId(),
                i.getRoleTitle(),
                i.getExperienceLevel(),
                DATE_FMT.format(i.getCreatedAt()),
                "Recent",
                i.getDifficulty(),
                i.getQuestionCount(),
                durationMins,
                score,
                i.getStatus(),
                topics
        );
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<String> fromJsonList(String json) {
        if (json == null || json.trim().isEmpty()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of(json.split("\\r?\\n"));
        }
    }
}
