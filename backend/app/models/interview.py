from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    job_role = Column(String)
    interview_type = Column(String)
    difficulty = Column(String)
    
    questions = Column(JSON, default=list)
    answers = Column(JSON, default=list)
    
    score = Column(Integer, nullable=True)
    feedback = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
