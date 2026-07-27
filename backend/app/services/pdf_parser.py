import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts raw text from a PDF file using PyMuPDF."""
    text_content = []
    
    try:
        # Open the document
        doc = fitz.open(file_path)
        
        # Iterate over pages
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text()
            if text:
                text_content.append(text)
                
        doc.close()
        return "\n".join(text_content)
    except Exception as e:
        logger.error(f"Failed to parse PDF {file_path}: {e}")
        raise ValueError(f"Failed to parse PDF: {str(e)}")
