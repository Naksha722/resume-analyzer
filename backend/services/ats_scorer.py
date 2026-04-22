"""
services/ats_scorer.py
Rule-based ATS scoring algorithm.
Scores a resume out of 100 based on structure, keywords, and formatting signals.
"""
import re
from typing import Dict


# Common ATS-friendly section headers
SECTION_HEADERS = [
    "experience", "work experience", "employment", "education", "skills",
    "summary", "objective", "projects", "certifications", "achievements",
    "languages", "publications", "volunteer", "awards",
]

# High-value action verbs
ACTION_VERBS = [
    "led", "built", "developed", "designed", "managed", "improved",
    "increased", "reduced", "delivered", "launched", "created", "achieved",
    "implemented", "collaborated", "analyzed", "optimized", "automated",
    "mentored", "coordinated", "negotiated",
]

# Quantification signals
QUANT_PATTERNS = [
    r"\d+%",           # percentages
    r"\$[\d,]+",       # dollar amounts
    r"\d+[kKmMbB]",   # abbreviated numbers
    r"\d+ (users|clients|customers|projects|team|members|years|months)",
]


def score_resume(text: str) -> Dict:
    """
    Returns a score dict:
    {
      "total": 78,
      "breakdown": {
        "sections": 25,
        "action_verbs": 20,
        "quantification": 15,
        "contact_info": 10,
        "length": 8,
      },
      "feedback": ["Missing certifications section", ...]
    }
    """
    text_lower = text.lower()
    breakdown = {}
    feedback = []

    # --- 1. Section headers (max 25 pts) ---
    found_sections = [s for s in SECTION_HEADERS if s in text_lower]
    section_score = min(25, len(found_sections) * 4)
    breakdown["sections"] = section_score
    if len(found_sections) < 4:
        feedback.append(f"Only {len(found_sections)} standard sections found. Add Experience, Education, Skills, Summary.")

    # --- 2. Action verbs (max 20 pts) ---
    found_verbs = [v for v in ACTION_VERBS if re.search(rf"\b{v}\b", text_lower)]
    verb_score = min(20, len(found_verbs) * 2)
    breakdown["action_verbs"] = verb_score
    if len(found_verbs) < 5:
        feedback.append("Use more strong action verbs (led, built, improved, delivered…).")

    # --- 3. Quantification (max 20 pts) ---
    quant_hits = sum(len(re.findall(p, text)) for p in QUANT_PATTERNS)
    quant_score = min(20, quant_hits * 4)
    breakdown["quantification"] = quant_score
    if quant_hits < 3:
        feedback.append("Add more quantified achievements (e.g. 'Reduced costs by 30%').")

    # --- 4. Contact info (max 15 pts) ---
    contact_score = 0
    if re.search(r"[\w.+-]+@[\w-]+\.\w+", text):
        contact_score += 5
    if re.search(r"(\+?\d[\d\s\-().]{7,}\d)", text):
        contact_score += 5
    if re.search(r"linkedin\.com", text_lower):
        contact_score += 5
    breakdown["contact_info"] = contact_score
    if contact_score < 15:
        feedback.append("Ensure email, phone, and LinkedIn URL are present.")

    # --- 5. Length check (max 10 pts) ---
    word_count = len(text.split())
    if 400 <= word_count <= 800:
        length_score = 10
    elif word_count < 200:
        length_score = 3
        feedback.append("Resume seems too short. Aim for 400–800 words.")
    elif word_count > 1200:
        length_score = 5
        feedback.append("Resume may be too long. ATS systems prefer concise resumes.")
    else:
        length_score = 7
    breakdown["length"] = length_score

    # --- 6. Keywords density (max 10 pts) ---
    keyword_density = min(10, int((len(found_sections) + len(found_verbs)) / 3))
    breakdown["keywords"] = keyword_density

    total = sum(breakdown.values())

    return {
        "total": min(100, total),
        "breakdown": breakdown,
        "feedback": feedback,
        "word_count": word_count,
        "sections_found": found_sections,
    }
