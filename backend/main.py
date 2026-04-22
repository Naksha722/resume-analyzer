"""
Resume Analyzer - FastAPI Backend
Entry point: registers all routers and configures CORS
"""
from dotenv import load_dotenv
import os

# Force load .env from the backend folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import upload, analyze, keywords, enhance

load_dotenv()

app = FastAPI(
    title="Resume Analyzer API",
    description="LLM-powered resume analysis, ATS scoring, and enhancement",
    version="1.0.0",
)

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000"), "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(upload.router,   prefix="/upload_pdf",     tags=["Upload"])
app.include_router(analyze.router,  prefix="/analyze_resume", tags=["Analyze"])
app.include_router(keywords.router, prefix="/suggest_keywords", tags=["Keywords"])
app.include_router(enhance.router,  prefix="/improve_resume",  tags=["Enhance"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Resume Analyzer API is running"}
