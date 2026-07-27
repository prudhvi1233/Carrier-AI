from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class JobRecommendationBase(BaseModel):
    job_title: str
    match_percentage: int
    salary_range: str
    experience_level: str
    why_match: str
    required_skills: List[str]
    missing_skills: List[str]
    recommended_courses: List[str]
    companies: List[str]
    roadmap: List[str]

class JobRecommendationCreate(JobRecommendationBase):
    pass

class JobRecommendationResponse(JobRecommendationBase):
    id: str
    user_id: str
    resume_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class JobRecommendationsListResponse(BaseModel):
    recommendations: List[JobRecommendationResponse]
