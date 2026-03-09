from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "ArogyaSatya Agentic Misinformation Engine"
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    # Use SQLite by default for local hackathon setup; override in production.
    DATABASE_URL: str = "sqlite+aiosqlite:///./truelen.db"
    GROQ_API_KEY: str = ""

    # Frontend/ops-facing settings
    FRONTEND_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    ENABLE_SQL_ECHO: bool = False


settings = Settings()
