package com.interviewprep.dto;

import java.util.List;

public record DashboardResponse(
    long totalInterviews,
    int averageScore,
    String strongestSkill,
    String currentStreak,
    List<DayScore> weeklyPerformance,
    List<RecentActivityItem> recentActivities
) {
    public record DayScore(
        String day,
        int score
    ) {}

    public record RecentActivityItem(
        String id,
        String type,
        String title,
        String subtitle,
        String timeAgo,
        Integer score
    ) {}
}
