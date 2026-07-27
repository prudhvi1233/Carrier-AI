import os
import json
from google import genai
from google.genai import types

def analyze_resume(resume_text: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    client = genai.Client(api_key=api_key)
    
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
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        )
    )
    
    try:
        result = json.loads(response.text)
        return result
    except json.JSONDecodeError:
        print("Failed to decode JSON from Gemini response:", response.text)
        return {}
