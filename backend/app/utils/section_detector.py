import re

SECTION_KEYWORDS = {
    "summary": ["summary", "profile", "objective", "professional summary", "about me"],
    "experience": ["experience", "work experience", "employment history", "professional experience", "work history"],
    "education": ["education", "academic background", "academic history", "degrees"],
    "skills": ["skills", "technical skills", "core competencies", "technologies", "tech stack"],
    "projects": ["projects", "personal projects", "academic projects", "open source"],
    "certifications": ["certifications", "certificates", "licenses"],
    "achievements": ["achievements", "awards", "honors", "competitions", "hackathons"],
    "languages": ["languages", "spoken languages"]
}

def detect_sections(text: str) -> dict:
    """Slices the text into categorized chunks based on known headers."""
    sections = {key: "" for key in SECTION_KEYWORDS.keys()}
    lines = text.split('\n')
    
    current_section = None
    
    for line in lines:
        cleaned_line = line.strip().lower()
        # Look for headers (short lines that match keywords)
        if len(cleaned_line) < 40:
            found_section = None
            for section, keywords in SECTION_KEYWORDS.items():
                # Exact or very close match
                if any(kw == cleaned_line or kw + ":" == cleaned_line for kw in keywords):
                    found_section = section
                    break
            
            if found_section:
                current_section = found_section
                continue
                
        if current_section:
            sections[current_section] += line + "\n"
            
    return {k: v.strip() for k, v in sections.items() if v.strip()}
