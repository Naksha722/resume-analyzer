"""
models/schemas.py
Pydantic models for all request/response shapes.
"""
from pydantic import BaseModel
from typing import List, Dict, Optional


class UploadResponse(BaseModel):
    text: str
    word_count: int
    char_count: int
    pages_estimate: int


class ATSBreakdown(BaseModel):
    sections: int
    action_verbs: int
    quantification: int
    contact_info: int
    length: int
    keywords: int


class ATSScore(BaseModel):
    total: int
    breakdown: ATSBreakdown
    feedback: List[str]
    word_count: int
    sections_found: List[str]


class AnalyzeResponse(BaseModel):
    ats_score: ATSScore
    name: str
    current_role: str
    years_experience: int
    top_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    industry: str
    career_level: str
    summary: str


class KeywordCategories(BaseModel):
    technical_skills: List[str]
    soft_skills: List[str]
    tools: List[str]
    certifications: List[str]


class KeywordsResponse(BaseModel):
    present_keywords: List[str]
    missing_keywords: List[str]
    high_priority: List[str]
    keyword_categories: KeywordCategories
    tips: List[str]


class BulletImprovement(BaseModel):
    original: str
    improved: str
    reason: str


class SectionSuggestion(BaseModel):
    section: str
    suggestion: str


class EnhanceResponse(BaseModel):
    improved_summary: str
    bullet_improvements: List[BulletImprovement]
    section_suggestions: List[SectionSuggestion]
    ats_tips: List[str]
    overall_advice: str
