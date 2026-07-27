from sqlalchemy import Column, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Scores
    overall_score = Column(Float, nullable=False)
    ats_score = Column(Float, nullable=False)
    
    # Text
    summary = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)

    # JSON structures
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    technical_skills = Column(JSON, default=list)
    soft_skills = Column(JSON, default=list)
    recommended_roles = Column(JSON, default=list)
    interview_questions = Column(JSON, default=list)
    career_advice = Column(JSON, default=list)
    improvements = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", backref="analysis")
    user = relationship("User")
