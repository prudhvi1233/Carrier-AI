from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.ai_analyzer import analyze_resume
from app.services.ai_editor_service import suggest_edits_for_blocks

router = APIRouter(tags=["AI Resume Editor"])

class ResumeTextRequest(BaseModel):
    text: str

class Block(BaseModel):
    block_id: str
    text: str

class SuggestEditsRequest(BaseModel):
    blocks: list[Block]
    prompt: str = None

import tempfile
import os

@router.post("/upload")
async def upload_resume_for_editing(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Parses a PDF or DOCX file to extract its structured text blocks for the AI Editor."""
    content = await file.read()
    filename = file.filename.lower()
    
    # Save to temp file because the parsers expect a file path
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
        temp_file.write(content)
        temp_path = temp_file.name
    
    try:
        pages = []
        full_text = ""
        
        if filename.endswith('.pdf'):
            from app.services.pdf_parser import extract_structured_data_from_pdf
            pages = extract_structured_data_from_pdf(temp_path)
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            from app.services.docx_parser import extract_structured_data_from_docx
            pages = extract_structured_data_from_docx(temp_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
            
        if not pages:
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")
            
        # Also compute a full_text string for backwards compatibility with the analysis endpoint
        for page in pages:
            for block in page.get("blocks", []):
                full_text += block.get("text", "") + "\n\n"
            
        return {"pages": pages, "text": full_text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/analyze")
def analyze_for_editor(
    request: ResumeTextRequest,
    current_user: User = Depends(get_current_user)
):
    """Generates the ATS score and analysis suggestions."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")
    
    result = analyze_resume(request.text)
    return result

@router.post("/suggest")
def suggest_edits(
    request: SuggestEditsRequest,
    current_user: User = Depends(get_current_user)
):
    """Suggests edits for specific blocks based on an optional user prompt."""
    if not request.blocks:
        raise HTTPException(status_code=400, detail="No blocks provided.")
    
    # Convert Pydantic models to dicts
    blocks_dict = [{"block_id": b.block_id, "text": b.text} for b in request.blocks]
    result = suggest_edits_for_blocks(blocks_dict, request.prompt)
    return result

from fastapi.responses import FileResponse

@router.post("/apply-edits")
async def apply_edits(
    file: UploadFile = File(...),
    edits_json: str = Form(...), # We send the edits as a JSON string in form data since we are uploading a file
    current_user: User = Depends(get_current_user)
):
    import json
    try:
        edits = json.loads(edits_json)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid edits JSON.")
        
    content = await file.read()
    filename = file.filename.lower()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
        temp_file.write(content)
        temp_path = temp_file.name
        
    try:
        modified_path = None
        if filename.endswith('.pdf'):
            from app.services.pdf_parser import apply_edits_to_pdf
            modified_path = apply_edits_to_pdf(temp_path, edits)
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            from app.services.docx_parser import apply_edits_to_docx
            modified_path = apply_edits_to_docx(temp_path, edits)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")
            
        return FileResponse(path=modified_path, filename=f"edited_{file.filename}", media_type="application/octet-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # Note: We cannot remove modified_path here because FileResponse needs to read it. 
    # FastAPI can use background tasks to delete it, but for this prototype it's fine.
