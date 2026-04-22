"""
nlp/pipeline.py

Full NLP Pipeline for Resume Analysis
======================================
Covers these NLP concepts:
1. Tokenization        — splitting text into words
2. Lemmatization       — reducing words to base form
3. Stopword Removal    — filtering out common words
4. POS Tagging         — identifying word types (noun, verb etc)
5. Named Entity Recognition (NER) — extracting names, orgs, locations
6. TF-IDF              — finding most important keywords
7. Skill Extraction    — matching tokens against skill dictionary
"""

import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from collections import Counter
from typing import Dict, List

# Load the small English model
nlp = spacy.load("en_core_web_sm")

# ---------------------------------------------------------------------------
# Skill Dictionary — words we recognise as skills
# ---------------------------------------------------------------------------
SKILL_DICTIONARY = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby",
    "swift", "kotlin", "go", "rust", "php", "r", "matlab", "scala",

    # Web frameworks
    "react", "nextjs", "vue", "angular", "django", "fastapi", "flask",
    "express", "nodejs", "spring", "laravel",

    # Data & ML
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "matplotlib", "keras",

    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "firebase",
    "supabase", "sqlite",

    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "git",
    "github", "linux", "terraform",

    # Soft skills
    "leadership", "communication", "teamwork", "problem solving",
    "critical thinking", "project management", "agile", "scrum",

    # Tools
    "figma", "jira", "confluence", "slack", "excel", "powerpoint",
    "tableau", "power bi",
}


# ---------------------------------------------------------------------------
# MAIN PIPELINE FUNCTION
# ---------------------------------------------------------------------------
def run_nlp_pipeline(text: str) -> Dict:
    """
    Runs the full NLP pipeline on resume text.
    Returns a structured dict with all NLP analysis results.
    """
    # Process text with spaCy
    doc = nlp(text)

    return {
        "tokens":           _tokenize(doc),
        "lemmas":           _lemmatize(doc),
        "pos_tags":         _pos_tag(doc),
        "entities":         _extract_entities(doc),
        "keywords_tfidf":   _tfidf_keywords(text),
        "extracted_skills": _extract_skills(doc),
        "token_count":      len(doc),
        "sentence_count":   len(list(doc.sents)),
        "top_verbs":        _top_verbs(doc),
        "top_nouns":        _top_nouns(doc),
    }


# ---------------------------------------------------------------------------
# 1. TOKENIZATION
# Splits the resume text into individual word tokens
# ---------------------------------------------------------------------------
def _tokenize(doc) -> List[str]:
    """
    Tokenization: break text into individual word/punctuation units.
    Example: "Led a team" → ["Led", "a", "team"]
    """
    return [
        token.text
        for token in doc
        if not token.is_space and not token.is_punct
    ]


# ---------------------------------------------------------------------------
# 2. LEMMATIZATION
# Reduces each word to its base/root form
# ---------------------------------------------------------------------------
def _lemmatize(doc) -> List[str]:
    """
    Lemmatization: reduce words to dictionary base form.
    Example: "managed" → "manage", "leading" → "lead"
    Removes stopwords and punctuation before lemmatizing.
    """
    return [
        token.lemma_.lower()
        for token in doc
        if not token.is_stop        # Step 3: stopword removal built in here
        and not token.is_punct
        and not token.is_space
        and len(token.text) > 2
    ]


# ---------------------------------------------------------------------------
# 3. STOPWORD REMOVAL
# Filters out common words that carry no meaning
# ---------------------------------------------------------------------------
def _remove_stopwords(doc) -> List[str]:
    """
    Stopword Removal: remove words like 'the', 'a', 'is', 'and'.
    These words are frequent but carry no useful information for NLP.
    """
    return [
        token.text.lower()
        for token in doc
        if not token.is_stop
        and not token.is_punct
        and not token.is_space
    ]


