from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.services.profile_service import create_profile, update_profile, get_profile, delete_profile
from app.services.activity_service import log_activity
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.utils.file_handler import validate_file, save_file
from fastapi import UploadFile, File
from typing import Optional

router = APIRouter()

@router.get("/", response_model=Optional[ProfileResponse])
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns the logged-in user's profile."""
    return get_profile(db, current_user.id)

@router.post("/", response_model=ProfileResponse)
def create_my_profile(profile_data: ProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Creates a profile for the logged-in user."""
    return create_profile(db, current_user.id, profile_data)

@router.put("/", response_model=ProfileResponse)
def update_my_profile(profile_data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Updates the logged-in user's profile."""
    profile = update_profile(db, current_user.id, profile_data)
    log_activity(db, current_user.id, 'general', 'Updated your profile information')
    
    from app.services.notification_service import send_notification
    send_notification(
        db=db,
        user_id=current_user.id,
        title="Profile Updated",
        message="Your profile details were updated successfully.",
        type="info",
        icon="user"
    )
    
    return profile

@router.delete("/")
def delete_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Deletes the logged-in user's profile."""
    return delete_profile(db, current_user.id)

@router.post("/upload-photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Uploads a profile photo for the logged-in user."""
    validate_file(file, is_image=True)
    
    file_url, _ = save_file(file, sub_dir="avatars")
    
    # Update profile with the new photo URL
    from app.models.profile import Profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    # If using full path in frontend, we construct it:
    full_url = f"http://localhost:8000/{file_url}"
    
    if profile:
        profile.profile_photo = full_url
        db.commit()
        db.refresh(profile)
    else:
        # Create an empty profile with just the photo if it doesn't exist
        from app.schemas.profile import ProfileCreate
        profile = create_profile(db, current_user.id, ProfileCreate(profile_photo=full_url))
        
    return {"message": "Photo uploaded successfully", "url": full_url}
