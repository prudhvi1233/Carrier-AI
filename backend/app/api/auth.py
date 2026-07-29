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

from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest
from app.auth.jwt_handler import create_password_reset_token, verify_password_reset_token
from app.auth.hashing import hash_password
from app.services.email_service import send_reset_email

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        return {"message": "If that email is in our system, we have sent a reset link."}
    
    token = create_password_reset_token(email=user.email)
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    send_reset_email(user.email, reset_link)
    
    return {"message": "If that email is in our system, we have sent a reset link."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_password_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
        
    user.hashed_password = hash_password(request.new_password)
    db.commit()
    db.refresh(user)
    
    from app.services.notification_service import send_notification
    send_notification(
        db=db,
        user_id=user.id,
        title="Password Changed",
        message="Your password was successfully reset. If this wasn't you, please contact support immediately.",
        type="warning",
        icon="security"
    )
    
    from app.auth.jwt_handler import create_access_token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "message": "Password has been successfully reset",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