# ---------------------------------------------------------------------------
# 4. POS TAGGING
# Labels each word with its grammatical role
# ---------------------------------------------------------------------------
def _pos_tag(doc) -> List[Dict]:
    """
    Part-of-Speech Tagging: label each word as NOUN, VERB, ADJ, etc.
    Example: "Led" → VERB, "team" → NOUN, "excellent" → ADJ
    Useful for identifying action verbs and skill nouns in resumes.
    """
    return [
        {
            "word": token.text,
            "pos":  token.pos_,   # coarse POS (NOUN, VERB, ADJ...)
            "tag":  token.tag_,   # fine-grained tag (NNS, VBD...)
        }
        for token in doc
        if not token.is_space
        and not token.is_punct
        and token.pos_ in {"NOUN", "VERB", "ADJ", "PROPN"}
    ][:50]  # limit to top 50 for response size


# ---------------------------------------------------------------------------
# 5. NAMED ENTITY RECOGNITION (NER)
# Detects real-world entities like names, organisations, dates
# ---------------------------------------------------------------------------
def _extract_entities(doc) -> Dict[str, List[str]]:
    """
    Named Entity Recognition: automatically detect and classify:
    - PERSON  → candidate name
    - ORG     → companies, universities
    - GPE     → cities, countries
    - DATE    → graduation year, employment dates
    - PRODUCT → tools and technologies mentioned
    """
    entities: Dict[str, List[str]] = {}
    for ent in doc.ents:
        label = ent.label_
        if label not in entities:
            entities[label] = []
        if ent.text not in entities[label]:
            entities[label].append(ent.text)
    return entities


# ---------------------------------------------------------------------------
# 6. TF-IDF KEYWORD EXTRACTION
# Finds the most statistically important words in the resume
# ---------------------------------------------------------------------------
def _tfidf_keywords(text: str, top_n: int = 15) -> List[Dict]:
    """
    TF-IDF (Term Frequency - Inverse Document Frequency):
    Scores each word by how often it appears in THIS document
    relative to how common it is in general English.
    High TF-IDF = important and distinctive keyword for this resume.
    """
    # Split text into sentences to create a mini corpus
    sentences = [s.strip() for s in text.split("\n") if len(s.strip()) > 10]

    if len(sentences) < 2:
        sentences = [text]

    try:
        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=100,
            ngram_range=(1, 2),   # include bigrams like "machine learning"
        )
        tfidf_matrix = vectorizer.fit_transform(sentences)
        feature_names = vectorizer.get_feature_names_out()

        # Sum TF-IDF scores across all sentences
        scores = tfidf_matrix.sum(axis=0).A1
        keyword_scores = list(zip(feature_names, scores))
        keyword_scores.sort(key=lambda x: x[1], reverse=True)

        return [
            {"keyword": kw, "score": round(float(score), 4)}
            for kw, score in keyword_scores[:top_n]
        ]
    except Exception:
        return []


# ---------------------------------------------------------------------------
# 7. SKILL EXTRACTION
# Matches resume tokens against a known skill dictionary
# ---------------------------------------------------------------------------
def _extract_skills(doc) -> List[str]:
    """
    Skill Extraction: scan lemmatized tokens and bigrams against
    a predefined skill dictionary.
    Combines dictionary lookup with lemmatization for better matching.
    Example: "managing" → lemma "manage" → not a skill
             "python"   → lemma "python" → ✅ skill found
    """
    text_lower = doc.text.lower()
    found_skills = []

    for skill in SKILL_DICTIONARY:
        if skill in text_lower:
            found_skills.append(skill)

    return sorted(found_skills)


# ---------------------------------------------------------------------------
# HELPER: Top action verbs (important for ATS)
# ---------------------------------------------------------------------------
def _top_verbs(doc) -> List[str]:
    """Extract the most common verbs — these are the action verbs in resume."""
    verbs = [
        token.lemma_.lower()
        for token in doc
        if token.pos_ == "VERB"
        and not token.is_stop
        and len(token.text) > 2
    ]
    return [word for word, _ in Counter(verbs).most_common(10)]


# ---------------------------------------------------------------------------
# HELPER: Top nouns (often the key topics/skills)
# ---------------------------------------------------------------------------
def _top_nouns(doc) -> List[str]:
    """Extract the most common nouns — often skills, roles, technologies."""
    nouns = [
        token.lemma_.lower()
        for token in doc
        if token.pos_ in {"NOUN", "PROPN"}
        and not token.is_stop
        and len(token.text) > 2
    ]
    return [word for word, _ in Counter(nouns).most_common(10)]