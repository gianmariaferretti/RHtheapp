"use client";

import { motion } from "framer-motion";
import { useLiveSavings } from "@/lib/useLiveSavings";
import { formatCurrency, formatNumber } from "@/lib/calc";
import { LeafIcon, TreeIcon, DollarIcon } from "@/components/ui/icons";

export function SavingsTicker({
  annualSavings,
  activatedAt,
  rewardSavings,
}: {
  annualSavings: number;
  activatedAt: number | null;
  rewardSavings: number;
}) {
  const live = useLiveSavings(annualSavings, activatedAt, rewardSavings);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-600 via-forest-600 to-ocean-600 p-7 text-white shadow-soft-lg">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-ocean-300/20 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          Saving live
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          Since you connected
        </span>
      </div>

      <div className="relative mt-4 flex items-end gap-1.5">
        <DollarIcon className="mb-2 h-7 w-7 text-white/70" />
        {/* tabular-nums keeps the climbing digits from jittering */}
        <span className="text-[2.9rem] font-extrabold leading-none tracking-tight tabular-nums">
          {formatCurrency(live.total, 4)}
        </span>
      </div>
      <p className="relative mt-2 text-sm text-white/75">
        Saved to date — climbing every second, automatically.
      </p>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <Stat
          icon={<LeafIcon className="h-5 w-5" />}
          label="CO₂ avoided"
          value={`${formatNumber(live.co2Kg, 1)} kg`}
        />
        <Stat
          icon={<TreeIcon className="h-5 w-5" />}
          label="Trees equivalent"
          value={formatNumber(live.trees, 2)}
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
        {icon}
      </span>
      <div>
        <div className="text-lg font-extrabold tabular-nums">{value}</div>
        <div className="text-[11px] font-medium uppercase tracking-wide text-white/70">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
