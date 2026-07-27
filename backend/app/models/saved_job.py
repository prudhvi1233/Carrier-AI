from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
    applied_date = Column(DateTime, nullable=True)
    status = Column(String, default="Not Applied")
    notes = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")
