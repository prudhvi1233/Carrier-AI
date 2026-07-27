from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, UpdateUser
from app.services.auth_service import register_user, authenticate_user
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Registers a new user"""
    return register_user(db, user)

@router.post("/login")
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Authenticates a user and returns a JWT token"""
    return authenticate_user(db, user_login)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the current logged-in user"""
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(user_update: UpdateUser, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Updates the profile of the current logged-in user"""
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/verify-token")
def verify_token(current_user: User = Depends(get_current_user)):
    """Verifies if the current JWT token is valid"""
    return {"status": "valid"}
