package com.interviewprep.controller;

import com.interviewprep.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller providing health check and status endpoints.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> checkHealth() {
        HealthResponse response = HealthResponse.ok(
            "InterviewPrep AI Backend is running smoothly."
        );
        return ResponseEntity.ok(response);
    }
}
