from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from app.models.resume import Resume
from app.utils.file_handler import save_file, delete_file, validate_file
from app.services.parser_service import process_resume
import uuid
import os

def upload_resume(db: Session, user_id: str, file: UploadFile) -> Resume:
    # Validate file
    validate_file(file)
    
    # Save file to disk
    file_path, file_size = save_file(file)

    # Deactivate other resumes
    db.query(Resume).filter(Resume.user_id == user_id).update({"is_active": False})

    new_resume = Resume(
        user_id=user_id,
        file_name=file.filename,
        original_name=file.filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=file.content_type or "application/pdf",
        is_active=True
    )
    
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    # Automatically trigger parsing synchronously
    try:
        process_resume(db, new_resume)
    except Exception as e:
        print(f"Parsing failed for resume {new_resume.id}: {e}")
        
    return new_resume

def get_resumes(db: Session, user_id: int):
    return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).all()

def get_resume(db: Session, resume_id: int, user_id: int):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return resume

def activate_resume(db: Session, resume_id: int, user_id: int):
    resume = get_resume(db, resume_id, user_id)
    
    # Deactivate all others
    db.query(Resume).filter(Resume.user_id == user_id).update({"is_active": False})
    
    # Activate selected
    resume.is_active = True
    db.commit()
    db.refresh(resume)
    
    return resume

def remove_resume(db: Session, resume_id: int, user_id: int):
    resume = get_resume(db, resume_id, user_id)
    
    # Remove file from disk
    if not delete_file(resume.file_path):
        # We can log this, but we should still delete the DB record
        pass
        
    # Remove from database
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}
