from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Any


class EvaluationRequest(BaseModel):
    question: str = Field(..., min_length=3, description="The interview question that was asked")
    expectedConcepts: List[str] = Field(default_factory=list, description="Keywords and concepts expected in the response")
    studentAnswer: str = Field(..., description="The student's submitted response")
    technology: str = Field(default="General", description="The technology stack (e.g. Java, Python, React)")


class EvaluationResponse(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Overall score out of 100")
    correctness: int = Field(..., ge=0, le=100, description="Technical accuracy and correctness (0-100)")
    relevance: int = Field(..., ge=0, le=100, description="Direct relevance to the question (0-100)")
    completeness: int = Field(..., ge=0, le=100, description="Thoroughness and conceptual depth (0-100)")
    strengths: List[str] = Field(default_factory=list, description="Specific strengths identified in the answer")
    weaknesses: List[str] = Field(default_factory=list, description="Specific areas of weakness or omissions")
    missingConcepts: List[str] = Field(default_factory=list, description="Expected concepts missed or omitted")
    missedConcepts: List[str] = Field(default_factory=list, description="Alias for missingConcepts")
    matchedConcepts: List[str] = Field(default_factory=list, description="Expected concepts successfully covered")
    improvements: List[str] = Field(default_factory=list, description="Actionable recommendations for improvement")
    improvementSuggestions: List[str] = Field(default_factory=list, description="Alias for improvements")
    modelAnswer: str = Field(..., min_length=1, description="Benchmark model answer for student study")
    explanation: str = Field(default="", description="Detailed explanation of the awarded marks")
    provider: str = Field(default="mock", description="AI provider used for evaluation (e.g. gemini, mock)")

    @field_validator("score", "correctness", "relevance", "completeness", mode="before")
    def validate_percentages(cls, v: Any) -> int:
        if v is None:
            raise ValueError("Score value cannot be None.")
        try:
            val = float(v)
        except (ValueError, TypeError):
            raise ValueError(f"Score must be a numeric value, got: {v}")

        int_val = int(round(val))
        if int_val < 0 or int_val > 100:
            raise ValueError(f"Score value {int_val} is outside the allowed range of 0 to 100.")
        return int_val
