from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class ResumeDraft(Base):
    __tablename__ = "resume_drafts"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, default="Untitled Resume")
    template = Column(String, default="modern")
    theme = Column(String, default="blue")
    content = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
