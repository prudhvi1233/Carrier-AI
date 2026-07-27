from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.parsed_resume import ParsedResume
from app.schemas.parsed_resume import ParsedResumeResponse, ParseStatsResponse
from app.services.parser_service import process_resume

router = APIRouter(prefix="/resume", tags=["Parser"])

@router.post("/{resume_id}/parse", response_model=ParseStatsResponse)
def parse_resume(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Manually triggers parsing for a resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    try:
        parsed_resume = process_resume(db, resume)
        return ParseStatsResponse(
            status="success",
            message="Resume parsed successfully",
            skills_found=len(parsed_resume.skills),
            projects_found=len(parsed_resume.projects),
            experience_entries=len(parsed_resume.experience),
            education_entries=len(parsed_resume.education),
            certifications_found=len(parsed_resume.certifications),
            languages_found=len(parsed_resume.languages)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{resume_id}/reparse", response_model=ParseStatsResponse)
def reparse_resume(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Deletes old parsing data and reparses."""
    return parse_resume(resume_id, db, current_user)

@router.get("/{resume_id}/parsed", response_model=ParsedResumeResponse)
def get_parsed_resume(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns the structured parsed data for a resume."""
    parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume_id, ParsedResume.user_id == current_user.id).first()
    if not parsed:
        raise HTTPException(status_code=404, detail="Parsed data not found")
    return parsed

@router.delete("/{resume_id}/parsed", status_code=status.HTTP_204_NO_CONTENT)
def delete_parsed_data(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Deletes the parsed data for a resume."""
    parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume_id, ParsedResume.user_id == current_user.id).first()
    if not parsed:
        raise HTTPException(status_code=404, detail="Parsed data not found")
    
    db.delete(parsed)
    db.commit()
    return None
