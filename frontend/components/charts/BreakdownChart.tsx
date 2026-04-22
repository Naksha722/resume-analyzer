"use client";
// components/charts/BreakdownChart.tsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Props {
  breakdown: Record<string, number>;
}

const MAX_DEFAULTS: Record<string, number> = {
  sections: 25,
  action_verbs: 20,
  quantification: 20,
  contact_info: 15,
  length: 10,
  keywords: 10,
};

const LABELS: Record<string, string> = {
  sections: "Sections",
  action_verbs: "Action Verbs",
  quantification: "Quantification",
  contact_info: "Contact Info",
  length: "Length",
  keywords: "Keywords",
};

export default function BreakdownChart({ breakdown }: Props) {
  const data = Object.entries(breakdown).map(([key, value]) => ({
    name: LABELS[key] || key,
    score: value,
    max: MAX_DEFAULTS[key] || 10,
    pct: Math.round((value / (MAX_DEFAULTS[key] || 10)) * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
        <XAxis type="number" domain={[0, 25]} tick={{ fill: "#6b7280", fontSize: 11 }} />
        <YAxis dataKey="name" type="category" tick={{ fill: "#9ca3af", fontSize: 12 }} width={110} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
          labelStyle={{ color: "#f3f4f6" }}
          formatter={(val: number, _: string, props: any) =>
            [`${val} / ${props.payload.max}`, "Score"]
          }
        />
        <Bar dataKey="score" radius={[0, 6, 6, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.pct >= 75 ? "#4ade80" : entry.pct >= 40 ? "#fbbf24" : "#f87171"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
