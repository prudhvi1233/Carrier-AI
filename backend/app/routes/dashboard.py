from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, models, dependencies

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/", response_model=schemas.DashboardResponse)
def get_dashboard(
    current_user: models.User = Depends(dependencies.get_current_user),
    db: Session = Depends(dependencies.get_db)
):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.analyzed_at.desc()).all()
    
    total = len(resumes)
    avg_score = sum([r.overall_score for r in resumes if r.overall_score]) / total if total > 0 else 0
    latest = resumes[0] if total > 0 else None
    
    # Manually parsing JSON strings to lists for the Pydantic model response
    def parse_resume(r):
        import json
        def safe_loads(val):
            if val is None: return []
            try: return json.loads(val)
            except: return []
            
        return schemas.ResumeAnalysisResponse(
            id=r.id,
            overall_score=r.overall_score,
            ats_score=r.ats_score,
            technical_skills=safe_loads(r.technical_skills),
            soft_skills=safe_loads(r.soft_skills),
            strengths=safe_loads(r.strengths),
            weaknesses=safe_loads(r.weaknesses),
            missing_skills=safe_loads(r.missing_skills),
            grammar_issues=safe_loads(r.grammar_issues),
            formatting_issues=safe_loads(r.formatting_issues),
            suggestions=safe_loads(r.suggestions),
            career_summary=r.career_summary,
            interview_readiness=r.interview_readiness,
            analyzed_at=r.analyzed_at
        )

    parsed_resumes = [parse_resume(r) for r in resumes]
    latest_parsed = parsed_resumes[0] if parsed_resumes else None
    
    return schemas.DashboardResponse(
        latest_analysis=latest_parsed,
        average_score=avg_score,
        total_uploaded_resumes=total,
        recent_activity=parsed_resumes[:5],
        resume_history=parsed_resumes
    )
