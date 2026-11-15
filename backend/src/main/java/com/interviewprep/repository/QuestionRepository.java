package com.interviewprep.repository;

import com.interviewprep.entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, String> {
    List<QuestionEntity> findByInterviewIdOrderByQuestionNumberAsc(String interviewId);
    Optional<QuestionEntity> findByIdAndInterviewId(String id, String interviewId);
}
