from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from datetime import datetime, timezone
from app.database.database import Base

class DashboardStats(Base):
    __tablename__ = "dashboard_stats"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    total_resumes = Column(Integer, default=0)
    total_applications = Column(Integer, default=0)
    total_interviews = Column(Integer, default=0)
    average_ats_score = Column(Float, default=0.0)
    average_resume_score = Column(Float, default=0.0)
    career_progress_score = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    snapshot_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resume_score = Column(Float, nullable=True)
    ats_score = Column(Float, nullable=True)
    applications_sent = Column(Integer, default=0)
    interviews_scheduled = Column(Integer, default=0)
    offers_received = Column(Integer, default=0)
    rejections = Column(Integer, default=0)
    metrics = Column(JSON, nullable=True)  # Store any extra data for charts
