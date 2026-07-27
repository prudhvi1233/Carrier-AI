from sqlalchemy.orm import Session
import uuid
from app.models.career_management import Activity

def log_activity(db: Session, user_id: str, activity_type: str, description: str):
    """
    Log an activity for a user to display on their timeline.
    activity_type options: 'resume', 'interview', 'job', 'general'
    """
    try:
        new_activity = Activity(
            id=str(uuid.uuid4()),
            user_id=user_id,
            type=activity_type,
            description=description
        )
        db.add(new_activity)
        db.commit()
    except Exception as e:
        # Don't let an activity logging failure break the main flow
        db.rollback()
        print(f"Failed to log activity: {e}")
