import re

def extract_email(text: str) -> str | None:
    match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    return match.group(0) if match else None

def extract_phone(text: str) -> str | None:
    # Basic phone extraction: allows +, -, (, ), spaces, and digits
    # Length between 10 to 15 digits roughly
    match = re.search(r'\+?\d{1,3}?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', text)
    if match:
        cleaned = re.sub(r'[^\d+]', '', match.group(0))
        if 10 <= len(cleaned) <= 15:
            return cleaned
    return None

def extract_linkedin(text: str) -> str | None:
    match = re.search(r'(https?://(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+/?)', text, re.IGNORECASE)
    return match.group(0) if match else None

def extract_github(text: str) -> str | None:
    match = re.search(r'(https?://(?:www\.)?github\.com/[a-zA-Z0-9_-]+/?)', text, re.IGNORECASE)
    return match.group(0) if match else None
