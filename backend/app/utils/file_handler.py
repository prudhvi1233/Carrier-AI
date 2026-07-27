import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException, status
from loguru import logger
from app.config.config import get_settings

settings = get_settings()

ALLOWED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

class StorageService:
    def __init__(self, backend_type: str = "local"):
        self.backend_type = backend_type
        self.upload_dir = "app/uploads/resumes"
        if self.backend_type == "local":
            os.makedirs(self.upload_dir, exist_ok=True)

    def validate_file(self, file: UploadFile, is_image: bool = False):
        filename = file.filename.lower()
        if is_image:
            is_valid_ext = filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png') or filename.endswith('.webp')
        else:
            is_valid_ext = filename.endswith('.pdf') or filename.endswith('.docx')
            
        if file.content_type not in ALLOWED_MIME_TYPES and not is_valid_ext:
            logger.warning(f"Invalid file type uploaded: {file.content_type}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only PDF and DOCX are allowed."
            )
        return True

    def generate_unique_filename(self, original_name: str, content_type: str) -> str:
        ext = ALLOWED_MIME_TYPES.get(content_type, "")
        if not ext and original_name.endswith('.pdf'):
            ext = '.pdf'
        elif not ext and original_name.endswith('.docx'):
            ext = '.docx'
        elif not ext and (original_name.endswith('.jpg') or original_name.endswith('.jpeg')):
            ext = '.jpg'
        elif not ext and original_name.endswith('.png'):
            ext = '.png'
            
        unique_id = uuid.uuid4().hex
        return f"{unique_id}{ext}"

    def save_file(self, file: UploadFile, sub_dir: str = "resumes") -> tuple[str, int]:
        if self.backend_type == "s3":
            logger.info(f"Saving {file.filename} to S3...")
            # Placeholder for S3 Implementation using boto3
            # return s3_save(file)
            pass
            
        # Default Local Storage
        file_name = self.generate_unique_filename(file.filename, file.content_type)
        target_dir = os.path.join("app/uploads", sub_dir)
        os.makedirs(target_dir, exist_ok=True)
        file_path = os.path.join(target_dir, file_name)
        
        file_size = 0
        with open(file_path, "wb") as buffer:
            while True:
                chunk = file.file.read(1024 * 1024)  # 1MB chunks
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    buffer.close()
                    os.remove(file_path)
                    logger.error(f"File size exceeded limit: {file_size} bytes")
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File size exceeds the 10MB limit."
                    )
                buffer.write(chunk)
                
        file.file.seek(0)
        logger.info(f"File saved locally: {file_name} ({file_size} bytes)")
        return (f"uploads/{sub_dir}/{file_name}", file_size)

    def delete_file(self, file_path: str):
        if self.backend_type == "s3":
            logger.info(f"Deleting {file_path} from S3...")
            return True
            
        full_path = os.path.join("app", file_path)
        if os.path.exists(full_path):
            os.remove(full_path)
            logger.info(f"File deleted locally: {file_path}")
            return True
        return False

# Singleton instance
storage = StorageService(backend_type=settings.STORAGE_BACKEND)

# Proxy functions for backward compatibility with existing codebase
def validate_file(file: UploadFile, is_image: bool = False):
    return storage.validate_file(file, is_image)

def save_file(file: UploadFile, sub_dir: str = "resumes") -> tuple[str, int]:
    return storage.save_file(file, sub_dir)

def delete_file(file_path: str):
    return storage.delete_file(file_path)
