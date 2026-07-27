from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class InterviewStartRequest(BaseModel):
    job_role: str
    interview_type: str
    difficulty: str

class InterviewAnswerRequest(BaseModel):
    question_index: int
    answer: str

class InterviewSessionBase(BaseModel):
    job_role: str
    interview_type: str
    difficulty: str

class InterviewSessionResponse(InterviewSessionBase):
    id: str
    user_id: str
    resume_id: int
    questions: List[Any]
    answers: List[Any]
    score: Optional[int] = None
    feedback: Optional[Any] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
