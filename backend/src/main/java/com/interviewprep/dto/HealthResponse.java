package com.interviewprep.dto;

import java.time.Instant;

/**
 * Data Transfer Object representing the health status response.
 */
public record HealthResponse(
    String status,
    String message,
    String service,
    String version,
    Instant timestamp
) {
    public static HealthResponse ok(String message) {
        return new HealthResponse(
            "UP",
            message,
            "interviewprep-backend",
            "1.0.0",
            Instant.now()
        );
    }
}
