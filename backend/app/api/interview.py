from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.interview import InterviewSession
from app.schemas.interview import InterviewSessionResponse, InterviewStartRequest, InterviewAnswerRequest
from app.services.interview_service import interview_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/start", response_model=InterviewSessionResponse)
def start_interview(
    request: InterviewStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        session = interview_service.start_interview(
            db, 
            current_user.id, 
            request.job_role, 
            request.interview_type, 
            request.difficulty
        )
        return session
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to start interview: {e}")
        raise HTTPException(status_code=500, detail="Failed to start interview session")

@router.post("/{session_id}/answer")
def submit_answer(
    session_id: str,
    request: InterviewAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        evaluation = interview_service.evaluate_answer(
            db,
            current_user.id,
            session_id,
            request.question_index,
            request.answer
        )
        return evaluation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to evaluate answer: {e}")
        raise HTTPException(status_code=500, detail="Failed to evaluate answer")

@router.post("/{session_id}/complete", response_model=InterviewSessionResponse)
def complete_interview(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        session = interview_service.complete_interview(db, current_user.id, session_id)
        return session
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to complete interview: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate final report")

@router.get("/history", response_model=List[InterviewSessionResponse])
def get_interview_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).order_by(InterviewSession.created_at.desc()).all()

@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return session
