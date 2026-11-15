package com.interviewprep.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "evaluations")
public class EvaluationEntity {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private InterviewEntity interview;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore = 0;

    @Column(length = 50)
    private String grade = "Strong Hire";

    @Column(name = "summary_headline", columnDefinition = "TEXT")
    private String summaryHeadline;

    @Column(name = "tech_score")
    private Integer technicalAccuracyScore = 80;

    @Column(name = "comm_score")
    private Integer communicationScore = 80;

    @Column(name = "problem_score")
    private Integer problemSolvingScore = 80;

    @Column(name = "depth_score")
    private Integer depthScore = 80;

    @Column(columnDefinition = "TEXT")
    private String strengthsJson; // Stored as JSON string

    @Column(name = "improvements_json", columnDefinition = "TEXT")
    private String improvementsJson; // Stored as JSON string

    @Column(name = "resources_json", columnDefinition = "TEXT")
    private String resourcesJson; // Stored as JSON string

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("questionNumber ASC")
    private List<QuestionReviewEntity> questionReviews = new ArrayList<>();

    public EvaluationEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public InterviewEntity getInterview() { return interview; }
    public void setInterview(InterviewEntity interview) { this.interview = interview; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSummaryHeadline() { return summaryHeadline; }
    public void setSummaryHeadline(String summaryHeadline) { this.summaryHeadline = summaryHeadline; }

    public Integer getTechnicalAccuracyScore() { return technicalAccuracyScore; }
    public void setTechnicalAccuracyScore(Integer technicalAccuracyScore) { this.technicalAccuracyScore = technicalAccuracyScore; }

    public Integer getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }

    public Integer getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(Integer problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }

    public Integer getDepthScore() { return depthScore; }
    public void setDepthScore(Integer depthScore) { this.depthScore = depthScore; }

    public String getStrengthsJson() { return strengthsJson; }
    public void setStrengthsJson(String strengthsJson) { this.strengthsJson = strengthsJson; }

    public String getImprovementsJson() { return improvementsJson; }
    public void setImprovementsJson(String improvementsJson) { this.improvementsJson = improvementsJson; }

    public String getResourcesJson() { return resourcesJson; }
    public void setResourcesJson(String resourcesJson) { this.resourcesJson = resourcesJson; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<QuestionReviewEntity> getQuestionReviews() { return questionReviews; }
    public void setQuestionReviews(List<QuestionReviewEntity> questionReviews) { this.questionReviews = questionReviews; }
}
