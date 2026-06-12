"use client";

import { motion } from "framer-motion";
import { SIM_CONFIG, AGGRESSIVENESS } from "@/lib/config";
import { formatCurrency } from "@/lib/calc";
import type { Aggressiveness } from "@/lib/types";
import { TrophyIcon, DollarIcon, BoltIcon, ShieldIcon } from "@/components/ui/icons";

export function ImpactSummary({
  rewardSavings,
  eventCount,
  aggressiveness,
}: {
  rewardSavings: number;
  eventCount: number;
  aggressiveness: Aggressiveness;
}) {
  const cards = [
    {
      icon: <DollarIcon className="h-5 w-5" />,
      label: "Event rewards earned",
      value: formatCurrency(rewardSavings),
      tint: "bg-forest-100 text-forest-600",
    },
    {
      icon: <BoltIcon className="h-5 w-5" />,
      label: "Grid events handled",
      value: String(eventCount),
      tint: "bg-ocean-100 text-ocean-600",
    },
    {
      icon: <ShieldIcon className="h-5 w-5" />,
      label: "Comfort kept within 1°F",
      value: "100%",
      tint: "bg-amber-100 text-amber-600",
    },
    {
      icon: <BoltIcon className="h-5 w-5" />,
      label: "Optimization style",
      value: AGGRESSIVENESS[aggressiveness].label,
      tint: "bg-accent/15 text-accent",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-5"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.tint}`}>
              {c.icon}
            </span>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-forest-950">
              {c.value}
            </div>
            <div className="text-xs font-medium text-forest-700/60">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <TopSavers percent={SIM_CONFIG.TOP_SAVER_PERCENT} />
    </div>
  );
}

function TopSavers({ percent }: { percent: number }) {
  // Higher placement = fuller bar. top 8% -> 92% filled.
  const fill = 100 - percent;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-soft"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
          <TrophyIcon className="h-6 w-6" />
        </span>
        <div>
          <div className="text-sm font-semibold text-white/85">Your ranking</div>
          <div className="text-2xl font-extrabold">Top {percent}% of savers</div>
        </div>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/25">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="h-full rounded-full bg-white"
        />
      </div>
      <p className="mt-3 text-xs text-white/80">
        You&apos;re saving more than {fill}% of homes on Renew Home. Keep it up! 🌱
      </p>
    </motion.div>
  );
}
