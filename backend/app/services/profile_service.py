from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate

def calculate_completion(profile: Profile) -> int:
    """Calculates profile completion percentage based on core fields."""
    fields_to_check = [
        profile.full_name,
        profile.phone,
        profile.college,
        profile.degree,
        profile.skills,
        profile.linkedin_url,
        profile.github_url,
        profile.portfolio_url,
        profile.bio,
        profile.current_city
    ]
    
    filled = sum(1 for field in fields_to_check if field)
    total = len(fields_to_check)
    return int((filled / total) * 100)

def get_profile(db: Session, user_id: int):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        profile.profile_completion = calculate_completion(profile)
    return profile

def create_profile(db: Session, user_id: int, profile_data: ProfileCreate):
    existing = get_profile(db, user_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Profile already exists for this user"
        )
    
    data_dict = profile_data.dict(exclude_unset=True)
    for field in ["linkedin_url", "github_url", "portfolio_url"]:
        if field in data_dict and data_dict[field] is not None:
            data_dict[field] = str(data_dict[field])
            
    new_profile = Profile(user_id=user_id, **data_dict)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    new_profile.profile_completion = calculate_completion(new_profile)
    return new_profile

def update_profile(db: Session, user_id: int, profile_data: ProfileUpdate):
    profile = get_profile(db, user_id)
    if not profile:
        from app.schemas.profile import ProfileCreate
        create_data = ProfileCreate(**profile_data.dict(exclude_unset=True))
        return create_profile(db, user_id, create_data)
        
    update_data = profile_data.dict(exclude_unset=True)
    for field in ["linkedin_url", "github_url", "portfolio_url"]:
        if field in update_data and update_data[field] is not None:
            update_data[field] = str(update_data[field])
            
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.commit()
    db.refresh(profile)
    
    profile.profile_completion = calculate_completion(profile)
    return profile

def delete_profile(db: Session, user_id: int):
    profile = get_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    db.delete(profile)
    db.commit()
    return {"message": "Profile deleted successfully"}
