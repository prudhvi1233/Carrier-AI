from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    full_name: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# --- Resume Schemas ---
class ResumeAnalysisResponse(BaseModel):
    id: int
    overall_score: Optional[float]
    ats_score: Optional[float]
    technical_skills: Optional[List[str]]
    soft_skills: Optional[List[str]]
    strengths: Optional[List[str]]
    weaknesses: Optional[List[str]]
    missing_skills: Optional[List[str]]
    grammar_issues: Optional[List[str]]
    formatting_issues: Optional[List[str]]
    suggestions: Optional[List[str]]
    career_summary: Optional[str]
    interview_readiness: Optional[str]
    analyzed_at: datetime

    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    latest_analysis: Optional[ResumeAnalysisResponse]
    average_score: float
    total_uploaded_resumes: int
    recent_activity: List[ResumeAnalysisResponse]
    resume_history: List[ResumeAnalysisResponse]
