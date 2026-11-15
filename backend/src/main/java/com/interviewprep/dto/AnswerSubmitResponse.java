package com.interviewprep.dto;

public record AnswerSubmitResponse(
    String questionId,
    boolean saved,
    long answeredCount,
    int totalQuestions
) {}
