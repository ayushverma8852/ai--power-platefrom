package com.interviewprep.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record InterviewCreateRequest(
    @NotBlank(message = "Target job role is required")
    String roleTitle,

    @NotEmpty(message = "At least one skill must be provided")
    List<String> skills,

    @NotBlank(message = "Experience level is required")
    String experienceLevel,

    @NotBlank(message = "Difficulty level is required")
    String difficulty,

    @Min(value = 1, message = "Minimum question count is 1")
    @Max(value = 15, message = "Maximum question count is 15")
    Integer questionCount
) {}
