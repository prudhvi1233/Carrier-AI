from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class SupportTicketResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    message: str
    status: str
    admin_reply: Optional[str] = None
    created_at: datetime
    
    # Nested user information for admin view
    user_email: Optional[str] = None
    user_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SupportTicketReply(BaseModel):
    reply_message: str
