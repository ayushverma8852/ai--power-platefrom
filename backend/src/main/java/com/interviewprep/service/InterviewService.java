package com.interviewprep.service;

import com.interviewprep.dto.*;

import java.util.List;

public interface InterviewService {
    InterviewResponse createInterview(InterviewCreateRequest request);
    InterviewResponse getInterview(String interviewId);
    AnswerSubmitResponse submitAnswer(String interviewId, AnswerSubmitRequest request);
    EvaluationResponse completeInterview(String interviewId, InterviewCompleteRequest request);
    EvaluationResponse getEvaluationResults(String interviewId);
    List<InterviewHistoryItem> getInterviewHistory(String search, String difficulty);
}
