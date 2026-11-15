package com.interviewprep.dto;

import java.util.List;

public record QuestionDto(
    String id,
    Integer questionNumber,
    String category,
    String topic,
    String question,
    String hint,
    List<String> evaluationCriteria,
    String sampleIdealAnswer,
    String candidateAnswer
) {}
