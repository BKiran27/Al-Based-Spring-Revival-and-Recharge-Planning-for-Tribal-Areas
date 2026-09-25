import os

class Settings:
    PROJECT_NAME: str = "CloudSentinel AI - Cloud Security Operations Platform"
    VERSION: str = "2.4.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cloudsentinel_super_secure_jwt_secret_key_2026_hackathon")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Dual database support: SQLite by default (portable & instant), or PostgreSQL via DATABASE_URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cloudsentinel.db")
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()
