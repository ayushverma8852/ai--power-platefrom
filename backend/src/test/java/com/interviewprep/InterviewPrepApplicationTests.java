package com.interviewprep;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("dev")
@TestPropertySource(properties = "app.jwt.secret=test-secret-key-at-least-32-characters-long-for-testing-only-12345")
class InterviewPrepApplicationTests {

    @Test
    void contextLoads() {
    }
}
