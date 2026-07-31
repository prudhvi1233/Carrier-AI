import logging
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.config.config import get_settings
from app.models.user import User
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.career_chat import CareerChat
from app.schemas.career_coach import ChatMessageBase, ChatResponse

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class CareerCoachService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-3.1-flash-lite')

    def _build_context(self, db: Session, user_id: str) -> str:
        # Retrieve User Info
        user = db.query(User).filter(User.id == user_id).first()
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        
        # Retrieve Latest Resume & Analysis
        resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
        analysis = None
        if resume:
            analysis = db.query(Analysis).filter(Analysis.resume_id == resume.id).first()

        # Build Context String
        context_parts = []
        context_parts.append(f"User Name: {user.full_name if user else 'Unknown'}")
        
        from app.models.parsed_resume import ParsedResume
        parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume.id).first() if resume else None

        if profile:
            context_parts.append(f"Skills (Profile): {profile.skills or 'Not provided'}")
            context_parts.append(f"Bio: {profile.bio or 'Not provided'}")
            
        if parsed:
            context_parts.append(f"Education: {parsed.education or 'Not provided'}")
            context_parts.append(f"Experience: {parsed.experience or 'Not provided'}")
            context_parts.append(f"Projects: {parsed.projects or 'Not provided'}")
            context_parts.append(f"Certifications: {parsed.certifications or 'Not provided'}")

        if analysis:
            context_parts.append(f"Resume Score: {analysis.overall_score}")
            context_parts.append(f"ATS Score: {analysis.ats_score}")
            context_parts.append(f"Strengths: {', '.join(analysis.strengths) if analysis.strengths else 'None'}")
            context_parts.append(f"Weaknesses: {', '.join(analysis.weaknesses) if analysis.weaknesses else 'None'}")
            context_parts.append(f"Missing Keywords: {', '.join(analysis.missing_keywords) if analysis.missing_keywords else 'None'}")
        
        context_str = "\n".join(context_parts)
        
        system_prompt = (
            "You are an experienced Career Mentor. Your responses should be Professional, Encouraging, Practical, and Personalized.\n"
            "Always reference the user's uploaded resume and previous analysis if relevant. Never provide generic advice.\n"
            "Below is the user's context gathered from their profile and their latest AI Resume Analysis:\n"
            "=========================================================\n"
            f"{context_str}\n"
            "=========================================================\n"
        )
        return system_prompt

    def chat(self, db: Session, user_id: str, message: str) -> str:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set.")

        # Ensure user has a resume and analysis
        resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
        if not resume:
            raise ValueError("No uploaded resume found. Please upload a resume first to use the Career Coach.")
            
        analysis = db.query(Analysis).filter(Analysis.resume_id == resume.id).first()
        if not analysis:
            raise ValueError("No AI analysis available for your resume yet. Please wait for the analysis to finish.")

        context = self._build_context(db, user_id)
        
        # Retrieve recent history (last 20 messages to keep context window reasonable)
        history = db.query(CareerChat).filter(CareerChat.user_id == user_id).order_by(CareerChat.created_at.asc()).all()
        history_parts = []
        for h in history[-20:]:
            history_parts.append({"role": "user" if h.role == "user" else "model", "parts": [h.message]})

        # Initialize the chat session with history
        chat_session = self.model.start_chat(history=history_parts)
        
        # Combine System Prompt and User Message for the new turn
        # Since 'system_instruction' parameter might not be supported in older genai versions, we prepend it to the message if this is the first turn, 
        # or we could just inject it into the message explicitly to remind the AI.
        full_message = f"{context}\n\nUser Question:\n{message}"

        # Send to Gemini
        try:
            logger.info("Sending message to Career Coach AI...")
            response = chat_session.send_message(full_message)
            reply = response.text

            # Save to DB
            user_msg = CareerChat(user_id=user_id, role="user", message=message)
            ai_msg = CareerChat(user_id=user_id, role="assistant", message=reply)
            db.add(user_msg)
            db.add(ai_msg)
            db.commit()

            return reply
        except Exception as e:
            logger.error(f"Gemini API error in Career Coach: {e}")
            raise ValueError("Failed to generate a response from the AI Mentor. Please try again.")

    def get_history(self, db: Session, user_id: str):
        return db.query(CareerChat).filter(CareerChat.user_id == user_id).order_by(CareerChat.created_at.asc()).all()

    def clear_history(self, db: Session, user_id: str):
        db.query(CareerChat).filter(CareerChat.user_id == user_id).delete()
        db.commit()

career_coach_service = CareerCoachService()
