"use client";
// app/enhance/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/hooks/useResumeStore";
import { improveResume } from "@/lib/api";
import {
  Loader2, Sparkles, ArrowRight, Copy, CheckCheck,
  Lightbulb, FileEdit, AlertCircle,
} from "lucide-react";

export default function EnhancePage() {
  const router = useRouter();
  const { resumeText, enhancement, setEnhancement } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeText) router.replace("/");
  }, [resumeText, router]);

  async function fetchEnhancement() {
    setLoading(true);
    setError("");
    try {
      const result = await improveResume(resumeText);
      setEnhancement(result);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Enhancement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (resumeText && !enhancement) fetchEnhancement();
  }, [resumeText]); // eslint-disable-line

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!resumeText) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resume Enhancement</h1>
          <p className="text-gray-400 text-sm mt-1">AI-rewritten bullets, summary, and ATS tips.</p>
        </div>
        {enhancement && (
          <button onClick={fetchEnhancement} disabled={loading} className="btn-secondary text-sm flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Regenerate
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card flex flex-col items-center gap-4 py-12">
          <Loader2 size={32} className="animate-spin text-green-400" />
          <p className="text-gray-400">AI is rewriting your resume…</p>
          <p className="text-xs text-gray-600">This usually takes 10–20 seconds</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={14} /> {error}
          <button onClick={fetchEnhancement} className="ml-auto underline text-xs">Retry</button>
        </div>
      )}

      {enhancement && !loading && (
        <>
          {/* Improved Summary */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-green-400 uppercase tracking-wide">
                <Sparkles size={14} /> Rewritten Professional Summary
              </h2>
              <CopyBtn text={enhancement.improved_summary} id="summary" copied={copied} onCopy={copyText} />
            </div>
            <p className="text-gray-200 text-sm leading-relaxed bg-gray-800/50 rounded-lg p-4">
              {enhancement.improved_summary}
            </p>
          </div>

          {/* Bullet improvements */}
          <div className="card space-y-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide">
              <FileEdit size={14} /> Bullet Point Improvements
            </h2>
            {enhancement.bullet_improvements.map((b, i) => (
              <div key={i} className="space-y-2 border-b border-gray-800 pb-5 last:border-0 last:pb-0">
                {/* Original */}
                <div className="text-xs text-gray-500 uppercase tracking-wide">Original</div>
                <p className="text-sm text-gray-400 bg-red-500/5 border border-red-500/15 rounded-lg p-3 line-through decoration-red-500/50">
                  {b.original}
                </p>
                {/* Improved */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Improved</div>
                  <CopyBtn text={b.improved} id={`bullet-${i}`} copied={copied} onCopy={copyText} />
                </div>
                <p className="text-sm text-green-200 bg-green-500/5 border border-green-500/15 rounded-lg p-3">
                  {b.improved}
                </p>
                {/* Reason */}
                <div className="flex items-start gap-1.5 text-xs text-gray-500">
                  <Lightbulb size={11} className="mt-0.5 text-amber-500 flex-shrink-0" />
                  {b.reason}
                </div>
              </div>
            ))}
          </div>

          {/* Section suggestions */}
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Section-by-Section Suggestions</h2>
            {enhancement.section_suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="badge bg-blue-500/15 text-blue-300 border border-blue-500/20 text-xs flex-shrink-0 mt-0.5">
                  {s.section}
                </span>
                <p className="text-sm text-gray-300">{s.suggestion}</p>
              </div>
            ))}
          </div>

          {/* ATS tips */}
          <div className="card space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-400 uppercase tracking-wide">
              <Lightbulb size={14} /> ATS Optimisation Tips
            </h2>
            {enhancement.ats_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <ArrowRight size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>

          {/* Overall advice */}
          <div className="card bg-gradient-to-r from-green-500/10 to-transparent border-green-500/20 space-y-2">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wide">Overall Career Advice</h2>
            <p className="text-sm text-gray-300 leading-relaxed">{enhancement.overall_advice}</p>
          </div>
        </>
      )}
    </div>
  );
}

function CopyBtn({
  text, id, copied, onCopy,
}: {
  text: string; id: string; copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <button
      onClick={() => onCopy(text, id)}
      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
    >
      {copied === id ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied === id ? "Copied!" : "Copy"}
    </button>
  );
}
