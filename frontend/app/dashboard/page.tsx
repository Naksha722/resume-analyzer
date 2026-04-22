"use client";
// app/dashboard/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResumeStore } from "@/hooks/useResumeStore";
import ScoreGauge from "@/components/charts/ScoreGauge";
import BreakdownChart from "@/components/charts/BreakdownChart";
import {
  CheckCircle2, XCircle, AlertTriangle, ArrowRight,
  User, Briefcase, Globe, TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { analysis, resumeText } = useResumeStore();

  useEffect(() => {
    if (!resumeText) router.replace("/");
  }, [resumeText, router]);

  if (!analysis) return null;

  const { ats_score, name, current_role, years_experience,
          industry, career_level, summary,
          top_skills, missing_skills, strengths, weaknesses } = analysis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analysis Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Here's what AI found in your resume</p>
        </div>
        <div className="flex gap-3">
          <Link href="/keywords" className="btn-secondary text-sm">Keyword Gaps →</Link>
          <Link href="/enhance" className="btn-primary text-sm">Enhance Resume →</Link>
        </div>
      </div>

      {/* Top row: score + profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ATS Score */}
        <div className="card flex flex-col items-center gap-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">ATS Score</h2>
          <ScoreGauge score={ats_score.total} />
          <div className="w-full space-y-1">
            {ats_score.feedback.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-400">
                <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Profile info */}
        <div className="card col-span-1 md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Candidate Profile</h2>
          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={<User size={14} />}    label="Name"         value={name} />
            <InfoRow icon={<Briefcase size={14} />} label="Current Role"  value={current_role} />
            <InfoRow icon={<TrendingUp size={14} />} label="Experience"  value={`${years_experience} year${years_experience !== 1 ? "s" : ""}`} />
            <InfoRow icon={<Globe size={14} />}   label="Industry"     value={industry} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="badge bg-blue-500/20 text-blue-300">{career_level}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-3">{summary}</p>
        </div>
      </div>

      {/* ATS Breakdown chart */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Score Breakdown</h2>
        <BreakdownChart breakdown={ats_score.breakdown} />
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">✅ Top Skills</h2>
          <div className="flex flex-wrap gap-2">
            {top_skills.map((s) => (
              <span key={s} className="badge bg-green-500/15 text-green-300 border border-green-500/20">{s}</span>
            ))}
          </div>
        </div>
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">⚠️ Missing Skills</h2>
          <div className="flex flex-wrap gap-2">
            {missing_skills.map((s) => (
              <span key={s} className="badge bg-red-500/15 text-red-300 border border-red-500/20">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Strengths</h2>
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <CheckCircle2 size={15} className="text-green-400 flex-shrink-0 mt-0.5" />
              {s}
            </div>
          ))}
        </div>
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Areas to Improve</h2>
          {weaknesses.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              {w}
            </div>
          ))}
        </div>
      </div>

      {/* Next step CTA */}
      <div className="card flex items-center justify-between bg-gradient-to-r from-green-500/10 to-transparent border-green-500/20">
        <div>
          <p className="font-semibold">Ready to improve your resume?</p>
          <p className="text-sm text-gray-400">Let AI rewrite your bullet points and boost your ATS score.</p>
        </div>
        <Link href="/enhance" className="btn-primary flex items-center gap-1 whitespace-nowrap">
          Enhance Now <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <span className="text-xs text-gray-500">{label}:</span>
      <span className="text-sm text-gray-200 font-medium truncate">{value}</span>
    </div>
  );
}
