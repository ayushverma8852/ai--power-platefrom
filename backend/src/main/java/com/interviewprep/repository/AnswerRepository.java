package com.interviewprep.repository;

import com.interviewprep.entity.AnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<AnswerEntity, String> {
    Optional<AnswerEntity> findByQuestionId(String questionId);
    List<AnswerEntity> findByInterviewId(String interviewId);
    long countByInterviewId(String interviewId);
}
