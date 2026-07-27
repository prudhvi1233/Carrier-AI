import json
import logging
import google.generativeai as genai
from app.config.config import get_settings
from app.schemas.analysis import AnalysisCreate

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class AIAnalysisService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-flash-latest')

    def analyze_resume(self, resume_text: str) -> AnalysisCreate:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set.")
            
        if not resume_text or len(resume_text.strip()) < 50:
            raise ValueError("Resume text is too short or empty.")
            
        prompt = f"""
You are an expert AI Resume Analyzer and Career Coach.
Analyze the following resume text and provide structured feedback.
You MUST return ONLY valid JSON matching the exact structure below. Do not return markdown blocks like ```json ... ```. Just the raw JSON.

{{
  "overall_score": number (0-100),
  "ats_score": number (0-100),
  "summary": "string (executive summary of the resume)",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missing_keywords": ["string", "string"],
  "technical_skills": ["string", "string"],
  "soft_skills": ["string", "string"],
  "experience_level": "string (e.g., Entry-level, Mid-level, Senior)",
  "recommended_roles": ["string", "string"],
  "interview_questions": ["string", "string"],
  "career_advice": ["string", "string"],
  "improvements": ["string", "string"]
}}

Resume Text:
---
{resume_text}
---
"""
        logger.info("Starting Gemini API call for resume analysis.")
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
            
            # Validate with Pydantic
            analysis_data = AnalysisCreate(**data)
            logger.info("Successfully analyzed resume and validated JSON.")
            return analysis_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Gemini: {e}")
            logger.error(f"Raw response: {text_response}")
            raise ValueError("Invalid JSON response from AI provider.")
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise ValueError(f"AI Analysis failed: {str(e)}")

ai_analysis_service = AIAnalysisService()
