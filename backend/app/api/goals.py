from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.career_management import Goal, Task
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Goals & Productivity"])

class GoalCreate(BaseModel):
    title: str
    target_value: int
    category: str

class TaskCreate(BaseModel):
    title: str
    category: str

@router.get("/")
def get_goals_and_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    tasks = db.query(Task).filter(Task.user_id == current_user.id).order_by(Task.created_at.desc()).all()
    return {"goals": goals, "tasks": tasks}

@router.post("/goals")
def create_goal(goal: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    import uuid
    new_goal = Goal(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title=goal.title,
        target_value=goal.target_value,
        category=goal.category
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.put("/goals/{goal_id}/increment")
def increment_goal(goal_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    goal.current_value += 1
    if goal.current_value >= goal.target_value:
        goal.is_completed = True
        goal.current_value = goal.target_value
        
    db.commit()
    db.refresh(goal)
    return goal

@router.post("/tasks")
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    import uuid
    new_task = Task(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title=task.title,
        category=task.category
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/tasks/{task_id}/toggle")
def toggle_task(task_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = "completed" if task.status == "pending" else "pending"
    db.commit()
    db.refresh(task)
    return task
