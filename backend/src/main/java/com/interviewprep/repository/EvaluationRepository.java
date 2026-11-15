package com.interviewprep.repository;

import com.interviewprep.entity.EvaluationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<EvaluationEntity, String> {
    Optional<EvaluationEntity> findByInterviewId(String interviewId);
}
