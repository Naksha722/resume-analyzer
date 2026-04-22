// lib/api.ts
// Centralised API client — all backend calls go through here

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s for LLM calls
});

// ── Types ──────────────────────────────────────────────────────────────────

export interface UploadResponse {
  text: string;
  word_count: number;
  char_count: number;
  pages_estimate: number;
}

export interface ATSScore {
  total: number;
  breakdown: {
    sections: number;
    action_verbs: number;
    quantification: number;
    contact_info: number;
    length: number;
    keywords: number;
  };
  feedback: string[];
  word_count: number;
  sections_found: string[];
}

export interface AnalyzeResponse {
  ats_score: ATSScore;
  name: string;
  current_role: string;
  years_experience: number;
  top_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  industry: string;
  career_level: string;
  summary: string;
}

export interface KeywordsResponse {
  present_keywords: string[];
  missing_keywords: string[];
  high_priority: string[];
  keyword_categories: {
    technical_skills: string[];
    soft_skills: string[];
    tools: string[];
    certifications: string[];
  };
  tips: string[];
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface EnhanceResponse {
  improved_summary: string;
  bullet_improvements: BulletImprovement[];
  section_suggestions: { section: string; suggestion: string }[];
  ats_tips: string[];
  overall_advice: string;
}

// ── API calls ──────────────────────────────────────────────────────────────

/** Upload a PDF file and get extracted text */
export async function uploadPDF(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<UploadResponse>("/upload_pdf", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Run ATS scoring + LLM analysis */
export async function analyzeResume(resume_text: string): Promise<AnalyzeResponse> {
  const { data } = await api.post<AnalyzeResponse>("/analyze_resume", { resume_text });
  return data;
}

/** Keyword gap analysis, optionally against a job description */
export async function suggestKeywords(
  resume_text: string,
  job_description = ""
): Promise<KeywordsResponse> {
  const { data } = await api.post<KeywordsResponse>("/suggest_keywords", {
    resume_text,
    job_description,
  });
  return data;
}

/** LLM-powered resume enhancement */
export async function improveResume(resume_text: string): Promise<EnhanceResponse> {
  const { data } = await api.post<EnhanceResponse>("/improve_resume", { resume_text });
  return data;
}
