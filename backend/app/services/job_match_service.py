import google.generativeai as genai
import json
from app.config.config import get_settings
from loguru import logger

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-3.5-flash')

class JobMatchService:
    def analyze_match(self, resume_text: str, job_title: str, job_description: str) -> dict:
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) and Career Coach.
        I will provide a parsed resume and a job description.
        You need to compare the resume against the job description and output a detailed JSON analysis.

        Resume text:
        '''{resume_text}'''

        Job Title: {job_title}
        Job Description:
        '''{job_description}'''

        Provide the output as a clean, strictly formatted JSON object with no markdown wrappers (like ```json), no formatting, and exactly these keys:
        {{
            "match_score": int, (A score from 0 to 100 indicating how well the resume matches the job)
            "matching_skills": list[str], (A list of skills present in both the resume and the job description)
            "missing_skills": list[str], (A list of skills requested in the job description but missing from the resume)
            "recommendations": list[str] (A list of 3-5 actionable bullet points on how to tailor the resume to better fit this role)
        }}
        """

        try:
            response = model.generate_content(prompt)
            result_text = response.text.strip()
            if result_text.startswith("```json"):
                result_text = result_text[7:-3].strip()
            
            return json.loads(result_text)
        except Exception as e:
            logger.error(f"Error in JobMatchService: {e}")
            raise ValueError("Failed to analyze job match with AI.")

job_match_service = JobMatchService()
