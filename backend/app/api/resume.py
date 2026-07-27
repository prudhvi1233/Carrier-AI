from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.resume import ResumeResponse
from app.services.resume_service import upload_resume, get_resumes, get_resume, activate_resume, remove_resume
from app.auth.dependencies import get_current_user
from app.models.user import User
from typing import List

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
def upload_my_resume(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Uploads a new resume (PDF or DOCX max 10MB)."""
    return upload_resume(db, current_user.id, file)

@router.get("/", response_model=List[ResumeResponse])
def get_my_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns all resumes uploaded by the logged-in user."""
    return get_resumes(db, current_user.id)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_my_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns metadata for a specific resume."""
    return get_resume(db, resume_id, current_user.id)

@router.delete("/{resume_id}")
def delete_my_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Deletes a specific resume from the database and filesystem."""
    return remove_resume(db, resume_id, current_user.id)

@router.put("/{resume_id}/activate", response_model=ResumeResponse)
def activate_my_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Sets the specified resume as active and deactivates the previously active one."""
    return activate_resume(db, resume_id, current_user.id)
