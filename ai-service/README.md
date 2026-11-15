# InterviewPrep AI — Python AI Microservice

FastAPI microservice for domain question formulation and candidate answer evaluation.

## Run Instructions

```bash
cd ai-service
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The service will run at:
👉 **`http://localhost:8000`**

### Endpoints
- `GET /health` — Service health check
- `POST /api/v1/generate-questions` — Dynamic role & skill question generation
- `POST /api/v1/evaluate-answers` — Automated AI evaluation and rubric scoring
