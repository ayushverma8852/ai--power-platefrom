package com.interviewprep;

import com.interviewprep.dto.CreateInterviewRequest;
import com.interviewprep.dto.InterviewResponse;
import com.interviewprep.dto.SubmitAnswerRequest;
import com.interviewprep.dto.ai.AiQuestionItemDto;
import com.interviewprep.entity.Interview;
import com.interviewprep.entity.InterviewAnswer;
import com.interviewprep.entity.InterviewQuestion;
import com.interviewprep.entity.User;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.repository.InterviewAnswerRepository;
import com.interviewprep.repository.InterviewQuestionRepository;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AiServiceClient;
import com.interviewprep.service.EvaluationService;
import com.interviewprep.service.InterviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTests {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private InterviewQuestionRepository questionRepository;

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AiServiceClient aiServiceClient;

    @Mock
    private EvaluationService evaluationService;

    @InjectMocks
    private InterviewService interviewService;

    private User testUser;
    private User otherUser;
    private Interview testInterview;

    @BeforeEach
    void setUp() {
        testUser = new User("student1", "student1@test.com", "pass123", "Student One");
        testUser.setId(1L);

        otherUser = new User("student2", "student2@test.com", "pass456", "Student Two");
        otherUser.setId(2L);

        testInterview = new Interview(testUser, "Java", "Intermediate", "Technical", 2);
        testInterview.setId(100L);
    }

    @Test
    void testCreateInterviewWithAiQuestions() {
        CreateInterviewRequest request = new CreateInterviewRequest();
        request.setTechnology("Java");
        request.setDifficulty("Intermediate");
        request.setInterviewType("Technical");
        request.setNumberOfQuestions(2);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(interviewRepository.save(any(Interview.class))).thenReturn(testInterview);

        AiQuestionItemDto q1 = new AiQuestionItemDto();
        q1.setQuestionText("Explain Java Memory");
        q1.setTopic("Memory Management");
        q1.setDifficulty("Intermediate");
        q1.setExpectedConcepts(List.of("heap", "stack"));

        AiQuestionItemDto q2 = new AiQuestionItemDto();
        q2.setQuestionText("Explain OOP");
        q2.setTopic("OOP");
        q2.setDifficulty("Intermediate");
        q2.setExpectedConcepts(List.of("polymorphism", "inheritance"));

        when(aiServiceClient.generateQuestions("Java", "Intermediate", "Technical", 2))
            .thenReturn(List.of(q1, q2));

        InterviewQuestion savedQ1 = new InterviewQuestion(testInterview, 1, q1.getQuestionText(), q1.getTopic(), "Intermediate", "heap,stack", "");
        InterviewQuestion savedQ2 = new InterviewQuestion(testInterview, 2, q2.getQuestionText(), q2.getTopic(), "Intermediate", "polymorphism,inheritance", "");
        when(questionRepository.saveAll(anyList())).thenReturn(List.of(savedQ1, savedQ2));

        InterviewResponse response = interviewService.createInterview(1L, request);

        assertNotNull(response);
        assertEquals("Java", response.getTechnology());
        assertEquals("Intermediate", response.getDifficulty());
        verify(interviewRepository, times(1)).save(any(Interview.class));
        verify(questionRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testSubmitAnswerSuccessfully() {
        SubmitAnswerRequest request = new SubmitAnswerRequest(50L, "Java heap stores objects and stack stores frames.");

        InterviewQuestion question = new InterviewQuestion(testInterview, 1, "Explain Java Memory", "Memory", "Intermediate", "heap,stack", "");
        question.setId(50L);

        when(interviewRepository.findById(100L)).thenReturn(Optional.of(testInterview));
        when(questionRepository.findById(50L)).thenReturn(Optional.of(question));
        when(answerRepository.findByInterviewIdAndQuestionId(100L, 50L)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> interviewService.submitAnswer(100L, 1L, request));
        verify(answerRepository, times(1)).save(any(InterviewAnswer.class));
    }

    @Test
    void testUserIsolationPreventsUnauthorizedAccess() {
        when(interviewRepository.findById(100L)).thenReturn(Optional.of(testInterview));

        // Attempting to access testInterview (owned by User 1) with User 2 credentials
        assertThrows(BadRequestException.class, () -> {
            interviewService.getInterviewById(100L, 2L);
        });

        SubmitAnswerRequest req = new SubmitAnswerRequest(50L, "answer");
        assertThrows(BadRequestException.class, () -> {
            interviewService.submitAnswer(100L, 2L, req);
        });

        assertThrows(BadRequestException.class, () -> {
            interviewService.completeInterview(100L, 2L);
        });

        assertThrows(BadRequestException.class, () -> {
            interviewService.deleteInterview(100L, 2L);
        });
    }

    @Test
    void testSubmitAnswerWithMismatchedQuestionFails() {
        Interview anotherInterview = new Interview(testUser, "Python", "Beginner", "Technical", 1);
        anotherInterview.setId(200L);

        InterviewQuestion foreignQuestion = new InterviewQuestion(anotherInterview, 1, "Explain Python list", "Lists", "Beginner", "list", "");
        foreignQuestion.setId(999L);

        SubmitAnswerRequest request = new SubmitAnswerRequest(999L, "A list is dynamic.");

        when(interviewRepository.findById(100L)).thenReturn(Optional.of(testInterview));
        when(questionRepository.findById(999L)).thenReturn(Optional.of(foreignQuestion));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
            interviewService.submitAnswer(100L, 1L, request)
        );
        assertTrue(ex.getMessage().contains("does not belong to interview session"));
        verify(answerRepository, never()).save(any(InterviewAnswer.class));
    }

    @Test
    void testCompleteInterviewIdempotency() {
        testInterview.setStatus("COMPLETED");
        testInterview.setTotalScore(85);

        InterviewQuestion q1 = new InterviewQuestion(testInterview, 1, "Explain Java Memory", "Memory", "Intermediate", "heap,stack", "");
        q1.setId(50L);

        when(interviewRepository.findById(100L)).thenReturn(Optional.of(testInterview));
        when(questionRepository.findByInterviewIdOrderByQuestionOrderAsc(100L)).thenReturn(List.of(q1));

        InterviewResponse response = interviewService.completeInterview(100L, 1L);

        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
        assertEquals(85, response.getTotalScore());
        // Verify evaluationService is NOT re-invoked
        verify(evaluationService, never()).evaluateInterview(any(Interview.class));
    }

    @Test
    void testCompleteInterviewFailurePreservesPreviousState() {
        testInterview.setStatus("IN_PROGRESS");
        testInterview.setTotalScore(null);

        when(interviewRepository.findById(100L)).thenReturn(Optional.of(testInterview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(i -> i.getArgument(0));
        doThrow(new RuntimeException("AI microservice timeout")).when(evaluationService).evaluateInterview(testInterview);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            interviewService.completeInterview(100L, 1L)
        );

        assertEquals("AI microservice timeout", ex.getMessage());
        assertEquals("IN_PROGRESS", testInterview.getStatus());
        assertNull(testInterview.getTotalScore());
        assertNull(testInterview.getCompletedAt());
    }

    @Test
    void testCompleteInterviewSuccessMarksCompleted() {
        testInterview.setStatus("IN_PROGRESS");
        testInterview.setTotalScore(null);

        InterviewQuestion q1 = new InterviewQuestion(testInterview, 1, "Explain Java Memory", "Memory", "Intermediate", "heap,stack", "");
        q1.setId(50L);

        when(interviewRepository.findById(100L)).thenReturn(Optional.of(testInterview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(i -> i.getArgument(0));
        when(questionRepository.findByInterviewIdOrderByQuestionOrderAsc(100L)).thenReturn(List.of(q1));
        doAnswer(inv -> {
            testInterview.setTotalScore(92);
            return null;
        }).when(evaluationService).evaluateInterview(testInterview);

        InterviewResponse response = interviewService.completeInterview(100L, 1L);

        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
        assertEquals(92, response.getTotalScore());
        assertNotNull(testInterview.getCompletedAt());
        verify(evaluationService, times(1)).evaluateInterview(testInterview);
    }

    @Test
    void testGetUserInterviewHistory() {
        when(interviewRepository.findByUserIdOrderByCreatedAtDesc(1L))
            .thenReturn(List.of(testInterview));

        List<InterviewResponse> history = interviewService.getUserInterviews(1L);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals(100L, history.get(0).getId());
    }
}
