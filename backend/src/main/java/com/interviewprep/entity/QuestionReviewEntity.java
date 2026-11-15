package com.interviewprep.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "question_reviews")
public class QuestionReviewEntity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private EvaluationEntity evaluation;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(length = 150)
    private String topic;

    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "candidate_answer", columnDefinition = "TEXT")
    private String candidateAnswer;

    @Column(nullable = false)
    private Integer score = 80;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "key_points_json", columnDefinition = "TEXT")
    private String keyPointsCoveredJson; // Stored as JSON string

    public QuestionReviewEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public EvaluationEntity getEvaluation() { return evaluation; }
    public void setEvaluation(EvaluationEntity evaluation) { this.evaluation = evaluation; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCandidateAnswer() { return candidateAnswer; }
    public void setCandidateAnswer(String candidateAnswer) { this.candidateAnswer = candidateAnswer; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getKeyPointsCoveredJson() { return keyPointsCoveredJson; }
    public void setKeyPointsCoveredJson(String keyPointsCoveredJson) { this.keyPointsCoveredJson = keyPointsCoveredJson; }
}
