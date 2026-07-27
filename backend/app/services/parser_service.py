import logging
import uuid
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.parsed_resume import ParsedResume
from app.models.profile import Profile
from app.services.pdf_parser import extract_text_from_pdf
from app.services.docx_parser import extract_text_from_docx
from app.services.resume_parser import parse_resume_text

logger = logging.getLogger(__name__)

def process_resume(db: Session, resume: Resume) -> ParsedResume:
    """Extracts text, parses it, saves to DB, and enriches user profile."""
    # 1. Extract Text
    file_path = f"app/{resume.file_path}"
    if file_path.lower().endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".docx"):
        raw_text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format for parsing")
        
    if not raw_text.strip():
        raise ValueError("Could not extract any text from the file")

    # 2. Parse Text
    parsed_data = parse_resume_text(raw_text)
    
    # 3. Save ParsedResume
    # Check if one already exists
    existing_parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume.id).first()
    if existing_parsed:
        db.delete(existing_parsed)
        db.commit()

    parsed_resume = ParsedResume(
        id=str(uuid.uuid4()),
        resume_id=resume.id,
        user_id=resume.user_id,
        full_name=parsed_data.get('full_name'),
        email=parsed_data.get('email'),
        phone=parsed_data.get('phone'),
        linkedin=parsed_data.get('linkedin'),
        github=parsed_data.get('github'),
        summary=parsed_data.get('summary'),
        skills=parsed_data.get('skills', []),
        education=parsed_data.get('education', []),
        experience=parsed_data.get('experience', []),
        projects=parsed_data.get('projects', []),
        certifications=parsed_data.get('certifications', []),
        languages=parsed_data.get('languages', []),
        achievements=parsed_data.get('achievements', []),
        raw_text=parsed_data.get('raw_text', '')
    )
    
    db.add(parsed_resume)
    
    # 4. Auto-Enrich Profile
    profile = db.query(Profile).filter(Profile.user_id == resume.user_id).first()
    if profile:
        profile_updated = False
        
        # Only enrich empty fields!
        if not profile.phone and parsed_resume.phone:
            profile.phone = parsed_resume.phone
            profile_updated = True
            
        if not profile.linkedin_url and parsed_resume.linkedin:
            profile.linkedin_url = parsed_resume.linkedin
            profile_updated = True
            
        if not profile.github_url and parsed_resume.github:
            profile.github_url = parsed_resume.github
            profile_updated = True
            
        # Combine skills
        if parsed_resume.skills:
            current_skills_str = profile.skills or ""
            # Split by comma if it's a string, strip whitespace, filter out empty strings
            current_skills = [s.strip() for s in current_skills_str.split(',')] if current_skills_str else []
            
            # Merge and remove duplicates case-insensitively
            merged = {s.lower(): s for s in current_skills if s}
            for s in parsed_resume.skills:
                if s and s.strip().lower() not in merged:
                    merged[s.strip().lower()] = s.strip()
                    
            new_skills = list(merged.values())
            
            if len(new_skills) > len(current_skills):
                profile.skills = ", ".join(new_skills)
                profile_updated = True
                
        if profile_updated:
            # We would usually trigger calculate_completion() here, but for simplicity it's handled on read/update
            # We'll just let it calculate next time or do it here
            db.add(profile)
            
    db.commit()
    db.refresh(parsed_resume)
    return parsed_resume
