from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class JobRecommendation(Base):
    __tablename__ = "job_recommendations"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    job_title = Column(String, nullable=False)
    match_percentage = Column(Integer, nullable=False)
    salary_range = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)
    why_match = Column(String, nullable=False)
    
    required_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    recommended_courses = Column(JSON, default=list)
    companies = Column(JSON, default=list)
    roadmap = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")
    resume = relationship("Resume")
