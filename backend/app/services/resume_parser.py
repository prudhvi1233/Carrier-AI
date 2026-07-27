import logging
import json
from app.utils.text_cleaner import clean_text
from app.utils.section_detector import detect_sections
from app.utils.regex_helper import extract_email, extract_phone, extract_linkedin, extract_github

logger = logging.getLogger(__name__)

def parse_resume_text(raw_text: str) -> dict:
    """Parses raw resume text into a structured dictionary."""
    cleaned_text = clean_text(raw_text)
    sections = detect_sections(cleaned_text)
    
    # Extract personal info
    email = extract_email(cleaned_text)
    phone = extract_phone(cleaned_text)
    linkedin = extract_linkedin(cleaned_text)
    github = extract_github(cleaned_text)
    
    # Extract Skills
    skills_list = []
    if sections.get('skills'):
        # Split by commas or newlines and clean
        raw_skills = sections['skills'].replace('\n', ',').split(',')
        skills_list = [s.strip().title() for s in raw_skills if s.strip()]
        # Remove duplicates while preserving order
        skills_list = list(dict.fromkeys(skills_list))
    
    def extract_section_lines(section_text: str):
        if not section_text:
            return []
        lines = [line.strip() for line in section_text.split('\n') if line.strip()]
        return lines
        
    return {
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "summary": sections.get("summary", ""),
        "skills": skills_list,
        "education": extract_section_lines(sections.get("education")),
        "experience": extract_section_lines(sections.get("experience")),
        "projects": extract_section_lines(sections.get("projects")),
        "certifications": extract_section_lines(sections.get("certifications")),
        "languages": extract_section_lines(sections.get("languages")),
        "achievements": extract_section_lines(sections.get("achievements")),
        "raw_text": cleaned_text
    }
