import json
import logging
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.config.config import get_settings
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.job_recommendation import JobRecommendation
from app.schemas.job_recommendation import JobRecommendationCreate

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class JobRecommendationService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-3.1-flash-lite')

    def generate_recommendations(self, db: Session, user_id: str):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set.")

        # Check if recommendations already exist for the latest resume
        latest_resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
        if not latest_resume:
            raise ValueError("No uploaded resume found. Please upload a resume first.")

        # Check for cached recommendations
        existing_recs = db.query(JobRecommendation).filter(
            JobRecommendation.user_id == user_id,
            JobRecommendation.resume_id == latest_resume.id
        ).all()

        if existing_recs:
            return existing_recs

        # Gather context
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        analysis = db.query(Analysis).filter(Analysis.resume_id == latest_resume.id).first()
        
        if not analysis:
            raise ValueError("No AI analysis found for the latest resume. Please wait for analysis to complete.")

        # Construct Context Strings
        # Construct Context Strings
        from app.models.parsed_resume import ParsedResume
        parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == latest_resume.id).first()
        
        profile_str = ""
        skills_ctx = profile.skills if profile and profile.skills else "Not provided"
        exp_ctx = parsed.experience if parsed and parsed.experience else "Not provided"
        profile_str = f"Skills: {skills_ctx}\nExperience: {exp_ctx}"

        analysis_str = f"""
        ATS Score: {analysis.ats_score}/100
        Overall Score: {analysis.overall_score}/100
        Strengths: {', '.join(analysis.strengths)}
        Weaknesses: {', '.join(analysis.weaknesses)}
        Missing Keywords: {', '.join(analysis.missing_keywords)}
        Experience Level: {analysis.experience_level}
        """

        prompt = f"""
You are an expert AI Career Advisor and Technical Recruiter.
Generate 5-10 personalized job recommendations for the user based on their profile, resume, and AI resume analysis.

### Smart Logic Constraints:
- If ATS score is below 70, recommend beginner-friendly/entry-level roles with high skill overlap.
- If ATS score is above 85, recommend advanced/senior roles that challenge the user.
- If user has little experience (Entry-level), recommend internships, junior roles, or entry-level positions.
- If user has high experience, recommend Lead/Architect roles at top tech product companies.

### User Context
Profile Info:
{profile_str}

Resume AI Analysis:
{analysis_str}

### Required Output Format
You MUST return ONLY valid JSON matching the exact structure below. Do not return markdown blocks like ```json ... ```. Just the raw JSON.
{{
  "recommendations": [
    {{
      "job_title": "string",
      "match_percentage": number (0-100),
      "experience_level": "string",
      "salary_range": "string (e.g., '₹8L - ₹12L')",
      "why_match": "string (1-2 sentences explaining why this fits their profile)",
      "required_skills": ["string", "string"],
      "missing_skills": ["string", "string"],
      "recommended_courses": ["string", "string"],
      "companies": ["string", "string"],
      "roadmap": ["string", "string (step-by-step to achieve this role)"]
    }}
  ]
}}
"""
        logger.info("Starting Gemini API call for job recommendations.")
        try:
            response = self.model.generate_content(prompt)
            text_response = response.text
            
            # Clean up potential markdown formatting
            if text_response.startswith("```json"):
                text_response = text_response.replace("```json", "", 1)
            if text_response.startswith("```"):
                text_response = text_response.replace("```", "", 1)
            if text_response.endswith("```"):
                text_response = text_response[::-1].replace("```", "", 1)[::-1]
                
            text_response = text_response.strip()
            data = json.loads(text_response)
            
            recommendations_data = data.get("recommendations", [])
            
            saved_recs = []
            # Save to database
            for rec_data in recommendations_data:
                # Validate with Pydantic
                valid_data = JobRecommendationCreate(**rec_data)
                
                db_rec = JobRecommendation(
                    user_id=user_id,
                    resume_id=latest_resume.id,
                    job_title=valid_data.job_title,
                    match_percentage=valid_data.match_percentage,
                    salary_range=valid_data.salary_range,
                    experience_level=valid_data.experience_level,
                    why_match=valid_data.why_match,
                    required_skills=valid_data.required_skills,
                    missing_skills=valid_data.missing_skills,
                    recommended_courses=valid_data.recommended_courses,
                    companies=valid_data.companies,
                    roadmap=valid_data.roadmap
                )
                db.add(db_rec)
                saved_recs.append(db_rec)
                
            db.commit()
            logger.info(f"Successfully generated and saved {len(saved_recs)} job recommendations.")
            return saved_recs
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Gemini: {e}")
            logger.error(f"Raw response: {text_response}")
            raise ValueError("Invalid JSON response from AI provider.")
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise ValueError(f"Job Recommendation generation failed: {str(e)}")

job_recommendation_service = JobRecommendationService()
