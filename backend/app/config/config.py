from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "AI Career Platform"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend for AI Career Platform"

    # Database
    DATABASE_URL: str = "sqlite:///./career_platform.db"

    # Security
    SECRET_KEY: str = "CHANGE_THIS_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # APIs
    GEMINI_API_KEY: str = ""
    
    # Environment
    ENVIRONMENT: str = "development"
    STORAGE_BACKEND: str = "local"
    
    # Email / SMTP Settings
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
