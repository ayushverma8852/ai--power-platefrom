package com.interviewprep.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interviews")
public class InterviewEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "role_title", nullable = false, length = 150)
    private String roleTitle;

    @Column(name = "experience_level", nullable = false, length = 80)
    private String experienceLevel;

    @Column(nullable = false, length = 30)
    private String difficulty;

    @Column(name = "skills_summary", length = 300)
    private String skillsSummary;

    @Column(name = "question_count", nullable = false)
    private Integer questionCount = 5;

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Column(nullable = false, length = 30)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, ABANDONED

    @Column(name = "final_score")
    private Integer finalScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("questionNumber ASC")
    private List<QuestionEntity> questions = new ArrayList<>();

    @OneToOne(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private EvaluationEntity evaluation;

    public InterviewEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getSkillsSummary() { return skillsSummary; }
    public void setSkillsSummary(String skillsSummary) { this.skillsSummary = skillsSummary; }

    public Integer getQuestionCount() { return questionCount; }
    public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getFinalScore() { return finalScore; }
    public void setFinalScore(Integer finalScore) { this.finalScore = finalScore; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public List<QuestionEntity> getQuestions() { return questions; }
    public void setQuestions(List<QuestionEntity> questions) { this.questions = questions; }

    public EvaluationEntity getEvaluation() { return evaluation; }
    public void setEvaluation(EvaluationEntity evaluation) { this.evaluation = evaluation; }
}
