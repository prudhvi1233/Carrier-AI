from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models, auth, dependencies

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(dependencies.get_current_user)):
    return current_user

@router.put("/", response_model=schemas.UserResponse)
def update_profile(
    user_update: schemas.UserUpdate, 
    current_user: models.User = Depends(dependencies.get_current_user),
    db: Session = Depends(dependencies.get_db)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/password")
def change_password(
    password_data: schemas.PasswordChange,
    current_user: models.User = Depends(dependencies.get_current_user),
    db: Session = Depends(dependencies.get_db)
):
    if not auth.verify_password(password_data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    current_user.password_hash = auth.get_password_hash(password_data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
