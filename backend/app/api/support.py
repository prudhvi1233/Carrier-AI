from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List
from loguru import logger
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.support_ticket import SupportTicket
from app.models.career_management import Notification
from app.schemas.support import SupportTicketResponse, SupportTicketReply
from app.config.config import get_settings

router = APIRouter()
settings = get_settings()

class ContactRequest(BaseModel):
    subject: str
    message: str
    admin_email: EmailStr

def is_admin(user: User):
    if user.email != "prudhvibehara34@gmail.com":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return True

@router.post("/contact")
async def contact_support(
    req: ContactRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"--- New Support Request from {current_user.email} ---")
    
    # Save to database
    new_ticket = SupportTicket(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        subject=req.subject,
        message=req.message
    )
    db.add(new_ticket)
    db.commit()

    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Ticket saved but no email sent.")
        return {"success": True, "message": "Support request saved."}

    try:
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_EMAIL
        msg['To'] = req.admin_email
        msg['Subject'] = f"Support Request: {req.subject}"
        body = f"From: {current_user.email}\nName: {current_user.full_name}\n\nMessage:\n{req.message}"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        # We don't raise 500 here because the ticket is already saved.

    return {"success": True, "message": "Support request sent successfully"}
@router.get("/tickets", response_model=List[SupportTicketResponse])
def get_user_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tickets = db.query(SupportTicket).filter(SupportTicket.user_id == current_user.id).order_by(SupportTicket.created_at.desc()).all()
    
    response = []
    for ticket in tickets:
        ticket_data = SupportTicketResponse.model_validate(ticket)
        # We don't need user_email for the user's own view, but it's required by the schema
        ticket_data.user_email = current_user.email 
        ticket_data.user_name = current_user.full_name
        response.append(ticket_data)
        
    return response
@router.get("/admin/tickets", response_model=List[SupportTicketResponse])
def get_admin_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin(current_user)
    
    # Fetch all tickets with user info joined
    tickets = db.query(SupportTicket, User.email, User.full_name).join(
        User, SupportTicket.user_id == User.id
    ).order_by(SupportTicket.created_at.desc()).all()
    
    response = []
    for ticket, email, name in tickets:
        ticket_data = SupportTicketResponse.model_validate(ticket)
        ticket_data.user_email = email
        ticket_data.user_name = name
        response.append(ticket_data)
        
    return response

@router.post("/admin/tickets/{ticket_id}/reply")
def reply_to_ticket(
    ticket_id: str,
    reply: SupportTicketReply,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin(current_user)
    
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket.status = "Closed"
    ticket.admin_reply = reply.reply_message
    
    user = db.query(User).filter(User.id == ticket.user_id).first()
    
    # Create notification for the user
    notification = Notification(
        id=str(uuid.uuid4()),
        user_id=ticket.user_id,
        type="system",
        message=f"Admin has replied to your support ticket: '{ticket.subject}'",
        priority="high"
    )
    db.add(notification)
    db.commit()
    
    # Optionally send email back to the user
    if settings.SMTP_EMAIL and settings.SMTP_PASSWORD and user:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = user.email
            msg['Subject'] = f"Re: Support Request: {ticket.subject}"
            body = f"Hello {user.full_name},\n\nAdmin has replied to your query:\n\n{reply.reply_message}\n\nBest regards,\nCareerAI Team"
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
        except Exception as e:
            logger.error(f"Failed to send reply email to user: {str(e)}")

    return {"success": True, "message": "Reply sent successfully"}
