import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts raw text from a PDF file using PyMuPDF."""
    text_content = []
    try:
        doc = fitz.open(file_path)
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

def extract_structured_data_from_pdf(file_path: str) -> list:
    """Extracts structured text blocks with bounding boxes and styles."""
    pages = []
    try:
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_dict = page.get_text("dict")
            
            blocks = []
            for b_idx, block in enumerate(page_dict.get("blocks", [])):
                if block.get("type") == 0:  # Text block
                    lines = []
                    for l_idx, line in enumerate(block.get("lines", [])):
                        spans = []
                        for s_idx, span in enumerate(line.get("spans", [])):
                            spans.append({
                                "text": span.get("text", ""),
                                "bbox": span.get("bbox", []),
                                "font": span.get("font", ""),
                                "size": span.get("size", 12),
                                "color": span.get("color", 0),
                                "span_id": f"p{page_num}-b{b_idx}-l{l_idx}-s{s_idx}"
                            })
                        lines.append({
                            "bbox": line.get("bbox", []),
                            "spans": spans
                        })
                    
                    # Compute block text and a rough block bbox
                    block_text = "".join(
                        "".join(span["text"] for span in line["spans"]) 
                        + "\n" for line in lines
                    ).strip()
                    
                    if block_text:
                        # Find primary font and size for this block
                        primary_font = "helv"
                        primary_size = 12
                        primary_color = 0
                        if lines and lines[0]["spans"]:
                            primary_font = lines[0]["spans"][0].get("font", "helv")
                            primary_size = lines[0]["spans"][0].get("size", 12)
                            primary_color = lines[0]["spans"][0].get("color", 0)
                            
                        blocks.append({
                            "block_id": f"p{page_num}-b{b_idx}",
                            "text": block_text,
                            "bbox": block.get("bbox", []),
                            "lines": lines,
                            "font": primary_font,
                            "size": primary_size,
                            "color": primary_color
                        })
            
            pages.append({
                "page_num": page_num,
                "width": page.rect.width,
                "height": page.rect.height,
                "blocks": blocks
            })
            
        doc.close()
        return pages
    except Exception as e:
        logger.error(f"Failed to parse structured PDF {file_path}: {e}")
        raise ValueError(f"Failed to parse structured PDF: {str(e)}")

import os
import tempfile

def apply_edits_to_pdf(file_path: str, edits: list) -> str:
    """Applies text replacements to a PDF and returns the new file path."""
    try:
        doc = fitz.open(file_path)
        for edit in edits:
            page_num = edit.get("page_num")
            bbox = edit.get("bbox")
            new_text = edit.get("improved")
            size = edit.get("size", 12)
            
            if page_num is not None and bbox and new_text:
                page = doc.load_page(page_num)
                rect = fitz.Rect(bbox)
                
                # Redact the old text
                page.add_redact_annot(rect, fill=(1, 1, 1)) # fill white
                page.apply_redactions()
                
                # Insert new text
                # We use a standard font for now as custom font embedding is too complex
                page.insert_textbox(rect, new_text, fontsize=size, fontname="helv", color=(0,0,0))
                
        fd, temp_path = tempfile.mkstemp(suffix=".pdf")
        os.close(fd)
        doc.save(temp_path)
        doc.close()
        return temp_path
    except Exception as e:
        logger.error(f"Failed to apply edits to PDF: {e}")
        raise ValueError(f"Failed to apply edits to PDF: {str(e)}")
