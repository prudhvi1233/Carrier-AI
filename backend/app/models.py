from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resumes = relationship("Resume", back_populates="owner")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_file = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=False)
    
    # Analysis results
    overall_score = Column(Float, nullable=True)
    ats_score = Column(Float, nullable=True)
    technical_skills = Column(Text, nullable=True) # Stored as JSON string
    soft_skills = Column(Text, nullable=True)      # Stored as JSON string
    strengths = Column(Text, nullable=True)        # Stored as JSON string
    weaknesses = Column(Text, nullable=True)       # Stored as JSON string
    missing_skills = Column(Text, nullable=True)   # Stored as JSON string
    grammar_issues = Column(Text, nullable=True)   # Stored as JSON string
    formatting_issues = Column(Text, nullable=True) # Stored as JSON string
    suggestions = Column(Text, nullable=True)      # Stored as JSON string
    career_summary = Column(Text, nullable=True)
    interview_readiness = Column(Text, nullable=True)
    
    analyzed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="resumes")
