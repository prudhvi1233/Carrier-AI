from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from app.config.config import get_settings
from app.database.database import Base, engine

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger
import os

# Import models to ensure they are registered with SQLAlchemy
from app.models import user, profile, resume, parsed_resume, interview, resume_draft, analytics, career_management, support_ticket

# Import API routers
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.resume import router as resume_router
from app.api.parser import router as parser_router
from app.api.dashboard import router as dashboard_router
from app.api.analysis import router as analysis_router
from app.api.career_coach import router as career_coach_router
from app.api.job_recommendations import router as job_recommendations_router
from app.api.job_tracker import router as job_tracker_router
from app.api.interview import router as interview_router
from app.api.resume_builder import router as resume_builder_router
from app.api.analytics import router as analytics_router
from app.api.goals import router as goals_router
from app.api.notifications import router as notifications_router
from app.api.activity import router as activity_router
from app.api.settings import router as settings_router
from app.api.search import router as search_router
from app.api.job_match import router as job_match_router

settings = get_settings()

# Setup logging
os.makedirs("logs", exist_ok=True)
logger.add("logs/app_{time}.log", rotation="10 MB", retention="10 days", level="INFO")

# Setup Rate Limiting
limiter = Limiter(key_func=get_remote_address)

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION
    )

    # Attach Rate Limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Global Exception Handlers
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Global Exception: {exc} | Path: {request.url.path}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "An unexpected server error occurred.",
                "error_code": "INTERNAL_SERVER_ERROR"
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation Error: {exc} | Path: {request.url.path}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Invalid request parameters.",
                "error_code": "VALIDATION_ERROR",
                "details": exc.errors()
            },
        )

    # Configure CORS
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://carrier-ai-frontend.onrender.com",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(profile_router, prefix="/api/v1/profile", tags=["Profile"])
    app.include_router(resume_router, prefix="/api/v1/resume", tags=["Resume"])
    app.include_router(parser_router, prefix="/api/v1", tags=["Parser"])
    app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])
    app.include_router(analysis_router, prefix="/api/v1/analysis", tags=["Analysis"])
    app.include_router(career_coach_router, prefix="/api/v1/career-coach", tags=["Career Coach"])
    app.include_router(job_recommendations_router, prefix="/api/v1/job-recommendations", tags=["Job Recommendations"])
    app.include_router(job_tracker_router, prefix="/api/v1/job-tracker", tags=["Job Tracker"])
    app.include_router(interview_router, prefix="/api/v1/interview", tags=["Interview"])
    app.include_router(resume_builder_router, prefix="/api/v1/resume-builder", tags=["Resume Builder"])
    app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])
    app.include_router(goals_router, prefix="/api/v1/goals", tags=["Goals & Productivity"])
    app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
    app.include_router(activity_router, prefix="/api/v1/activity", tags=["Activity"])
    app.include_router(settings_router, prefix="/api/v1/settings", tags=["Settings"])
    app.include_router(search_router, prefix="/api/v1/search", tags=["Search"])
    app.include_router(job_match_router, prefix="/api/v1/job-match", tags=["Job Match Analyzer"])
    
    from app.api.support import router as support_router
    app.include_router(support_router, prefix="/api/v1/support", tags=["Support"])

    # Mount static files for uploads
    os.makedirs("app/uploads", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

    return app

app = create_app()

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")
    logger.info("Initializing database schema...")
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application...")

@app.get("/")
def root():
    return {"message": "AI Career Platform Backend Running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "server": "running",
        "version": settings.VERSION
    }
