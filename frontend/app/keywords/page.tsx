"use client";
// app/keywords/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/hooks/useResumeStore";
import { suggestKeywords } from "@/lib/api";
import { Loader2, Lightbulb, CheckCircle2, AlertCircle, Star } from "lucide-react";
import clsx from "clsx";

export default function KeywordsPage() {
  const router = useRouter();
  const { resumeText, keywords, setKeywords } = useResumeStore();
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeText) router.replace("/");
  }, [resumeText, router]);

  async function fetchKeywords() {
    setLoading(true);
    setError("");
    try {
      const result = await suggestKeywords(resumeText, jobDesc);
      setKeywords(result);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to fetch keywords.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch on first load if no job desc provided
  useEffect(() => {
    if (resumeText && !keywords) fetchKeywords();
  }, [resumeText]); // eslint-disable-line

  if (!resumeText) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Keyword Gap Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">
          Optionally paste a job description to get targeted keyword suggestions.
        </p>
      </div>

      {/* Job description input */}
      <div className="card space-y-3">
        <label className="text-sm font-medium text-gray-300">
          Job Description <span className="text-gray-500">(optional but recommended)</span>
        </label>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none"
          rows={5}
          placeholder="Paste the job description here to get targeted keyword suggestions…"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
        <button onClick={fetchKeywords} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Analyzing…</> : "Analyze Keywords"}
        </button>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>

      {keywords && (
        <>
          {/* High priority */}
          <div className="card space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-400 uppercase tracking-wide">
              <Star size={14} /> High Priority Keywords to Add
            </h2>
            <div className="flex flex-wrap gap-2">
              {keywords.high_priority.map((k) => (
                <span key={k} className="badge bg-amber-500/15 text-amber-300 border border-amber-500/25 text-xs">{k}</span>
              ))}
            </div>
          </div>

          {/* Present vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-green-400 uppercase tracking-wide">
                <CheckCircle2 size={14} /> Keywords Present ({keywords.present_keywords.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {keywords.present_keywords.map((k) => (
                  <span key={k} className="badge bg-green-500/10 text-green-300 border border-green-500/20 text-xs">{k}</span>
                ))}
              </div>
            </div>
            <div className="card space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-red-400 uppercase tracking-wide">
                <AlertCircle size={14} /> Missing Keywords ({keywords.missing_keywords.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {keywords.missing_keywords.map((k) => (
                  <span key={k} className="badge bg-red-500/10 text-red-300 border border-red-500/20 text-xs">{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* By Category */}
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Keywords by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(keywords.keyword_categories).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    {cat.replace(/_/g, " ")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(items as string[]).map((k) => (
                      <span key={k} className="badge bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide">
              <Lightbulb size={14} /> ATS Tips
            </h2>
            {keywords.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
