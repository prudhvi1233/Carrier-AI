from pydantic import BaseModel
from datetime import datetime
from typing import List

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class ChatMessageBase(BaseModel):
    id: str
    role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
