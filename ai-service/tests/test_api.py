import pytest
import httpx
from app.main import app
from app.services.ai_provider import GeminiAIProvider, MockAIProvider
from app.config.settings import settings


@pytest.fixture
def anyio_backend():
    return 'asyncio'


@pytest.fixture
async def client():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as c:
        yield c


@pytest.mark.anyio
async def test_health_endpoint(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert "uptimeSeconds" in data
    assert data["provider"] in ["mock", "gemini"]


@pytest.mark.anyio
async def test_root_endpoint(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "/health" in data["endpoints"]["health"]


@pytest.mark.anyio
async def test_generate_questions_java(client):
    payload = {
        "technology": "Java",
        "difficulty": "Intermediate",
        "interviewType": "Technical",
        "numberOfQuestions": 3
    }
    response = await client.post("/api/v1/questions/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["technology"] == "Java"
    assert len(data["questions"]) == 3
    first_q = data["questions"][0]
    assert "questionId" in first_q
    assert "questionText" in first_q
    assert "topic" in first_q
    assert isinstance(first_q["expectedConcepts"], list)


@pytest.mark.anyio
async def test_generate_questions_python(client):
    payload = {
        "technology": "Python",
        "difficulty": "Beginner",
        "interviewType": "Technical",
        "numberOfQuestions": 2
    }
    response = await client.post("/api/v1/questions/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) == 2


@pytest.mark.anyio
async def test_evaluate_answer_thorough(client):
    payload = {
        "question": "What is the difference between HashMap and ConcurrentHashMap?",
        "expectedConcepts": ["thread safety", "synchronization", "segment locking", "performance", "null keys"],
        "studentAnswer": "HashMap is not synchronized and not thread safe. In contrast, ConcurrentHashMap achieves thread safety through segment locking and bucket level synchronization, allowing concurrent reads and writes without locking the whole map.",
        "technology": "Java"
    }
    response = await client.post("/api/v1/evaluation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["score"] <= 100
    assert 0 <= data["correctness"] <= 100
    assert 0 <= data["relevance"] <= 100
    assert 0 <= data["completeness"] <= 100
    assert len(data["strengths"]) > 0
    assert "modelAnswer" in data
    assert "explanation" in data
    assert len(data["matchedConcepts"]) >= 2
    assert "missingConcepts" in data


@pytest.mark.anyio
async def test_evaluate_answer_empty(client):
    payload = {
        "question": "Explain React hooks.",
        "expectedConcepts": ["useState", "useEffect", "lifecycle"],
        "studentAnswer": "",
        "technology": "React"
    }
    response = await client.post("/api/v1/evaluation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 0
    assert len(data["weaknesses"]) > 0


@pytest.mark.anyio
async def test_evaluate_invalid_request(client):
    payload = {
        "question": "",
        "expectedConcepts": ["useState"],
        "studentAnswer": "answer",
        "technology": "React"
    }
    response = await client.post("/api/v1/evaluation/evaluate", json=payload)
    assert response.status_code in [400, 422]


@pytest.mark.anyio
async def test_gemini_provider_fails_on_error_without_mock_fallback():
    # Mock transport returning 401 Unauthorized from Gemini
    def handler(request: httpx.Request):
        return httpx.Response(401, json={"error": {"message": "API key not valid"}})

    mock_client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    provider = GeminiAIProvider(api_key="INVALID_TEST_KEY", model_name="gemini-1.5-flash", client=mock_client)

    # Must raise RuntimeError, NOT silently return mock questions!
    with pytest.raises(RuntimeError) as exc_info:
        await provider.generate_questions("Java", "Intermediate", "Technical", 2)
    assert "Gemini API returned HTTP 401" in str(exc_info.value)


@pytest.mark.anyio
async def test_gemini_provider_parses_and_validates_with_pydantic():
    gemini_json_content = """[
        {
            "questionId": "q-gem-01",
            "questionText": "What is the Java Memory Model and happens-before guarantee?",
            "topic": "Concurrency",
            "difficulty": "Intermediate",
            "expectedConcepts": ["happens-before", "volatile", "visibility", "reordering"],
            "sampleIdealAnswer": "The Java Memory Model defines how threads interact through memory..."
        }
    ]"""

    def handler(request: httpx.Request):
        return httpx.Response(200, json={
            "candidates": [{
                "content": {
                    "parts": [{"text": gemini_json_content}]
                }
            }]
        })

    mock_client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    provider = GeminiAIProvider(api_key="VALID_TEST_KEY", model_name="gemini-1.5-flash", client=mock_client)

    questions = await provider.generate_questions("Java", "Intermediate", "Technical", 1)
    assert len(questions) == 1
    assert questions[0].questionId == "q-gem-01"
    assert "happens-before" in questions[0].expectedConcepts
    assert questions[0].difficulty == "Intermediate"


@pytest.mark.anyio
async def test_gemini_provider_rejects_missing_api_key():
    with pytest.raises(ValueError) as exc:
        GeminiAIProvider(api_key="")
    assert "GEMINI_API_KEY must not be empty" in str(exc.value)


@pytest.mark.anyio
async def test_gemini_provider_rejects_incomplete_evaluation_json():
    # Incomplete response: missing "score" and "modelAnswer"
    incomplete_json = """{
        "correctness": 80,
        "relevance": 90,
        "completeness": 75,
        "strengths": ["Clear explanation"]
    }"""

    def handler(request: httpx.Request):
        return httpx.Response(200, json={
            "candidates": [{
                "content": {
                    "parts": [{"text": incomplete_json}]
                }
            }]
        })

    mock_client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    provider = GeminiAIProvider(api_key="VALID_TEST_KEY", client=mock_client)

    with pytest.raises(RuntimeError) as exc:
        await provider.evaluate_answer(
            question="Explain polymophism",
            expected_concepts=["polymorphism"],
            student_answer="Polymorphism is many forms",
            technology="Java"
        )
    assert "missing required fields" in str(exc.value)
    assert "score" in str(exc.value)


@pytest.mark.anyio
async def test_gemini_provider_succeeds_with_complete_evaluation():
    complete_json = """{
        "score": 88,
        "correctness": 90,
        "relevance": 85,
        "completeness": 89,
        "strengths": ["Accurate definition", "Good terminology"],
        "weaknesses": ["Could mention dynamic binding"],
        "missingConcepts": ["runtime"],
        "matchedConcepts": ["polymorphism", "inheritance"],
        "improvements": ["Study runtime dispatch in JVM"],
        "modelAnswer": "Polymorphism enables objects to be treated as instances of their parent class.",
        "explanation": "Clear understanding demonstrated with minor omissions."
    }"""

    def handler(request: httpx.Request):
        return httpx.Response(200, json={
            "candidates": [{
                "content": {
                    "parts": [{"text": complete_json}]
                }
            }]
        })

    mock_client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    provider = GeminiAIProvider(api_key="VALID_TEST_KEY", client=mock_client)

    result = await provider.evaluate_answer(
        question="Explain polymorphism",
        expected_concepts=["polymorphism", "inheritance", "runtime"],
        student_answer="Polymorphism is many forms via inheritance",
        technology="Java"
    )

    assert result.score == 88
    assert result.correctness == 90
    assert result.modelAnswer.startswith("Polymorphism enables")
    assert result.provider == "gemini"
    assert "runtime" in result.missingConcepts


def test_production_mode_rejects_mock_and_demo():
    from app.config.settings import Settings
    # Production forbids mock AI provider
    with pytest.raises(ValueError) as exc1:
        Settings(ENVIRONMENT="production", AI_PROVIDER="mock")
    assert "AI_PROVIDER cannot be 'mock' in production" in str(exc1.value)

    # Production forbids demo mode
    with pytest.raises(ValueError) as exc2:
        Settings(ENVIRONMENT="production", AI_PROVIDER="gemini", GEMINI_API_KEY="test-key", DEMO_MODE=True)
    assert "DEMO_MODE cannot be enabled in production" in str(exc2.value)


def test_gemini_provider_requires_gemini_api_key():
    from app.config.settings import Settings
    with pytest.raises(ValueError) as exc:
        Settings(ENVIRONMENT="development", AI_PROVIDER="gemini", GEMINI_API_KEY="")
    assert "GEMINI_API_KEY is required" in str(exc.value)


def test_evaluation_response_rejects_scores_outside_0_to_100():
    from app.models.evaluation import EvaluationResponse
    from pydantic import ValidationError

    valid_payload = {
        "score": 85,
        "correctness": 90,
        "relevance": 85,
        "completeness": 80,
        "modelAnswer": "Benchmark answer"
    }

    # Negative score should be strictly rejected (not clamped to 0)
    invalid_neg = {**valid_payload, "score": -15}
    with pytest.raises(ValidationError) as exc_neg:
        EvaluationResponse.model_validate(invalid_neg)
    assert "outside the allowed range" in str(exc_neg.value) or "greater than or equal to 0" in str(exc_neg.value)

    # Score > 100 should be strictly rejected (not clamped to 100)
    invalid_over = {**valid_payload, "score": 125}
    with pytest.raises(ValidationError) as exc_over:
        EvaluationResponse.model_validate(invalid_over)
    assert "outside the allowed range" in str(exc_over.value) or "less than or equal to 100" in str(exc_over.value)

    # Negative sub-score should be strictly rejected
    invalid_sub = {**valid_payload, "correctness": -5}
    with pytest.raises(ValidationError) as exc_sub:
        EvaluationResponse.model_validate(invalid_sub)
    assert "outside the allowed range" in str(exc_sub.value)


