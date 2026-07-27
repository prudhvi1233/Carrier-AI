from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models, dependencies
from app.services import resume_parser, ai_analyzer
import json
import os

router = APIRouter(prefix="/resume", tags=["resume"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(dependencies.get_current_user),
    db: Session = Depends(dependencies.get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Read and save file
    file_bytes = await file.read()
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Extract text
    text = resume_parser.extract_text_from_pdf(file_bytes)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # Analyze with AI
    try:
        analysis = ai_analyzer.analyze_resume(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")

    # Save to database
    def safe_dumps(val):
        return json.dumps(val) if val is not None else None

    db_resume = models.Resume(
        user_id=current_user.id,
        resume_file=file_path,
        extracted_text=text,
        overall_score=analysis.get("overall_score"),
        ats_score=analysis.get("ats_score"),
        technical_skills=safe_dumps(analysis.get("technical_skills")),
        soft_skills=safe_dumps(analysis.get("soft_skills")),
        strengths=safe_dumps(analysis.get("strengths")),
        weaknesses=safe_dumps(analysis.get("weaknesses")),
        missing_skills=safe_dumps(analysis.get("missing_skills")),
        grammar_issues=safe_dumps(analysis.get("grammar_issues")),
        formatting_issues=safe_dumps(analysis.get("formatting_issues")),
        suggestions=safe_dumps(analysis.get("suggestions")),
        career_summary=analysis.get("career_summary"),
        interview_readiness=analysis.get("interview_readiness")
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return {"message": "Resume uploaded and analyzed successfully", "id": db_resume.id}
