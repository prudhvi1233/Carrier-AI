from sqlalchemy.orm import Session
from app.models.saved_job import SavedJob
from app.schemas.saved_job import SavedJobCreate, SavedJobUpdate

class JobTrackerService:
    def get_saved_jobs(self, db: Session, user_id: str):
        return db.query(SavedJob).filter(SavedJob.user_id == user_id).all()

    def add_saved_job(self, db: Session, user_id: str, job_data: SavedJobCreate):
        db_job = SavedJob(
            user_id=user_id,
            company=job_data.company,
            role=job_data.role,
            status=job_data.status,
            notes=job_data.notes,
            applied_date=job_data.applied_date
        )
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        return db_job

    def update_saved_job(self, db: Session, user_id: str, job_id: str, job_data: SavedJobUpdate):
        db_job = db.query(SavedJob).filter(SavedJob.user_id == user_id, SavedJob.id == job_id).first()
        if not db_job:
            return None
            
        update_data = job_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_job, key, value)
            
        db.commit()
        db.refresh(db_job)
        return db_job

    def delete_saved_job(self, db: Session, user_id: str, job_id: str):
        db_job = db.query(SavedJob).filter(SavedJob.user_id == user_id, SavedJob.id == job_id).first()
        if db_job:
            db.delete(db_job)
            db.commit()
            return True
        return False

job_tracker_service = JobTrackerService()
