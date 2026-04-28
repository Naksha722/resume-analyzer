# Resume Analyzer
## Overview

Resume Analyzer is a full-stack application that helps users evaluate and improve resumes using ATS-based scoring and AI-powered enhancements.

It provides:
Resume parsing from PDF
ATS-style scoring and breakdown
Keyword gap analysis based on job descriptions
AI-generated resume improvements

## Tech Stack
Backend: FastAPI
Frontend: Next.js (App Router)
AI Integration: Claude (Anthropic API)

## Project Structure
resume-analyzer/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   ├── services/
│   └── models/
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    └── lib/

## Local Development
## Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

## Configure environment variables
cp .env.example .env

uvicorn main:app --reload --port 8000

## Frontend
cd frontend
npm install

## Configure environment variables
cp .env.local.example .env.local

npm run dev

## Environment Variables
## Backend
ANTHROPIC_API_KEY=your_key
FRONTEND_URL=http://localhost:3000

## Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

## Deployment
Backend (Render)

Build:

pip install -r requirements.txt

Start:

uvicorn main:app --host 0.0.0.0 --port $PORT

Set required environment variables and deploy.

Frontend (Vercel)
Root directory: frontend
Set NEXT_PUBLIC_API_URL to your backend URL

Deploy the project.

API Endpoints

Upload PDF

POST /upload_pdf

Analyze Resume

POST /analyze_resume

Suggest Keywords

POST /suggest_keywords

Improve Resume

POST /improve_resume

Job matching score
Email results
