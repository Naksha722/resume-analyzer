"use client";
// app/page.tsx  (Upload page — home route)
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { uploadPDF, analyzeResume } from "@/lib/api";
import { useResumeStore } from "@/hooks/useResumeStore";

export default function UploadPage() {
  const router = useRouter();
  const { setResumeText, setAnalysis } = useResumeStore();
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  async function handleAnalyze() {
    if (!file) return;
    setError("");
    try {
      // Step 1: Extract text
      setStatus("uploading");
      const upload = await uploadPDF(file);
      setResumeText(upload.text, file.name);

      // Step 2: Analyze
      setStatus("analyzing");
      const analysis = await analyzeResume(upload.text);
      setAnalysis(analysis);

      setStatus("done");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const busy = status === "uploading" || status === "analyzing";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      {/* Hero text */}
      <div className="text-center space-y-3 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered <span className="text-green-400">Resume Analyzer</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Upload your PDF resume and get an instant ATS score, keyword gaps, and
          AI-written improvements in seconds.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={clsx(
          "w-full max-w-xl border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-green-400 bg-green-500/10"
            : file
            ? "border-green-600 bg-green-500/5"
            : "border-gray-700 hover:border-gray-500 bg-gray-900/50"
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileText size={40} className="text-green-400" />
            <p className="font-medium text-green-300">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud size={40} className="text-gray-500" />
            <p className="font-medium text-gray-300">
              {isDragActive ? "Drop it here!" : "Drag & drop your resume PDF"}
            </p>
            <p className="text-sm text-gray-500">or click to browse · PDF only · max 5 MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm max-w-xl w-full">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleAnalyze}
        disabled={!file || busy}
        className="btn-primary flex items-center gap-2 text-base px-8 py-3"
      >
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {status === "uploading" ? "Extracting text…" : "Analyzing with AI…"}
          </>
        ) : (
          "Analyze My Resume →"
        )}
      </button>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 max-w-xl w-full text-center text-sm">
        {[
          { n: "1", label: "Upload PDF" },
          { n: "2", label: "AI Analysis" },
          { n: "3", label: "Get Results" },
        ].map(({ n, label }) => (
          <div key={n} className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-gray-800 text-green-400 font-bold flex items-center justify-center text-xs">
              {n}
            </div>
            <span className="text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
