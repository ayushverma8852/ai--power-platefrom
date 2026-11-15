package com.interviewprep.repository;

import com.interviewprep.entity.InterviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<InterviewEntity, String> {

    List<InterviewEntity> findAllByOrderByCreatedAtDesc();

    @Query("SELECT AVG(i.finalScore) FROM InterviewEntity i WHERE i.finalScore IS NOT NULL")
    Double findAverageScore();

    @Query("SELECT COUNT(i) FROM InterviewEntity i WHERE i.status = 'COMPLETED'")
    long countCompletedInterviews();

    @Query("SELECT i FROM InterviewEntity i WHERE i.status = 'COMPLETED' ORDER BY i.completedAt DESC")
    List<InterviewEntity> findTop5RecentCompleted();
}
