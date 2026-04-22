"use client";
// hooks/useResumeStore.ts
// Simple in-memory store via React context — shares resume text + results across pages

import { createContext, useContext, useState, ReactNode } from "react";
import type { AnalyzeResponse, KeywordsResponse, EnhanceResponse } from "@/lib/api";

interface ResumeStore {
  resumeText: string;
  fileName: string;
  analysis: AnalyzeResponse | null;
  keywords: KeywordsResponse | null;
  enhancement: EnhanceResponse | null;
  setResumeText: (text: string, fileName: string) => void;
  setAnalysis: (data: AnalyzeResponse) => void;
  setKeywords: (data: KeywordsResponse) => void;
  setEnhancement: (data: EnhanceResponse) => void;
  reset: () => void;
}

const ResumeContext = createContext<ResumeStore | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeText, setResumeTextState] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [keywords, setKeywords] = useState<KeywordsResponse | null>(null);
  const [enhancement, setEnhancement] = useState<EnhanceResponse | null>(null);

  const setResumeText = (text: string, name: string) => {
    setResumeTextState(text);
    setFileName(name);
  };

  const reset = () => {
    setResumeTextState("");
    setFileName("");
    setAnalysis(null);
    setKeywords(null);
    setEnhancement(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeText, fileName,
        analysis, keywords, enhancement,
        setResumeText, setAnalysis, setKeywords, setEnhancement,
        reset,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeStore(): ResumeStore {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResumeStore must be used inside <ResumeProvider>");
  return ctx;
}
