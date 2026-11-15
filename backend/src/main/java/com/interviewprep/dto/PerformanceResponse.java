package com.interviewprep.dto;

import java.util.List;

public record PerformanceResponse(
    int overallReadiness,
    int trendPercentage,
    int placementBenchmark,
    String strongestTopic,
    List<TopicMastery> topicMastery
) {
    public record TopicMastery(
        String name,
        int score,
        int benchmark
    ) {}
}
