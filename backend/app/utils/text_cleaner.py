import re

def clean_text(text: str) -> str:
    """Removes duplicate spaces, extra line breaks, and invisible characters."""
    if not text:
        return ""
    
    # Replace broken Unicode or strange characters
    text = text.replace('\xa0', ' ').replace('\u200b', '')
    
    # Normalize multiple line breaks to single line breaks or double line breaks based on context
    # Usually in resumes, double breaks separate sections
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Normalize spaces
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Strip leading/trailing whitespace
    return text.strip()
