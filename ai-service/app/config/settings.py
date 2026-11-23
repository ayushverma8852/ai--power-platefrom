from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, model_validator
from typing import Optional, Union, List
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    APP_NAME: str = "InterviewPrep AI - AI Microservice"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # AI Provider configuration: "gemini", "openai", or "mock"
    # Live AI mode (gemini) is the required production configuration
    AI_PROVIDER: str = "gemini"
    DEMO_MODE: bool = False

    # Google Gemini Settings
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # OpenAI Settings
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @model_validator(mode="after")
    def validate_configuration(self) -> "Settings":
        env = (self.ENVIRONMENT or "").lower().strip()
        provider = (self.AI_PROVIDER or "").lower().strip()

        # In production, live AI is strictly required; mock mode and demo mode are prohibited
        if env == "production":
            if provider == "mock":
                raise ValueError(
                    "Production configuration error: AI_PROVIDER cannot be 'mock' in production. "
                    "A live AI provider (such as 'gemini') is required."
                )
            if self.DEMO_MODE:
                raise ValueError("Production configuration error: DEMO_MODE cannot be enabled in production.")

        # Require API key when provider is gemini
        if provider == "gemini":
            if not self.GEMINI_API_KEY or not self.GEMINI_API_KEY.strip():
                raise ValueError(
                    "GEMINI_API_KEY is required when AI_PROVIDER is set to 'gemini'."
                )

        # Mock mode is strictly an explicit development/testing choice
        if provider == "mock":
            allowed_envs = {"development", "dev", "test", "testing", "local"}
            if env not in allowed_envs:
                raise ValueError(
                    f"Mock AI provider is an explicit development/testing choice and cannot be used in environment '{self.ENVIRONMENT}'."
                )

        return self

    DEBUG: bool = True


settings = Settings()
