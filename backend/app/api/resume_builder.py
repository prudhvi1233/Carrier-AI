from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.resume_draft import ResumeDraftCreate, ResumeDraftResponse, ResumeDraftUpdate
from app.services.resume_builder_service import resume_builder_service
from app.services.activity_service import log_activity

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/init", response_model=Dict[str, Any])
def init_resume_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        data = resume_builder_service.get_initial_resume_data(db, current_user.id)
        return data
    except Exception as e:
        logger.error(f"Failed to init resume builder: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize resume builder")

@router.get("/history", response_model=List[ResumeDraftResponse])
def get_resume_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return resume_builder_service.get_drafts(db, current_user.id)

@router.post("/save", response_model=ResumeDraftResponse)
def save_resume_draft(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        draft = resume_builder_service.save_draft(db, current_user.id, request)
        log_activity(db, current_user.id, 'resume', 'Saved a new resume draft')
        return draft
    except Exception as e:
        logger.error(f"Failed to save draft: {e}")
        raise HTTPException(status_code=500, detail="Failed to save draft")

@router.post("/ai/improve")
def improve_text(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    text = request.get("text", "")
    instruction = request.get("instruction", "Make it sound professional.")
    try:
        improved = resume_builder_service.improve_text_with_ai(text, instruction)
        return {"improved_text": improved}
    except Exception as e:
        logger.error(f"AI Improvement failed: {e}")
        raise HTTPException(status_code=500, detail="AI Improvement failed")

@router.post("/export/pdf")
def export_pdf(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        content = request.get("content", {})
        template = request.get("template", "modern")
        theme = request.get("theme", "blue")
        pdf_bytes = resume_builder_service.generate_pdf(content, template, theme)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=resume.pdf"})
    except Exception as e:
        logger.error(f"PDF Export failed: {e}")
        raise HTTPException(status_code=500, detail="PDF Export failed")

@router.post("/export/docx")
def export_docx(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        content = request.get("content", {})
        template = request.get("template", "modern")
        docx_bytes = resume_builder_service.generate_docx(content, template)
        return Response(content=docx_bytes, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": "attachment; filename=resume.docx"})
    except Exception as e:
        logger.error(f"DOCX Export failed: {e}")
        raise HTTPException(status_code=500, detail="DOCX Export failed")
