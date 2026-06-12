"use client";

import { motion } from "framer-motion";
import { ButtonLink, Button } from "@/components/ui/Button";
import { BoltIcon, PlayIcon, ShieldIcon, LeafIcon, DollarIcon } from "@/components/ui/icons";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({ onWatchExplainer }: { onWatchExplainer: () => void }) {
  return (
    <section className="container-page pt-8">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-forest-700"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-forest-500" />
        </span>
        Live on 5M+ homes
      </motion.div>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-5 text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-forest-950"
      >
        Cheaper times.
        <br />
        <span className="bg-gradient-to-r from-forest-600 via-forest-500 to-ocean-500 bg-clip-text text-transparent">
          Cleaner times.
        </span>
        <br />
        No effort.
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-4 text-[15px] leading-relaxed text-forest-800/80"
      >
        Renew Home connects your smart thermostat to the grid and shifts energy use toward the
        cheapest, cleanest moments of the day. Save money, cut CO₂, stay in full control —
        automatically.
      </motion.p>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-6 flex flex-col gap-2.5"
      >
        <ButtonLink href="/activate" size="lg" className="w-full">
          <BoltIcon className="h-5 w-5" />
          Connect My Thermostat
        </ButtonLink>
        <Button variant="secondary" size="lg" className="w-full" onClick={onWatchExplainer}>
          <PlayIcon className="h-4 w-4" />
          Watch Explainer
        </Button>
      </motion.div>

      <motion.p
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-4 text-center text-[12px] text-forest-700/70"
      >
        Free to connect · Works with your thermostat · Cancel anytime
      </motion.p>

      {/* Estimated savings card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="card mt-7 overflow-hidden p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-forest-600">
            Your home this year
          </span>
          <span className="glass-pill rounded-full px-3 py-1 text-[11px] font-bold text-forest-700">
            Estimated
          </span>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-[3.4rem] font-extrabold leading-none tracking-tight text-forest-950">
            $104
          </span>
          <span className="mb-1.5 text-base font-semibold text-forest-700/70">/yr saved</span>
        </div>

        <div className="mt-5 space-y-2.5">
          <SavingRow icon={<DollarIcon className="h-5 w-5" />} title="Estimated savings" value="$104 / year" />
          <SavingRow icon={<ShieldIcon className="h-5 w-5" />} title="Comfort held within" value="1°F" />
          <SavingRow icon={<LeafIcon className="h-5 w-5" />} title="You're always" value="in control" />
        </div>

        <div className="mt-6 flex h-14 items-end gap-1.5">
          {[40, 55, 35, 70, 90, 60, 45, 80, 30, 65, 50, 75].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 4 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.05, ease: "easeOut" }}
              className={`flex-1 rounded-full ${i % 4 === 0 ? "bg-ocean-400" : "bg-forest-400"}`}
            />
          ))}
        </div>
        <p className="mt-2.5 text-center text-[11px] text-forest-700/60">
          Energy shifted out of expensive peak hours
        </p>
      </motion.div>
    </section>
  );
}

function SavingRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="glass-pill flex items-center gap-3 rounded-2xl px-3.5 py-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/70 text-forest-600 shadow-sm">
        {icon}
      </span>
      <span className="text-[13px] text-forest-800/80">{title}</span>
      <span className="ml-auto text-[13px] font-bold text-forest-900">{value}</span>
    </div>
  );
}
