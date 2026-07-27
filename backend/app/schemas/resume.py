from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    original_name: str
    file_size: int
    mime_type: str
    is_active: bool
    version: int
    uploaded_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
