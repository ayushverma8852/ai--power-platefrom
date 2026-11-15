package com.interviewprep.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record InterviewResponse(
    String id,
    String roleTitle,
    String experienceLevel,
    String difficulty,
    String skillsSummary,
    Integer questionCount,
    Integer durationSeconds,
    String status,
    Integer finalScore,
    Instant createdAt,
    Instant completedAt,
    List<QuestionDto> questions,
    Map<String, String> answers
) {}
