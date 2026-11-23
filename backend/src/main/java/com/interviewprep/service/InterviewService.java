package com.interviewprep.service;

import com.interviewprep.dto.*;
import com.interviewprep.dto.ai.AiQuestionItemDto;
import com.interviewprep.entity.*;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;
    private final EvaluationService evaluationService;

    public InterviewService(
        InterviewRepository interviewRepository,
        InterviewQuestionRepository questionRepository,
        InterviewAnswerRepository answerRepository,
        UserRepository userRepository,
        AiServiceClient aiServiceClient,
        @Lazy EvaluationService evaluationService
    ) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.aiServiceClient = aiServiceClient;
        this.evaluationService = evaluationService;
    }

    @Transactional
    public InterviewResponse createInterview(Long userId, CreateInterviewRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Interview interview = new Interview(
            user,
            request.getTechnology(),
            request.getDifficulty(),
            request.getInterviewType(),
            request.getNumberOfQuestions()
        );
        Interview savedInterview = interviewRepository.save(interview);

        // Fetch questions from AI Microservice
        List<AiQuestionItemDto> aiQuestions = aiServiceClient.generateQuestions(
            request.getTechnology(),
            request.getDifficulty(),
            request.getInterviewType(),
            request.getNumberOfQuestions()
        );

        List<InterviewQuestion> questionsToSave = new ArrayList<>();
        int order = 1;
        for (AiQuestionItemDto item : aiQuestions) {
            String concepts = item.getExpectedConcepts() != null ? String.join(",", item.getExpectedConcepts()) : "";
            InterviewQuestion q = new InterviewQuestion(
                savedInterview,
                order++,
                item.getQuestionText(),
                item.getTopic(),
                item.getDifficulty(),
                concepts,
                item.getSampleIdealAnswer()
            );
            questionsToSave.add(q);
        }

        List<InterviewQuestion> savedQuestions = questionRepository.saveAll(questionsToSave);
        return InterviewResponse.fromEntity(savedInterview, savedQuestions);
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewById(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to interview session.");
        }

        List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
        return InterviewResponse.fromEntity(interview, questions);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getUserInterviews(Long userId) {
        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return interviews.stream().map(InterviewResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void submitAnswer(Long interviewId, Long userId, SubmitAnswerRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this interview session.");
        }

        InterviewQuestion question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + request.getQuestionId()));

        if (question.getInterview() == null || !question.getInterview().getId().equals(interviewId)) {
            throw new BadRequestException("Question " + request.getQuestionId() + " does not belong to interview session: " + interviewId);
        }

        InterviewAnswer answer = answerRepository.findByInterviewIdAndQuestionId(interviewId, request.getQuestionId())
            .orElse(new InterviewAnswer(interview, question, request.getStudentAnswer()));

        answer.setStudentAnswer(request.getStudentAnswer());
        answerRepository.save(answer);
    }

    @Transactional
    public synchronized InterviewResponse completeInterview(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this interview.");
        }

        // Idempotent: If already completed and has score, return existing result without duplicate re-evaluation
        if ("COMPLETED".equals(interview.getStatus()) && interview.getTotalScore() != null) {
            List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
            return InterviewResponse.fromEntity(interview, questions);
        }

        // Preserve previous state in case evaluation throws an exception
        String previousStatus = interview.getStatus();
        LocalDateTime previousCompletedAt = interview.getCompletedAt();
        Integer previousScore = interview.getTotalScore();

        try {
            // Perform evaluations for all questions in this interview FIRST
            evaluationService.evaluateInterview(interview);

            // Mark COMPLETED and set completion timestamp ONLY after evaluation succeeds
            interview.setStatus("COMPLETED");
            if (interview.getCompletedAt() == null) {
                interview.setCompletedAt(LocalDateTime.now());
            }
            Interview savedInterview = interviewRepository.save(interview);

            List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
            return InterviewResponse.fromEntity(savedInterview, questions);
        } catch (Exception e) {
            // Restore previous valid state if evaluation fails
            interview.setStatus(previousStatus);
            interview.setCompletedAt(previousCompletedAt);
            interview.setTotalScore(previousScore);
            interviewRepository.save(interview);
            throw e;
        }
    }

    @Transactional
    public void deleteInterview(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this interview.");
        }

        interviewRepository.delete(interview);
    }
}
