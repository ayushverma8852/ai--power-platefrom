package com.interviewprep.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "answers")
public class AnswerEntity {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionEntity question;

    @Column(name = "interview_id", nullable = false, length = 36)
    private String interviewId;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "word_count")
    private Integer wordCount = 0;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt = Instant.now();

    public AnswerEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public QuestionEntity getQuestion() { return question; }
    public void setQuestion(QuestionEntity question) { this.question = question; }

    public String getInterviewId() { return interviewId; }
    public void setInterviewId(String interviewId) { this.interviewId = interviewId; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) {
        this.answerText = answerText;
        if (answerText != null) {
            this.wordCount = answerText.trim().split("\\s+").length;
        }
    }

    public Integer getWordCount() { return wordCount; }
    public void setWordCount(Integer wordCount) { this.wordCount = wordCount; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
