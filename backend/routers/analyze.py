"""
routers/analyze.py
POST /analyze_resume
Runs:
  1. Rule-based ATS scoring
  2. spaCy NLP pipeline (tokenization, lemmatization, NER, TF-IDF, skills)
  3. Groq LLM deep analysis
Returns combined results to frontend.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ats_scorer import score_resume
from services.llm_service import analyze_resume
from nlp.pipeline import run_nlp_pipeline
from models.schemas import AnalyzeResponse

router = APIRouter()


class AnalyzeRequest(BaseModel):
    resume_text: str


@router.post("")
async def analyze(body: AnalyzeRequest):
    if len(body.resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text is too short.")

    # 1. Rule-based ATS score
    ats = score_resume(body.resume_text)

    # 2. spaCy NLP Pipeline
    try:
        nlp_results = run_nlp_pipeline(body.resume_text)
    except Exception as e:
        nlp_results = {"error": str(e)}

    # 3. LLM deep analysis
    try:
        llm_result = analyze_resume(body.resume_text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM analysis failed: {str(e)}")

    # Combine everything
    return {
        "ats_score": ats,
        "nlp_analysis": nlp_results,
        **llm_result,
    }