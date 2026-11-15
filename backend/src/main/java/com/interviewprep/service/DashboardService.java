package com.interviewprep.service;

import com.interviewprep.dto.DashboardResponse;
import com.interviewprep.dto.PerformanceResponse;

public interface DashboardService {
    DashboardResponse getDashboard();
    PerformanceResponse getPerformance();
}
