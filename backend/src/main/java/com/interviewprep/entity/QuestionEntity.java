package com.interviewprep.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class QuestionEntity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private InterviewEntity interview;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(length = 100)
    private String category;

    @Column(length = 150)
    private String topic;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String hint;

    @Column(name = "evaluation_criteria", columnDefinition = "TEXT")
    private String evaluationCriteria; // JSON or newline separated criteria

    @Column(name = "sample_ideal_answer", columnDefinition = "TEXT")
    private String sampleIdealAnswer;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private AnswerEntity answer;

    public QuestionEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public InterviewEntity getInterview() { return interview; }
    public void setInterview(InterviewEntity interview) { this.interview = interview; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getHint() { return hint; }
    public void setHint(String hint) { this.hint = hint; }

    public String getEvaluationCriteria() { return evaluationCriteria; }
    public void setEvaluationCriteria(String evaluationCriteria) { this.evaluationCriteria = evaluationCriteria; }

    public String getSampleIdealAnswer() { return sampleIdealAnswer; }
    public void setSampleIdealAnswer(String sampleIdealAnswer) { this.sampleIdealAnswer = sampleIdealAnswer; }

    public AnswerEntity getAnswer() { return answer; }
    public void setAnswer(AnswerEntity answer) { this.answer = answer; }
}
