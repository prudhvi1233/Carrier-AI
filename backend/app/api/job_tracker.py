from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.saved_job import SavedJobResponse, SavedJobCreate, SavedJobUpdate
from app.services.job_tracker_service import job_tracker_service
from app.services.activity_service import log_activity

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[SavedJobResponse])
def get_saved_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return job_tracker_service.get_saved_jobs(db, current_user.id)

@router.post("/", response_model=SavedJobResponse)
def add_saved_job(
    job_data: SavedJobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        job = job_tracker_service.add_saved_job(db, current_user.id, job_data)
        log_activity(db, current_user.id, 'job', f'Saved a new job: {job_data.role}')
        return job
    except Exception as e:
        logger.error(f"Error saving job: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save job.")

@router.put("/{job_id}", response_model=SavedJobResponse)
def update_saved_job(
    job_id: str,
    job_data: SavedJobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = job_tracker_service.update_saved_job(db, current_user.id, job_id, job_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Job not found")
    return updated

@router.delete("/{job_id}")
def delete_saved_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = job_tracker_service.delete_saved_job(db, current_user.id, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully."}
