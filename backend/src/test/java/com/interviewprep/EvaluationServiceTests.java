package com.interviewprep;

import com.interviewprep.dto.ai.AiEvaluationResponse;
import com.interviewprep.entity.*;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.repository.*;
import com.interviewprep.service.AiServiceClient;
import com.interviewprep.service.EvaluationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EvaluationServiceTests {

    @Mock
    private EvaluationRepository evaluationRepository;

    @Mock
    private InterviewQuestionRepository questionRepository;

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private AiServiceClient aiServiceClient;

    @InjectMocks
    private EvaluationService evaluationService;

    private User testUser;
    private Interview testInterview;
    private InterviewQuestion q1;

    @BeforeEach
    void setUp() {
        testUser = new User("tester", "tester@test.com", "pass123", "Tester");
        testUser.setId(1L);

        testInterview = new Interview(testUser, "Java", "Intermediate", "Technical", 1);
        testInterview.setId(10L);

        q1 = new InterviewQuestion(testInterview, 1, "Explain Java Threads", "Concurrency", "Intermediate", "threads,runnable", "Ideal answer");
        q1.setId(101L);
    }

    @Test
    void testEvaluateInterviewPreventsDuplicateAiCallsWhenAlreadyEvaluated() {
        when(questionRepository.findByInterviewIdOrderByQuestionOrderAsc(10L)).thenReturn(List.of(q1));

        Evaluation existingEval = new Evaluation();
        existingEval.setScore(88);
        when(evaluationRepository.findByInterviewId(10L)).thenReturn(List.of(existingEval));

        evaluationService.evaluateInterview(testInterview);

        assertEquals(88, testInterview.getTotalScore());
        verify(aiServiceClient, never()).evaluateAnswer(any(), any(), any(), any());
        verify(evaluationRepository, never()).saveAll(any());
    }

    @Test
    void testEvaluateInterviewThrowsWhenNoQuestionsExist() {
        when(questionRepository.findByInterviewIdOrderByQuestionOrderAsc(10L)).thenReturn(List.of());

        assertThrows(BadRequestException.class, () ->
            evaluationService.evaluateInterview(testInterview)
        );
    }

    @Test
    void testEvaluateInterviewThrowsWhenAiReturnsNullScore() {
        when(questionRepository.findByInterviewIdOrderByQuestionOrderAsc(10L)).thenReturn(List.of(q1));
        when(evaluationRepository.findByInterviewId(10L)).thenReturn(List.of());

        InterviewAnswer ans = new InterviewAnswer(testInterview, q1, "Threads run concurrently.");
        when(answerRepository.findByInterviewIdAndQuestionId(10L, 101L)).thenReturn(Optional.of(ans));

        AiEvaluationResponse aiRes = new AiEvaluationResponse();
        aiRes.setScore(null); // Invalid AI response
        when(aiServiceClient.evaluateAnswer(any(), any(), any(), any())).thenReturn(aiRes);

        assertThrows(IllegalStateException.class, () ->
            evaluationService.evaluateInterview(testInterview)
        );

        verify(evaluationRepository, never()).saveAll(any());
    }

    @Test
    void testEvaluateInterviewSuccessPersistsTransactionally() {
        when(questionRepository.findByInterviewIdOrderByQuestionOrderAsc(10L)).thenReturn(List.of(q1));
        when(evaluationRepository.findByInterviewId(10L)).thenReturn(List.of());

        InterviewAnswer ans = new InterviewAnswer(testInterview, q1, "Threads run concurrently.");
        when(answerRepository.findByInterviewIdAndQuestionId(10L, 101L)).thenReturn(Optional.of(ans));

        AiEvaluationResponse aiRes = new AiEvaluationResponse();
        aiRes.setScore(90);
        aiRes.setCorrectness(95);
        aiRes.setRelevance(90);
        aiRes.setCompleteness(85);
        aiRes.setModelAnswer("Threads in Java are created via Thread class or Runnable interface.");
        aiRes.setExplanation("Well explained.");
        aiRes.setProvider("gemini");
        when(aiServiceClient.evaluateAnswer(any(), any(), any(), any())).thenReturn(aiRes);

        evaluationService.evaluateInterview(testInterview);

        assertEquals(90, testInterview.getTotalScore());
        verify(evaluationRepository, times(1)).saveAll(anyList());
        verify(interviewRepository, times(1)).save(testInterview);
    }
}
