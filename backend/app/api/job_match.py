from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.parsed_resume import ParsedResume
from app.services.job_match_service import job_match_service

router = APIRouter()
logger = logging.getLogger(__name__)

class JobMatchRequest(BaseModel):
    job_title: str
    job_description: str

class JobMatchResponse(BaseModel):
    match_score: int
    matching_skills: list[str]
    missing_skills: list[str]
    recommendations: list[str]

@router.post("/analyze", response_model=JobMatchResponse)
def analyze_job_match(
    request: JobMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Get active resume
        active_resume = db.query(Resume).filter(
            Resume.user_id == current_user.id,
            Resume.is_active == True
        ).first()

        if not active_resume:
            raise HTTPException(status_code=400, detail="No active resume found. Please upload and activate a resume first.")

        # Get parsed resume text
        parsed_resume = db.query(ParsedResume).filter(
            ParsedResume.resume_id == active_resume.id
        ).first()

        if not parsed_resume:
            raise HTTPException(status_code=400, detail="Resume has not been parsed yet. Please wait or try uploading again.")

        # Analyze using AI
        analysis_result = job_match_service.analyze_match(
            resume_text=parsed_resume.raw_text,
            job_title=request.job_title,
            job_description=request.job_description
        )

        return analysis_result
    except ValueError as e:
        logger.error(f"Validation error in job match: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error analyzing job match: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze job match.")
