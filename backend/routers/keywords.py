"""
routers/keywords.py
POST /suggest_keywords — returns keyword gap analysis
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.llm_service import suggest_keywords
from models.schemas import KeywordsResponse

router = APIRouter()


class KeywordsRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""


@router.post("", response_model=KeywordsResponse)
async def keywords(body: KeywordsRequest):
    if len(body.resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text is too short.")

    try:
        result = suggest_keywords(body.resume_text, body.job_description or "")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Keyword analysis failed: {str(e)}")

    return KeywordsResponse(**result)
