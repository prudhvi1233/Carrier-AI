import json
import logging
import uuid
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.config.config import get_settings
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.interview import InterviewSession

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class InterviewService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-flash-latest')

    def _clean_json(self, text: str) -> dict:
        if text.startswith("```json"):
            text = text.replace("```json", "", 1)
        if text.startswith("```"):
            text = text.replace("```", "", 1)
        if text.endswith("```"):
            text = text[::-1].replace("```", "", 1)[::-1]
        return json.loads(text.strip())

    def start_interview(self, db: Session, user_id: str, job_role: str, interview_type: str, difficulty: str):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set.")

        resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
        if not resume:
            raise ValueError("No uploaded resume found.")

        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        analysis = db.query(Analysis).filter(Analysis.resume_id == resume.id).first()
        
        from app.models.parsed_resume import ParsedResume
        parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume.id).first() if resume else None

        skills_ctx = profile.skills if profile and profile.skills else "Not provided"
        exp_ctx = parsed.experience if parsed and parsed.experience else "Not provided"

        profile_ctx = f"Skills: {skills_ctx}\nExperience: {exp_ctx}"
        analysis_ctx = f"Strengths: {', '.join(analysis.strengths)}\nWeaknesses: {', '.join(analysis.weaknesses)}" if analysis else "No analysis data"

        prompt = f"""
You are an expert AI Technical Interviewer and Hiring Manager.
Create an interview session for the candidate.

Candidate Context:
Job Role Applied For: {job_role}
Interview Type: {interview_type}
Difficulty: {difficulty}
Profile: {profile_ctx}
AI Analysis: {analysis_ctx}

Generate 10-15 highly personalized questions.
Return ONLY valid JSON.
{{
 "session": {{
    "role": "{job_role}",
    "difficulty": "{difficulty}",
    "estimated_duration": "30 minutes",
    "questions": [
      {{
        "question": "string",
        "category": "string",
        "difficulty": "string",
        "expected_points": ["string", "string"],
        "sample_answer": "string",
        "follow_up_questions": ["string", "string"]
      }}
    ]
 }}
}}
"""
        logger.info(f"Generating {interview_type} interview for {job_role}")
        response = self.model.generate_content(prompt)
        data = self._clean_json(response.text)
        
        session_data = data.get("session", {})
        questions = session_data.get("questions", [])

        session_id = str(uuid.uuid4())
        new_session = InterviewSession(
            id=session_id,
            user_id=user_id,
            resume_id=resume.id,
            job_role=job_role,
            interview_type=interview_type,
            difficulty=difficulty,
            questions=questions,
            answers=[],
            score=None,
            feedback=None
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return new_session

    def evaluate_answer(self, db: Session, user_id: str, session_id: str, question_index: int, answer: str):
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id).first()
        if not session:
            raise ValueError("Session not found")
            
        questions = session.questions
        if question_index >= len(questions):
            raise ValueError("Invalid question index")
            
        question_data = questions[question_index]
        
        prompt = f"""
You are an expert AI Interviewer. Evaluate the candidate's answer.

Question: {question_data.get('question')}
Expected Points: {', '.join(question_data.get('expected_points', []))}
Candidate's Answer: {answer}

Provide an evaluation in ONLY valid JSON.
{{
  "score": number (0-100),
  "communication_score": number (0-100),
  "technical_score": number (0-100),
  "confidence_score": number (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvement_suggestions": ["string"],
  "ideal_answer": "string",
  "follow_up_asked": "string (optional, if answer is very weak)"
}}
"""
        response = self.model.generate_content(prompt)
        evaluation = self._clean_json(response.text)
        
        # Ensure answers list is large enough
        answers = list(session.answers)
        while len(answers) <= question_index:
            answers.append(None)
            
        answers[question_index] = {
            "answer": answer,
            "evaluation": evaluation
        }
        
        session.answers = answers
        db.commit()
        db.refresh(session)
        
        return evaluation

    def complete_interview(self, db: Session, user_id: str, session_id: str):
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id).first()
        if not session:
            raise ValueError("Session not found")
            
        # Filter out unanswered questions
        answered_evals = [ans.get("evaluation", {}) for ans in session.answers if ans is not None]
        if not answered_evals:
            raise ValueError("No answers to evaluate")
            
        avg_score = sum(e.get("score", 0) for e in answered_evals) // len(answered_evals)
        avg_tech = sum(e.get("technical_score", 0) for e in answered_evals) // len(answered_evals)
        avg_comm = sum(e.get("communication_score", 0) for e in answered_evals) // len(answered_evals)
        
        prompt = f"""
You are an expert AI Hiring Manager. Generate a final interview report.

Candidate Role: {session.job_role}
Average Score: {avg_score}
Technical Score: {avg_tech}
Communication Score: {avg_comm}

Provide a comprehensive final report in ONLY valid JSON.
{{
  "overall_score": {avg_score},
  "technical_score": {avg_tech},
  "communication_score": {avg_comm},
  "confidence_score": number (0-100),
  "weak_areas": ["string"],
  "strong_areas": ["string"],
  "recommended_learning_topics": ["string"],
  "interview_readiness": "string (e.g. Not Ready, Needs Practice, Ready, Highly Recommended)",
  "hiring_recommendation": "string (Hire, No Hire, Borderline)",
  "final_summary": "string"
}}
"""
        response = self.model.generate_content(prompt)
        report = self._clean_json(response.text)
        
        session.score = avg_score
        session.feedback = report
        db.commit()
        db.refresh(session)
        
        return session

interview_service = InterviewService()
