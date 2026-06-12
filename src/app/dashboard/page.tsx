"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "@/lib/useSession";
import { estimateSavings } from "@/lib/calc";
import { getBrand } from "@/lib/brands";
import { AGGRESSIVENESS } from "@/lib/config";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SavingsTicker } from "@/components/dashboard/SavingsTicker";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { GridEventsPanel } from "@/components/dashboard/GridEventsPanel";
import { ImpactSummary } from "@/components/dashboard/ImpactSummary";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { ThermostatIcon, ShieldIcon, BoltIcon, ArrowRightIcon } from "@/components/ui/icons";

export default function DashboardPage() {
  const { session, ready } = useSession();

  const annualSavings = useMemo(
    () => estimateSavings(session.monthlyBill, session.aggressiveness).annualSavings,
    [session.monthlyBill, session.aggressiveness]
  );

  if (!ready) return <FullLoader />;
  if (!session.activated) return <NotConnectedGate />;

  return (
    <div>
      <DashboardHeader />

      <main className="container-page pt-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-[1.9rem] font-extrabold leading-tight tracking-tight text-forest-950">
            Your home, live
          </h1>
          <p className="mt-1 text-[14px] text-forest-700/70">
            Renew Home is working in the background. Sit back — or simulate a grid event below.
          </p>
        </motion.div>

        <div className="space-y-5">
          <SavingsTicker
            annualSavings={annualSavings}
            activatedAt={session.activatedAt}
            rewardSavings={session.rewardSavings}
          />
          <DeviceCard />
          <UsageChart aggressiveness={session.aggressiveness} />
          <GridEventsPanel targetTempF={session.targetTempF} />
          <ImpactSummary
            rewardSavings={session.rewardSavings}
            eventCount={session.events.length}
            aggressiveness={session.aggressiveness}
          />
        </div>

        <p className="px-2 py-7 text-center text-[11px] leading-relaxed text-forest-700/50">
          Renew Home is a fully simulated prototype. Every number, device, and reward shown here is
          fictional and for demonstration only.
        </p>
      </main>
    </div>
  );
}

function DeviceCard() {
  const { session } = useSession();
  const brand = getBrand(session.brandId);
  const paused = session.overrideActive;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${brand?.accent ?? "from-forest-400 to-ocean-400"}`} />
        <div className="min-w-0">
          <div className="truncate text-base font-bold text-forest-950">{brand?.name}</div>
          <div className="text-xs text-forest-700/60">Connected · {brand?.blurb}</div>
        </div>
        <span
          className={`ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            paused ? "bg-amber-100 text-amber-700" : "bg-forest-100 text-forest-700"
          }`}
        >
          {paused ? <ShieldIcon className="h-3.5 w-3.5" /> : <BoltIcon className="h-3.5 w-3.5" />}
          {paused ? "Paused" : "Optimizing"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Tile
          icon={<ThermostatIcon className="h-5 w-5" />}
          label="Target"
          value={`${session.targetTempF}°F`}
        />
        <Tile
          icon={<ShieldIcon className="h-5 w-5" />}
          label="Comfort range"
          value={`${session.targetTempF - 1}–${session.targetTempF + 1}°F`}
        />
      </div>

      <div className="mt-3 rounded-2xl bg-forest-50/70 px-4 py-3 text-sm">
        <span className="text-forest-700/60">Optimization style</span>
        <span className="float-right font-bold text-forest-900">
          {AGGRESSIVENESS[session.aggressiveness].label}
        </span>
      </div>

      <Link
        href="/activate"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-forest-50 px-4 py-2.5 text-sm font-bold text-forest-800 ring-1 ring-black/5 transition hover:bg-forest-100"
      >
        Adjust settings
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-forest-50/70 px-4 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-forest-600 shadow-sm">
        {icon}
      </span>
      <div className="mt-2 text-lg font-extrabold text-forest-950">{value}</div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-forest-700/55">
        {label}
      </div>
    </div>
  );
}

function FullLoader() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        <LogoMark className="h-12 w-12" />
      </motion.div>
      <p className="text-sm font-semibold text-forest-700/70">Loading your dashboard…</p>
    </div>
  );
}

function NotConnectedGate() {
  return (
    <div className="flex min-h-[78dvh] flex-col items-center justify-center px-7 text-center">
      <LogoMark className="h-14 w-14" />
      <h1 className="mt-6 text-[1.7rem] font-extrabold leading-tight tracking-tight text-forest-950">
        No thermostat connected yet
      </h1>
      <p className="mt-3 text-[14px] text-forest-700/70">
        Your dashboard comes to life once you connect a thermostat. It only takes a minute — and
        it&apos;s fully simulated.
      </p>
      <div className="mt-7 flex w-full flex-col gap-2.5">
        <ButtonLink href="/activate" size="lg" className="w-full">
          <BoltIcon className="h-5 w-5" />
          Connect My Thermostat
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg" className="w-full">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
