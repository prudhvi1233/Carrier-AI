from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.auth.hashing import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.services.notification_service import send_notification

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def register_user(db: Session, user: UserCreate):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    hashed_pwd = hash_password(user.password)
    
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    send_notification(
        db=db,
        user_id=new_user.id,
        title="Welcome to CareerAI!",
        message="Your account has been successfully created. Explore the dashboard to get started.",
        type="success",
        icon="account"
    )
    
    return {"message": "User registered successfully"}

def authenticate_user(db: Session, user_login: UserLogin):
    user = get_user_by_email(db, user_login.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user.email})
    
    send_notification(
        db=db,
        user_id=user.id,
        title="New Login Detected",
        message="A new login was detected on your account.",
        type="info",
        icon="security"
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
