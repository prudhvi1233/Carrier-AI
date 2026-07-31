import os
import json
import google.generativeai as genai
from app.config.config import get_settings

def analyze_resume(resume_text: str) -> dict:
    settings = get_settings()
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-3.5-flash')
    
    prompt = f"""
You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
Analyze the following resume text and provide structured feedback.
Return a valid JSON object with EXACTLY these keys:
- overall_score (integer between 0-100)
- ats_score (integer between 0-100)
- technical_skills (list of strings)
- soft_skills (list of strings)
- strengths (list of strings)
- weaknesses (list of strings)
- missing_skills (list of strings)
- grammar_issues (list of strings, leave empty if none)
- formatting_issues (list of strings, leave empty if none)
- suggestions (list of strings)
- career_summary (string)
- interview_readiness (string)

Resume Text:
{resume_text}
"""
    
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            response_mime_type="application/json",
        )
    )
    
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        print("Failed to decode JSON from Gemini response:", response.text)
        return {}
