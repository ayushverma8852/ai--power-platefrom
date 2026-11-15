package com.interviewprep.controller;

import com.interviewprep.dto.*;
import com.interviewprep.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    /**
     * POST /api/interviews
     * Initializes an interview session and generates/retrieves domain questions.
     */
    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewCreateRequest request) {
        InterviewResponse response = interviewService.createInterview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/interviews/{id}
     * Retrieves an active or past interview session with questions and answers.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterview(@PathVariable String id) {
        InterviewResponse response = interviewService.getInterview(id);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/interviews/{id}/answers
     * Submits or updates an answer for a specific question.
     */
    @PostMapping("/{id}/answers")
    public ResponseEntity<AnswerSubmitResponse> submitAnswer(
            @PathVariable String id,
            @Valid @RequestBody AnswerSubmitRequest request
    ) {
        AnswerSubmitResponse response = interviewService.submitAnswer(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/interviews/{id}/complete
     * Concludes the interview and triggers automated AI evaluation.
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<EvaluationResponse> completeInterview(
            @PathVariable String id,
            @RequestBody(required = false) InterviewCompleteRequest request
    ) {
        EvaluationResponse response = interviewService.completeInterview(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/interviews/{id}/results
     * Retrieves the AI evaluation scorecard and feedback report.
     */
    @GetMapping("/{id}/results")
    public ResponseEntity<EvaluationResponse> getEvaluationResults(@PathVariable String id) {
        EvaluationResponse response = interviewService.getEvaluationResults(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/interviews/history
     * Retrieves chronological list of mock interview attempts with scores.
     */
    @GetMapping("/history")
    public ResponseEntity<List<InterviewHistoryItem>> getHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty
    ) {
        List<InterviewHistoryItem> history = interviewService.getInterviewHistory(search, difficulty);
        return ResponseEntity.ok(history);
    }
}
