from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models, auth, dependencies, database

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    # Reusing UserCreate schema just to accept email and password in JSON body for simplicity.
    # Normally OAuth2PasswordRequestForm is used if using form data, but React fetches often send JSON.
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not auth.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(dependencies.get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        # For security, we usually don't reveal if the user exists or not
        return {"message": "If that email is in our system, we have sent a reset link."}
    
    token = auth.create_password_reset_token(email=user.email)
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    # Send actual email via SMTP
    from app.services.email_service import send_reset_email
    send_reset_email(user.email, reset_link)
    
    return {"message": "If that email is in our system, we have sent a reset link."}

@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(dependencies.get_db)):
    email = auth.verify_password_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
        
    user.password_hash = auth.get_password_hash(request.new_password)
    db.commit()
    
    return {"message": "Password has been successfully reset"}
