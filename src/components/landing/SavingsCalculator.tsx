"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BRANDS } from "@/lib/brands";
import { SIM_CONFIG } from "@/lib/config";
import { estimateSavings, formatCurrency, formatNumber } from "@/lib/calc";
import { useSession } from "@/lib/useSession";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { DollarIcon, LeafIcon, TreeIcon, ArrowRightIcon } from "@/components/ui/icons";

export function SavingsCalculator() {
  const router = useRouter();
  const { updatePreferences } = useSession();
  const [brandId, setBrandId] = useState(BRANDS[0].id);
  const [bill, setBill] = useState<number>(SIM_CONFIG.DEFAULT_MONTHLY_BILL);

  const estimate = useMemo(() => estimateSavings(bill, "balanced"), [bill]);
  const fillPct =
    ((bill - SIM_CONFIG.BILL_MIN) / (SIM_CONFIG.BILL_MAX - SIM_CONFIG.BILL_MIN)) * 100;

  const handleClaim = () => {
    // Pre-seed the activation wizard with these picks.
    updatePreferences({ brandId, monthlyBill: bill });
    router.push("/activate");
  };

  return (
    <section id="savings" className="scroll-mt-4">
      <div className="container-page py-12">
        <SectionHeading
          eyebrow="Savings calculator"
          title="See what your home could save"
          subtitle="Move the slider and watch your impact update live. Numbers are illustrative."
        />

        <div className="mt-7 grid gap-4">
          {/* Inputs */}
          <div className="card flex flex-col gap-6 p-6">
            <div>
              <label className="block text-sm font-bold text-forest-900">
                Your thermostat brand
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {BRANDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBrandId(b.id)}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                      brandId === b.id
                        ? "bg-forest-600 text-white shadow-soft"
                        : "bg-forest-50 text-forest-800 ring-1 ring-black/5 hover:bg-forest-100"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 shrink-0 rounded-md bg-gradient-to-br ${b.accent}`}
                    />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold text-forest-900">
                  Average monthly electricity bill
                </label>
                <span className="text-2xl font-extrabold text-forest-700">
                  {formatCurrency(bill, 0)}
                </span>
              </div>
              <input
                type="range"
                className="rh-range mt-4"
                min={SIM_CONFIG.BILL_MIN}
                max={SIM_CONFIG.BILL_MAX}
                step={5}
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                style={{
                  background: `linear-gradient(90deg, #16a34a ${fillPct}%, #d1fae5 ${fillPct}%)`,
                }}
                aria-label="Average monthly electricity bill"
              />
              <div className="mt-2 flex justify-between text-xs font-medium text-forest-700/60">
                <span>{formatCurrency(SIM_CONFIG.BILL_MIN, 0)}</span>
                <span>{formatCurrency(SIM_CONFIG.BILL_MAX, 0)}</span>
              </div>
            </div>

            <p className="rounded-2xl bg-ocean-50 px-4 py-3 text-xs leading-relaxed text-ocean-800/80">
              Renew Home optimizes automatically in the background. You keep your comfort settings
              — we just nudge energy use to cheaper, cleaner moments.
            </p>
          </div>

          {/* Outputs */}
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-forest-600 to-ocean-600 p-6 text-white shadow-soft-lg">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <span className="text-[13px] font-semibold uppercase tracking-wide text-white/80">
              Your estimated yearly impact
            </span>

            <div className="mt-3 flex items-end gap-2">
              <AnimatedNumber
                value={estimate.annualSavings}
                format={(n) => formatCurrency(n, 0)}
                className="text-6xl font-extrabold tracking-tight"
              />
              <span className="mb-3 text-lg font-semibold text-white/80">/ year</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <ImpactStat
                icon={<DollarIcon className="h-5 w-5" />}
                label="Saved"
                value={estimate.annualSavings}
                format={(n) => formatCurrency(n, 0)}
              />
              <ImpactStat
                icon={<LeafIcon className="h-5 w-5" />}
                label="CO₂ avoided"
                value={estimate.co2Kg}
                format={(n) => `${formatNumber(n)} kg`}
              />
              <ImpactStat
                icon={<TreeIcon className="h-5 w-5" />}
                label="Trees ≈"
                value={estimate.trees}
                format={(n) => formatNumber(n, 1)}
              />
            </div>

            <Button
              variant="white"
              size="lg"
              className="mt-8 w-full"
              onClick={handleClaim}
            >
              Claim Your Savings
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
            <p className="mt-3 text-center text-xs text-white/70">
              Starts a free, fully simulated activation — no real device needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactStat({
  icon,
  label,
  value,
  format,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  format: (n: number) => string;
}) {
  return (
    <motion.div
      layout
      className="rounded-2xl bg-white/15 px-3 py-4 text-center backdrop-blur-sm"
    >
      <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
        {icon}
      </span>
      <div className="mt-2 text-xl font-extrabold">
        <AnimatedNumber value={value} format={format} />
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-white/70">{label}</div>
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="glass-pill inline-block rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest-700">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance text-[1.9rem] font-extrabold leading-tight tracking-tight text-forest-950">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-[15px] leading-relaxed text-forest-800/70">{subtitle}</p>
      )}
    </div>
  );
}
