from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SavedJobBase(BaseModel):
    company: str
    role: str
    status: Optional[str] = "Not Applied"
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None

class SavedJobCreate(SavedJobBase):
    pass

class SavedJobUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None

class SavedJobResponse(SavedJobBase):
    id: str
    user_id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
