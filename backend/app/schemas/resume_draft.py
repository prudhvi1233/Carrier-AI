from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime

class ResumeDraftBase(BaseModel):
    name: str
    template: str
    theme: str
    content: Any

class ResumeDraftCreate(ResumeDraftBase):
    pass

class ResumeDraftUpdate(BaseModel):
    name: Optional[str] = None
    template: Optional[str] = None
    theme: Optional[str] = None
    content: Optional[Any] = None

class ResumeDraftResponse(ResumeDraftBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
