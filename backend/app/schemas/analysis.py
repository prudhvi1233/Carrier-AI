from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AnalysisBase(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    ats_score: float = Field(..., ge=0, le=100)
    summary: str
    strengths: List[str] = []
    weaknesses: List[str] = []
    missing_keywords: List[str] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    experience_level: str
    recommended_roles: List[str] = []
    interview_questions: List[str] = []
    career_advice: List[str] = []
    improvements: List[str] = []

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisResponse(AnalysisBase):
    id: str
    resume_id: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
