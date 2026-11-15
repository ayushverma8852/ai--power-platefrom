package com.interviewprep.dto;

import java.util.List;

public record InterviewHistoryItem(
    String id,
    String roleTitle,
    String experienceLevel,
    String date,
    String timeAgo,
    String difficulty,
    int questionCount,
    int durationMinutes,
    int score,
    String status,
    List<String> topicsCovered
) {}
