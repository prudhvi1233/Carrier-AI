from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.career_coach import ChatRequest, ChatResponse, ChatMessageBase
from app.services.career_coach_service import career_coach_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def send_message(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        reply = career_coach_service.chat(db=db, user_id=current_user.id, message=request.message)
        return ChatResponse(reply=reply)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Career Coach API error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/history", response_model=List[ChatMessageBase])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        history = career_coach_service.get_history(db=db, user_id=current_user.id)
        return history
    except Exception as e:
        logger.error(f"Get history error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/history")
def clear_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        career_coach_service.clear_history(db=db, user_id=current_user.id)
        return {"detail": "Chat history cleared successfully"}
    except Exception as e:
        logger.error(f"Clear history error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
