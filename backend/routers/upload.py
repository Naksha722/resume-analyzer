"""
routers/upload.py
POST /upload_pdf  — accepts a PDF file, returns extracted text + metadata
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_extractor import extract_text_from_pdf
from models.schemas import UploadResponse

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    pdf_bytes = await file.read()

    if len(pdf_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size is 5 MB.")

    try:
        text = extract_text_from_pdf(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not extract text: {str(e)}")

    if len(text.strip()) < 10:
        raise HTTPException(status_code=422, detail="PDF appears to be empty or image-only (scanned). Please use a text-based PDF.")

    word_count = len(text.split())
    char_count = len(text)
    pages_estimate = max(1, char_count // 2500)

    return UploadResponse(
        text=text,
        word_count=word_count,
        char_count=char_count,
        pages_estimate=pages_estimate,
    )
