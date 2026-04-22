"""
routers/enhance.py
POST /improve_resume — returns LLM-generated resume enhancements
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import improve_resume
from models.schemas import EnhanceResponse

router = APIRouter()


class EnhanceRequest(BaseModel):
    resume_text: str


@router.post("", response_model=EnhanceResponse)
async def enhance(body: EnhanceRequest):
    if len(body.resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text is too short.")

    try:
        result = improve_resume(body.resume_text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Enhancement failed: {str(e)}")

    return EnhanceResponse(**result)
