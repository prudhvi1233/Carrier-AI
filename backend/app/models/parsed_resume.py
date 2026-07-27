from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.database import Base

class ParsedResume(Base):
    __tablename__ = "parsed_resumes"

    id = Column(String(36), primary_key=True, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Personal Info
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)
    
    # Text blob
    summary = Column(String, nullable=True)
    raw_text = Column(String, nullable=False)

    # JSON structures
    skills = Column(JSON, default=list)
    education = Column(JSON, default=list)
    experience = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    languages = Column(JSON, default=list)
    achievements = Column(JSON, default=list)

    # Relationships
    resume = relationship("Resume", back_populates="parsed_data")
    user = relationship("User")
