package com.interviewprep;

import com.interviewprep.entity.Interview;
import com.interviewprep.entity.InterviewQuestion;
import com.interviewprep.entity.User;
import com.interviewprep.repository.InterviewQuestionRepository;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:mysql://localhost:3306/interviewprep_ai?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
    "spring.datasource.username=root",
    "spring.datasource.password=rootpassword",
    "spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver",
    "spring.jpa.hibernate.ddl-auto=validate",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect",
    "spring.flyway.enabled=true",
    "spring.flyway.baseline-on-migrate=true",
    "spring.flyway.locations=classpath:db/migration",
    "app.jwt.secret=test-secret-key-at-least-32-characters-long-for-testing-only-12345",
    "app.jwt.expiration-ms=86400000",
    "app.cors.allowed-origins=http://localhost:5173",
    "app.ai-service.url=http://localhost:8000"
})
public class MySqlSchemaIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private InterviewQuestionRepository questionRepository;

    @Test
    void testFlywayMigrationAndSchemaValidationWithMySql() {
        // 1. Verify demo user seeded by Flyway V1 migration exists
        Optional<User> demoUserOpt = userRepository.findByUsername("demouser");
        assertTrue(demoUserOpt.isPresent(), "Demo user seeded by Flyway V1 must exist");
        User demoUser = demoUserOpt.get();
        assertEquals("demo@interviewprep.ai", demoUser.getEmail());
        assertEquals("ROLE_USER", demoUser.getRole());

        // 2. Verify JPA entity creation & repository relationship with MySQL
        Interview interview = new Interview(demoUser, "Spring Boot", "Advanced", "Technical", 3);
        interview = interviewRepository.save(interview);
        assertNotNull(interview.getId());

        InterviewQuestion question = new InterviewQuestion(
            interview, 1, "Explain Spring Security filter chain", "Security", "Advanced", "FilterChain,AuthenticationManager", "Sample answer"
        );
        question = questionRepository.save(question);
        assertNotNull(question.getId());

        // 3. Verify relations
        List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interview.getId());
        assertEquals(1, questions.size());
        assertEquals("Security", questions.get(0).getTopic());

        // Clean up test interview
        interviewRepository.delete(interview);
    }
}
