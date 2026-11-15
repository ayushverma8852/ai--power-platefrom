package com.interviewprep.dto;

import jakarta.validation.constraints.NotBlank;

public record AnswerSubmitRequest(
    @NotBlank(message = "Question ID is required")
    String questionId,

    String answerText
) {}
