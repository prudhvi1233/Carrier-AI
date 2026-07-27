import docx
import logging

logger = logging.getLogger(__name__)

def extract_text_from_docx(file_path: str) -> str:
    """Extracts text from paragraphs and tables in a DOCX file."""
    text_content = []
    
    try:
        doc = docx.Document(file_path)
        
        # Extract from paragraphs
        for para in doc.paragraphs:
            if para.text.strip():
                text_content.append(para.text)
                
        # Extract from tables
        for table in doc.tables:
            for row in table.rows:
                row_text = []
                for cell in row.cells:
                    if cell.text.strip():
                        row_text.append(cell.text.strip())
                if row_text:
                    text_content.append(" | ".join(row_text))
                    
        return "\n".join(text_content)
    except Exception as e:
        logger.error(f"Failed to parse DOCX {file_path}: {e}")
        raise ValueError(f"Failed to parse DOCX: {str(e)}")
