from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.job_recommendation import JobRecommendationResponse
from app.services.job_recommendation_service import job_recommendation_service
from app.models.job_recommendation import JobRecommendation

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=List[JobRecommendationResponse])
def generate_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        recommendations = job_recommendation_service.generate_recommendations(db, current_user.id)
        return recommendations
    except ValueError as e:
        logger.error(f"Validation error in job recommendation: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating job recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations.")

@router.get("/", response_model=List[JobRecommendationResponse])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(JobRecommendation).filter(JobRecommendation.user_id == current_user.id).order_by(JobRecommendation.created_at.desc()).all()

@router.delete("/")
def delete_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(JobRecommendation).filter(JobRecommendation.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Job recommendations deleted successfully. You can now generate new ones."}
