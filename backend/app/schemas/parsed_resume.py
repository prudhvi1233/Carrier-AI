from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional, Any
from datetime import datetime

class ParsedResumeBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[HttpUrl] = None
    github: Optional[HttpUrl] = None
    portfolio: Optional[HttpUrl] = None
    
    summary: Optional[str] = None
    skills: List[str] = []
    education: List[Any] = []
    experience: List[Any] = []
    projects: List[Any] = []
    certifications: List[Any] = []
    languages: List[Any] = []
    achievements: List[Any] = []
    
    raw_text: str

class ParsedResumeCreate(ParsedResumeBase):
    pass

class ParsedResumeResponse(ParsedResumeBase):
    id: str
    resume_id: str
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ParseStatsResponse(BaseModel):
    status: str
    message: str
    skills_found: int
    projects_found: int
    experience_entries: int
    education_entries: int
    certifications_found: int
    languages_found: int
