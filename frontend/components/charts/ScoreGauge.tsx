"use client";
// components/charts/ScoreGauge.tsx
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface Props { score: number; }

function getColor(score: number) {
  if (score >= 75) return "#4ade80"; // green
  if (score >= 50) return "#fbbf24"; // amber
  return "#f87171";                  // red
}

function getLabel(score: number) {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Fair";
  return "Needs Work";
}

export default function ScoreGauge({ score }: Props) {
  const color = getColor(score);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={[{ value: score }]}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              fill={color}
              background={{ fill: "#1f2937" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <span className="mt-1 text-sm font-semibold" style={{ color }}>{getLabel(score)}</span>
    </div>
  );
}
