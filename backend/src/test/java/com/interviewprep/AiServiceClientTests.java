package com.interviewprep;

import com.interviewprep.exception.AiServiceException;
import com.interviewprep.service.AiServiceClient;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AiServiceClientTests {

    @Test
    void testQuestionGenerationFailsWithoutSilentMockFallbackWhenServiceOffline() {
        WebClient mockWebClient = WebClient.builder().baseUrl("http://invalid-host:9999").build();
        AiServiceClient client = new AiServiceClient(mockWebClient);

        AiServiceException ex = assertThrows(AiServiceException.class, () -> {
            client.generateQuestions("Java", "Intermediate", "Technical", 3);
        });

        assertNotNull(ex.getMessage());
        assertTrue(ex.getMessage().contains("AI service unavailable"));
    }

    @Test
    void testEvaluationFailsWithoutSilentMockFallbackWhenServiceOffline() {
        WebClient mockWebClient = WebClient.builder().baseUrl("http://invalid-host:9999").build();
        AiServiceClient client = new AiServiceClient(mockWebClient);

        AiServiceException ex = assertThrows(AiServiceException.class, () -> {
            client.evaluateAnswer(
                "What is JVM heap memory?",
                List.of("heap", "objects", "garbage collection"),
                "Heap stores objects.",
                "Java"
            );
        });

        assertNotNull(ex.getMessage());
        assertTrue(ex.getMessage().contains("AI evaluation service unavailable"));
    }
}
