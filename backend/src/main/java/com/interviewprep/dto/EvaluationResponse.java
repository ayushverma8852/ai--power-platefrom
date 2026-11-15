package com.interviewprep.dto;

import java.util.List;

public record EvaluationResponse(
    String id,
    String interviewId,
    String roleTitle,
    String difficulty,
    String date,
    String completedAt,
    Integer durationMinutes,
    Integer overallScore,
    String grade,
    String summaryHeadline,
    List<MetricScore> detailedMetrics,
    List<String> strengths,
    List<String> areasForImprovement,
    List<ResourceItem> recommendedResources,
    List<QuestionReviewItem> questionReviews
) {
    public record MetricScore(
        String name,
        Integer score,
        Integer maxScore,
        String label
    ) {}

    public record ResourceItem(
        String title,
        String url,
        String type
    ) {}

    public record QuestionReviewItem(
        Integer questionNumber,
        String topic,
        String question,
        String candidateAnswer,
        Integer score,
        String feedback,
        List<String> keyPointsCovered
    ) {}
}
