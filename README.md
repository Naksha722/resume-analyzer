# ResumeAI — AI-Powered Resume Analyzer

> A full-stack NLP web application that analyses resumes, scores them against ATS systems, extracts keywords, and suggests AI-powered improvements.

---


## Project Overview

ResumeAI is a NLP project that processes PDF resumes through a multi-stage pipeline:

1. **Text Extraction** — Extracts text from PDF using pdfminer or OCR (Tesseract)
2. **NLP Analysis** — Runs a spaCy pipeline over the extracted text
3. **ATS Scoring** — Scores the resume out of 100 using rule-based analysis
4. **AI Enhancement** — Uses Groq (Llama 3.3) to rewrite and improve the resume

### Key Features

| Feature | Description |
|---|---|
| PDF Upload | Drag and drop PDF resume upload |
| ATS Score | Resume scored out of 100 with breakdown |
| NLP Analysis | Tokenization, NER, TF-IDF, skill extraction |
| Keyword Gaps | Present vs missing keywords with categories |
| Resume Enhancement | AI-rewritten bullet points and suggestions |

---

## NLP Pipeline

The core of this project is an NLP pipeline built using **spaCy** and **scikit-learn**, located in `backend/nlp/pipeline.py`.

### Techniques Used

| # | Technique | Library | Purpose |
|---|---|---|---|
| 1 | Tokenization | spaCy | Splits resume text into word tokens |
| 2 | Lemmatization | spaCy | Reduces words to base form (e.g. "managed" → "manage") |
| 3 | Stopword Removal | spaCy | Removes common words like "the", "a", "is" |
| 4 | POS Tagging | spaCy | Labels words as NOUN, VERB, ADJ etc |
| 5 | Named Entity Recognition | spaCy | Extracts names, organisations, dates, locations |
| 6 | TF-IDF | scikit-learn | Scores most important keywords in the resume |
| 7 | Skill Extraction | Custom dictionary | Matches tokens against 60+ technical and soft skills |

### Pipeline Flow

```
PDF File
   ↓
Text Extraction (pdfminer / Tesseract OCR)
   ↓
spaCy NLP Pipeline
   ├── Tokenization
   ├── Lemmatization + Stopword Removal
   ├── POS Tagging
   ├── Named Entity Recognition (NER)
   ├── TF-IDF Keyword Extraction
   └── Skill Extraction
   ↓
ATS Scoring Algorithm (rule-based, regex)
   ↓
Groq LLM — Resume Enhancement
   ↓
Results displayed on Dashboard
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| TailwindCSS | Styling |
| Recharts | Data visualisation (ATS score chart) |
| Axios | API requests to backend |

### Backend
| Technology | Purpose |
|---|---|
| Python FastAPI | REST API server |
| spaCy | NLP pipeline |
| scikit-learn | TF-IDF keyword extraction |
| pdfminer.six | PDF text extraction |
| PyMuPDF + Tesseract | OCR for image-based PDFs |
| Groq API (Llama 3.3) | AI resume enhancement |
| Pydantic | Data validation |

---

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── main.py                   
│   ├── requirements.txt       
│   ├── .env.example              
│   ├── nlp/
│   │   ├── __init__.py
│   │   └── pipeline.py         
│   ├── routers/
│   │   ├── upload.py             
│   │   ├── analyze.py            
│   │   ├── keywords.py          
│   │   └── enhance.py            
│   ├── services/
│   │   ├── pdf_extractor.py      
│   │   ├── ats_scorer.py         
│   │   └── llm_service.py        
│   └── models/
│       └── schemas.py            
│
└── frontend/
    ├── app/
    │   ├── layout.tsx             
    │   ├── page.tsx               
    │   ├── dashboard/page.tsx     
    │   ├── keywords/page.tsx      
    │   └── enhance/page.tsx       
    ├── components/
    │   ├── ui/
    │   │   ├── Navbar.tsx
    │   │   └── Providers.tsx
    │   └── charts/
    │       ├── ScoreGauge.tsx
    │       └── BreakdownChart.tsx
    ├── hooks/
    │   └── useResumeStore.tsx    
    ├── lib/
    │   └── api.ts                 
    └── package.json
```

---

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- Tesseract OCR 

### 1. Clone the Repository

```bash
git clone https://github.com/Naksha722/resume-analyzer.git
cd resume-analyzer
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm

# Set up environment variables
cp .env.example .env
# Open .env and add your GROQ_API_KEY

# Start the backend server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API documentation at: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Set up environment variables
# Create a .env.local file and add:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the frontend
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Environment Variables

### Backend (`backend/.env`)

```
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:3000
```

Get a free Groq API key at: https://console.groq.com

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000

