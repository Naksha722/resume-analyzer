"""
services/llm_service.py
Uses Groq API (free tier) with llama-3.3-70b model.
Groq is completely free with generous limits.
"""
import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"  # free and very capable


def _call_groq(system_prompt: str, user_content: str) -> str:
    """Base helper — returns raw text from Groq."""
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0.3,
        max_tokens=2000,
    )
    return response.choices[0].message.content


def _parse_json(raw: str) -> dict:
    """Strip markdown code fences and parse JSON."""
    clean = raw.strip()
    if "```" in clean:
        parts = clean.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            try:
                return json.loads(part)
            except:
                continue
    return json.loads(clean)


# ---------------------------------------------------------------------------
# 1. Full resume analysis
# ---------------------------------------------------------------------------
ANALYZE_SYSTEM = """
You are an expert resume analyst and career coach.
Analyze the resume text provided and return ONLY a valid JSON object.
No markdown, no explanation, no code fences — just raw JSON.
Use this exact structure:
{
  "name": "Candidate name or Unknown",
  "current_role": "Most recent job title",
  "years_experience": 0,
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "missing_skills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "industry": "Detected industry",
  "career_level": "Junior",
  "summary": "2-3 sentence professional summary of the candidate"
}
career_level must be exactly one of: Junior, Mid, Senior, Executive
"""

def analyze_resume(resume_text: str) -> dict:
    raw = _call_groq(ANALYZE_SYSTEM, f"Resume:\n\n{resume_text}")
    return _parse_json(raw)


# ---------------------------------------------------------------------------
# 2. Keyword suggestions
# ---------------------------------------------------------------------------
KEYWORDS_SYSTEM = """
You are an ATS optimization specialist.
Analyze the resume and optional job description provided.
Return ONLY a valid JSON object. No markdown, no explanation, no code fences — just raw JSON.
Use this exact structure:
{
  "present_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "high_priority": ["keyword1", "keyword2", "keyword3"],
  "keyword_categories": {
    "technical_skills": ["skill1", "skill2"],
    "soft_skills": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "certifications": ["cert1"]
  },
  "tips": ["tip1", "tip2", "tip3"]
}
"""

def suggest_keywords(resume_text: str, job_description: str = "") -> dict:
    content = f"Resume:\n\n{resume_text}"
    if job_description:
        content += f"\n\nJob Description:\n\n{job_description}"
    raw = _call_groq(KEYWORDS_SYSTEM, content)
    return _parse_json(raw)


# ---------------------------------------------------------------------------
# 3. Resume enhancement
# ---------------------------------------------------------------------------
ENHANCE_SYSTEM = """
You are a professional resume writer specializing in ATS optimization.
Analyze the resume provided and return ONLY a valid JSON object.
No markdown, no explanation, no code fences — just raw JSON.
Use this exact structure:
{
  "improved_summary": "A rewritten professional summary (3-4 sentences)",
  "bullet_improvements": [
    {
      "original": "original bullet point text",
      "improved": "improved version with strong action verb and quantification",
      "reason": "why this is better"
    },
    {
      "original": "another bullet point",
      "improved": "improved version",
      "reason": "why this is better"
    },
    {
      "original": "another bullet point",
      "improved": "improved version",
      "reason": "why this is better"
    },
    {
      "original": "another bullet point",
      "improved": "improved version",
      "reason": "why this is better"
    }
  ],
  "section_suggestions": [
    {
      "section": "Experience",
      "suggestion": "specific improvement advice"
    },
    {
      "section": "Skills",
      "suggestion": "specific improvement advice"
    },
    {
      "section": "Education",
      "suggestion": "specific improvement advice"
    }
  ],
  "ats_tips": ["tip1", "tip2", "tip3", "tip4"],
  "overall_advice": "2-3 sentences of overall career advice"
}
"""

def improve_resume(resume_text: str) -> dict:
    raw = _call_groq(ENHANCE_SYSTEM, f"Resume:\n\n{resume_text}")
    return _parse_json(raw)