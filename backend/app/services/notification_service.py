from sqlalchemy.orm import Session
from app.models.career_management import Notification
from app.schemas.notification import NotificationCreate

def create_notification(db: Session, notification: NotificationCreate):
    db_notification = Notification(
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        type=notification.type,
        icon=notification.icon,
        action_url=notification.action_url
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def send_notification(db: Session, user_id: int, title: str, message: str, type: str = "info", icon: str = None, action_url: str = None):
    """Helper method for easily dispatching notifications"""
    return create_notification(db, NotificationCreate(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        icon=icon,
        action_url=action_url
    ))
