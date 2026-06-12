"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { buildHourlyUsage, buildWeeklyUsage, type UsagePoint } from "@/lib/mockData";
import type { Aggressiveness } from "@/lib/types";
import { formatNumber } from "@/lib/calc";

type Range = "24h" | "7d";

const W = 720;
const H = 260;
const PAD = { top: 24, right: 16, bottom: 30, left: 16 };

export function UsageChart({ aggressiveness }: { aggressiveness: Aggressiveness }) {
  const [range, setRange] = useState<Range>("24h");

  const data = useMemo<UsagePoint[]>(
    () => (range === "24h" ? buildHourlyUsage(aggressiveness) : buildWeeklyUsage(aggressiveness)),
    [range, aggressiveness]
  );

  const { typicalPath, renewPath, renewArea, peakBands, xs, ys, maxVal } = useMemo(
    () => computeGeometry(data),
    [data]
  );

  const savedKwh = useMemo(
    () => data.reduce((sum, d) => sum + Math.max(0, d.typical - d.renew), 0),
    [data]
  );

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-forest-950">Energy usage</h3>
          <p className="text-sm text-forest-700/60">
            Typical vs. with Renew Home · peak hours shaded
          </p>
        </div>
        <div className="flex rounded-full bg-forest-50 p-1 ring-1 ring-black/5">
          {(["24h", "7d"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                range === r ? "bg-white text-forest-800 shadow-sm" : "text-forest-600/70"
              }`}
            >
              {r === "24h" ? "Last 24h" : "Last 7 days"}
            </button>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
        <Legend color="#cbd5e1" label="Typical" dashed />
        <Legend color="#16a34a" label="With Renew Home" />
        <span className="flex items-center gap-1.5 text-forest-700/60">
          <span className="h-3 w-3 rounded-sm bg-amber-200" /> Peak window
        </span>
        <span className="ml-auto rounded-full bg-forest-100 px-3 py-1 text-forest-700">
          {formatNumber(savedKwh, 1)} kWh shifted off-peak
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full" role="img" aria-label="Energy usage chart">
        {/* peak bands */}
        {peakBands.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={PAD.top}
            width={b.width}
            height={H - PAD.top - PAD.bottom}
            fill="#fde68a"
            opacity={0.35}
            rx={6}
          />
        ))}

        {/* baseline grid */}
        {[0.25, 0.5, 0.75].map((g) => {
          const y = PAD.top + (H - PAD.top - PAD.bottom) * g;
          return <line key={g} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#000" strokeOpacity={0.05} />;
        })}

        {/* renew area */}
        <motion.path
          d={renewArea}
          fill="url(#renewGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <defs>
          <linearGradient id="renewGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* typical line (dashed) */}
        <motion.path
          d={typicalPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={2.5}
          strokeDasharray="6 6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {/* renew line */}
        <motion.path
          d={renewPath}
          fill="none"
          stroke="#16a34a"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />

        {/* x labels (sparse for 24h) */}
        {data.map((d, i) => {
          const show = data.length <= 7 || i % 3 === 0;
          if (!show) return null;
          return (
            <text
              key={i}
              x={xs[i]}
              y={H - 8}
              textAnchor="middle"
              className="fill-forest-700/50"
              fontSize={11}
              fontWeight={600}
            >
              {d.label}
            </text>
          );
        })}

        {/* endpoint dot on renew curve */}
        <motion.circle
          cx={xs[xs.length - 1]}
          cy={ys[ys.length - 1]}
          r={5}
          fill="#16a34a"
          stroke="#fff"
          strokeWidth={2.5}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 220 }}
        />
        {/* suppress unused warning */}
        <desc>max {maxVal}</desc>
      </svg>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-forest-700/70">
      <span
        className="inline-block h-0.5 w-5 rounded-full"
        style={{
          backgroundColor: color,
          backgroundImage: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
            : undefined,
        }}
      />
      {label}
    </span>
  );
}

function computeGeometry(data: UsagePoint[]) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map((d) => d.typical)) * 1.1;
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;

  const xs = data.map((_, i) => PAD.left + step * i);
  const yOf = (v: number) => PAD.top + innerH * (1 - v / maxVal);

  const typicalPts = data.map((d, i) => ({ x: xs[i], y: yOf(d.typical) }));
  const renewPts = data.map((d, i) => ({ x: xs[i], y: yOf(d.renew) }));
  const ys = renewPts.map((p) => p.y);

  const typicalPath = smoothPath(typicalPts);
  const renewPath = smoothPath(renewPts);
  const renewArea = `${renewPath} L ${xs[xs.length - 1]},${H - PAD.bottom} L ${xs[0]},${
    H - PAD.bottom
  } Z`;

  // contiguous peak bands
  const peakBands: { x: number; width: number }[] = [];
  let start: number | null = null;
  data.forEach((d, i) => {
    if (d.peak && start === null) start = i;
    const ended = !d.peak || i === data.length - 1;
    if (start !== null && ended) {
      const endIdx = d.peak ? i : i - 1;
      const x = xs[start] - step / 2;
      const width = xs[endIdx] - xs[start] + step;
      peakBands.push({ x: Math.max(PAD.left, x), width });
      start = null;
    }
  });

  return { typicalPath, renewPath, renewArea, peakBands, xs, ys, maxVal };
}

/** Catmull-Rom → cubic bézier for a smooth curve through all points. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x},${pts[0].y}` : "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}
