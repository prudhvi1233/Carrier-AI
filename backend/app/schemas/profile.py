from pydantic import BaseModel, HttpUrl, validator
from typing import Optional
from datetime import datetime

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    current_city: Optional[str] = None
    country: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    profile_photo: Optional[str] = None

    @validator("graduation_year")
    def validate_year(cls, v):
        if v is not None and (v < 1900 or v > 2100):
            raise ValueError("Graduation year must be between 1900 and 2100")
        return v

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    profile_completion: int = 0

    class Config:
        orm_mode = True
        from_attributes = True
