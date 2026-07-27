from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from datetime import datetime, timezone
from app.database.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    type = Column(String(50))  # e.g., 'interview', 'improvement', 'insight', 'system'
    message = Column(String(255))
    is_read = Column(Boolean, default=False)
    priority = Column(String(20), default="low") # low, medium, high
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    title = Column(String(255))
    target_value = Column(Integer, default=100)
    current_value = Column(Integer, default=0)
    category = Column(String(50)) # e.g., 'applications', 'learning', 'score'
    deadline = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    type = Column(String(50)) # e.g., 'resume_upload', 'job_save', 'interview_complete'
    description = Column(String(255))
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    title = Column(String(255))
    category = Column(String(50)) # e.g., 'study', 'interview', 'general'
    status = Column(String(50), default="pending") # pending, in_progress, completed
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CareerProgress(Base):
    __tablename__ = "career_progress"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    current_level = Column(String(50)) # e.g., 'Beginner', 'Intermediate', 'Ready'
    score = Column(Float, default=0.0)
    skill_growth = Column(Float, default=0.0)
    interview_readiness = Column(Float, default=0.0)
    suggestions = Column(String(500), nullable=True) # Text suggestions for improvement
    last_calculated = Column(DateTime, default=lambda: datetime.now(timezone.utc))
