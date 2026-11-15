package com.interviewprep.controller;

import com.interviewprep.dto.DashboardResponse;
import com.interviewprep.dto.PerformanceResponse;
import com.interviewprep.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/dashboard
     * Returns KPI metrics, performance chart points, and recent activity items.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        DashboardResponse response = dashboardService.getDashboard();
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/performance
     * Returns technical competency and topic mastery metrics.
     */
    @GetMapping("/performance")
    public ResponseEntity<PerformanceResponse> getPerformance() {
        PerformanceResponse response = dashboardService.getPerformance();
        return ResponseEntity.ok(response);
    }
}
