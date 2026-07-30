from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.parsed_resume import ParsedResume
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse
from app.services.ai_analysis_service import ai_analysis_service
import logging

router = APIRouter(tags=["Analysis"])
logger = logging.getLogger(__name__)

@router.post("/{resume_id}", response_model=AnalysisResponse)
def analyze_resume(resume_id: str, force: bool = False, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Check for existing analysis if not forced
    if not force:
        existing = db.query(Analysis).filter(Analysis.resume_id == resume_id).first()
        if existing:
            return existing

    # Get parsed text
    parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume_id).first()
    if not parsed:
        raise HTTPException(status_code=400, detail="Resume has not been parsed yet.")

    text_to_analyze = parsed.raw_text
    
    # Analyze
    try:
        analysis_data = ai_analysis_service.analyze_resume(text_to_analyze)
    except ValueError as e:
        error_msg = str(e)
        if "Quota exceeded" in error_msg or "429" in error_msg:
            raise HTTPException(status_code=429, detail="AI API Rate Limit Exceeded. Please wait about 30 seconds and try again.")
        raise HTTPException(status_code=500, detail=error_msg)

    # Save to DB
    existing = db.query(Analysis).filter(Analysis.resume_id == resume_id).first()
    if existing:
        for key, value in analysis_data.model_dump().items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_analysis = Analysis(
            resume_id=resume_id,
            user_id=current_user.id,
            **analysis_data.model_dump()
        )
        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)
        return new_analysis

@router.get("/history", response_model=list[AnalysisResponse])
def get_analysis_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
    return analyses

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        # Check if it was passed a resume_id by mistake
        analysis_by_resume = db.query(Analysis).filter(Analysis.resume_id == analysis_id, Analysis.user_id == current_user.id).first()
        if analysis_by_resume:
            return analysis_by_resume
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
