import os
import json
import google.generativeai as genai
from app.config.config import get_settings

def get_model():
    settings = get_settings()
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-3.1-flash-lite')

def suggest_edits_for_blocks(blocks: list, user_prompt: str = None) -> dict:
    """
    Takes a list of blocks [{"block_id": "...", "text": "..."}] and suggests edits.
    Returns a dict with 'edits': [{"block_id", "original", "improved", "reason"}]
    """
    model = get_model()
    
    blocks_json = json.dumps(blocks, indent=2)
    
    if user_prompt:
        instruction = f"""
        The user wants to edit their resume based on the following instruction: "{user_prompt}"
        Only edit blocks that are relevant to this instruction.
        """
    else:
        instruction = """
        Your task is to auto-improve the provided resume text blocks.
        - Rewrite weak bullet points to include strong action verbs and measurable results where possible.
        - Improve grammar, spelling, and readability.
        - Optimize keywords for ATS.
        - Only suggest edits for blocks that actually need improvement. Leave perfect blocks alone.
        """

    prompt = f"""
You are an expert ATS resume writer and editor.
You are given a JSON array of text blocks from a resume. Each block has a 'block_id' and 'text'.

{instruction}

- NEVER hallucinate or invent fake experiences, jobs, or education. Only enhance the existing information.
- Provide your suggestions as a list of exact text replacements for specific blocks.

Return a valid JSON object with EXACTLY this structure:
{{
  "edits": [
    {{
      "block_id": "string",
      "original": "string (the exact original text)",
      "improved": "string (the new improved text)",
      "reason": "string (short explanation of why this was changed)"
    }}
  ]
}}

Resume Blocks:
{blocks_json}
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
        return {"edits": []}
