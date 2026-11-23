package com.interviewprep.service;

import com.interviewprep.dto.ai.*;
import com.interviewprep.exception.AiServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;

@Service
public class AiServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceClient.class);
    private final WebClient aiServiceWebClient;

    public AiServiceClient(WebClient aiServiceWebClient) {
        this.aiServiceWebClient = aiServiceWebClient;
    }

    public List<AiQuestionItemDto> generateQuestions(String technology, String difficulty, String interviewType, int count) {
        AiGenerateQuestionsRequest request = new AiGenerateQuestionsRequest(
            technology, difficulty, interviewType, count
        );

        try {
            AiGenerateQuestionsResponse response = aiServiceWebClient.post()
                .uri("/api/v1/questions/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiGenerateQuestionsResponse.class)
                .timeout(Duration.ofSeconds(25))
                .block();

            if (response != null && response.getQuestions() != null && !response.getQuestions().isEmpty()) {
                return response.getQuestions();
            }
            throw new AiServiceException("AI microservice returned empty questions list for " + technology);
        } catch (AiServiceException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("AI microservice call failed while generating questions: {}", ex.getMessage());
            throw new AiServiceException("AI service unavailable: " + ex.getMessage(), ex);
        }
    }

    public AiEvaluationResponse evaluateAnswer(String question, List<String> expectedConcepts, String studentAnswer, String technology) {
        AiEvaluationRequest request = new AiEvaluationRequest(question, expectedConcepts, studentAnswer, technology);

        try {
            AiEvaluationResponse response = aiServiceWebClient.post()
                .uri("/api/v1/evaluation/evaluate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiEvaluationResponse.class)
                .timeout(Duration.ofSeconds(30))
                .block();

            if (response != null) {
                return response;
            }
            throw new AiServiceException("AI microservice returned null evaluation response");
        } catch (AiServiceException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("AI microservice evaluation call failed: {}", ex.getMessage());
            throw new AiServiceException("AI evaluation service unavailable: " + ex.getMessage(), ex);
        }
    }
}
