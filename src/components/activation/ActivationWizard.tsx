"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BRANDS, getBrand } from "@/lib/brands";
import { AGGRESSIVENESS } from "@/lib/config";
import { estimateSavings, formatCurrency, formatNumber } from "@/lib/calc";
import { useSession } from "@/lib/useSession";
import type { Aggressiveness } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import {
  CheckIcon,
  ShieldIcon,
  ThermostatIcon,
  LeafIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

type AuthState = "idle" | "connecting" | "connected";
const STEP_LABELS = ["Choose device", "Authorize", "Comfort", "Done"];
const LEVELS: Aggressiveness[] = ["comfort", "balanced", "max"];

export function ActivationWizard() {
  const router = useRouter();
  const { session, ready, activate, reset } = useSession();

  const [step, setStep] = useState(0);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [targetTempF, setTargetTempF] = useState(70);
  const [aggressiveness, setAggressiveness] = useState<Aggressiveness>("balanced");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [hydratedPrefs, setHydratedPrefs] = useState(false);

  // Pull any picks made on the landing calculator once the session hydrates.
  useEffect(() => {
    if (ready && !hydratedPrefs) {
      setBrandId(session.brandId ?? BRANDS[0].id);
      setTargetTempF(session.targetTempF ?? 70);
      setAggressiveness(session.aggressiveness ?? "balanced");
      setHydratedPrefs(true);
    }
  }, [ready, hydratedPrefs, session]);

  const monthlyBill = session.monthlyBill;
  const estimate = useMemo(
    () => estimateSavings(monthlyBill, aggressiveness),
    [monthlyBill, aggressiveness]
  );

  // Simulate the OAuth handshake when arriving on step 2.
  // Depends only on `step` — depending on `authState` would let the cleanup
  // cancel the timer the instant we flip to "connecting".
  useEffect(() => {
    if (step !== 1) return;
    setAuthState("connecting");
    const id = setTimeout(() => setAuthState("connected"), 2200);
    return () => clearTimeout(id);
  }, [step]);

  const brand = getBrand(brandId);

  const handleFinish = () => {
    activate({ brandId, aggressiveness, targetTempF, monthlyBill });
    setStep(3);
  };

  // Auto-route to the dashboard shortly after the success screen appears.
  useEffect(() => {
    if (step !== 3) return;
    const id = setTimeout(() => router.push("/dashboard"), 3200);
    return () => clearTimeout(id);
  }, [step, router]);

  return (
    <div>
      {/* slim header */}
      <header className="container-page flex h-14 items-center justify-between">
        <Logo />
        {step < 3 && (
          <Link
            href="/"
            className="glass-pill rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-forest-700/80 transition-colors hover:text-forest-900"
          >
            Exit
          </Link>
        )}
      </header>

      <main className="container-page flex flex-col items-center pb-10 pt-4">
        {/* Stepper */}
        {step < 3 && (
          <div className="mb-10 w-full max-w-md">
            <div className="flex items-center justify-between">
              {STEP_LABELS.slice(0, 3).map((label, i) => {
                const state = i < step ? "done" : i === step ? "current" : "todo";
                return (
                  <div key={label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                          state === "done"
                            ? "bg-forest-600 text-white"
                            : state === "current"
                              ? "bg-forest-600 text-white ring-4 ring-forest-200"
                              : "bg-white text-forest-400 ring-1 ring-black/5"
                        }`}
                      >
                        {state === "done" ? <CheckIcon className="h-4 w-4" /> : i + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold ${
                          state === "todo" ? "text-forest-400" : "text-forest-700"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="mx-2 h-0.5 flex-1 rounded-full bg-forest-100">
                        <div
                          className="h-full rounded-full bg-forest-600 transition-all duration-500"
                          style={{ width: i < step ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* STEP 1 — choose brand */}
            {step === 0 && (
              <StepShell key="step1" title="Choose your thermostat" subtitle="Pick the brand you already have at home.">
                <div className="grid grid-cols-2 gap-3">
                  {BRANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBrandId(b.id)}
                      className={`flex items-center gap-3 rounded-2xl p-4 text-left transition-all ${
                        brandId === b.id
                          ? "bg-forest-50 ring-2 ring-forest-500"
                          : "bg-white ring-1 ring-black/5 hover:ring-forest-200"
                      }`}
                    >
                      <span className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${b.accent}`} />
                      <span>
                        <span className="block text-sm font-bold text-forest-950">{b.name}</span>
                        <span className="block text-xs text-forest-700/60">{b.blurb}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="mt-8 w-full"
                  disabled={!brandId}
                  onClick={() => setStep(1)}
                >
                  Continue
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </StepShell>
            )}

            {/* STEP 2 — authorize (fake OAuth) */}
            {step === 1 && (
              <StepShell
                key="step2"
                title="Authorize Renew Home"
                subtitle={`Securely connect your ${brand?.name ?? "thermostat"}. We never change your comfort settings without you.`}
              >
                <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
                  {/* fake provider auth card */}
                  <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                    <span className={`h-10 w-10 rounded-xl bg-gradient-to-br ${brand?.accent ?? "from-forest-400 to-ocean-400"}`} />
                    <div className="text-sm">
                      <div className="font-bold text-forest-950">{brand?.name}</div>
                      <div className="text-forest-700/60">Account authorization</div>
                    </div>
                    <span className="ml-auto rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-bold text-forest-600">
                      Secure
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold text-forest-900">
                    Renew Home is requesting permission to:
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {[
                      "Read your current temperature & setpoints",
                      "Make small, temporary comfort-safe adjustments",
                      "Pause instantly whenever you override",
                    ].map((perm) => (
                      <li key={perm} className="flex items-start gap-2.5 text-sm text-forest-800/80">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                        {perm}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex min-h-[52px] items-center justify-center">
                    <AnimatePresence mode="wait">
                      {authState === "connecting" ? (
                        <motion.div
                          key="connecting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 text-sm font-semibold text-forest-700"
                        >
                          <Spinner />
                          Connecting to {brand?.name}…
                        </motion.div>
                      ) : (
                        <motion.div
                          key="connected"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-bold text-white"
                        >
                          <CheckIcon className="h-4 w-4" />
                          Connected
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  disabled={authState !== "connected"}
                  onClick={() => setStep(2)}
                >
                  {authState === "connected" ? "Continue" : "Authorizing…"}
                  {authState === "connected" && <ArrowRightIcon className="h-5 w-5" />}
                </Button>
              </StepShell>
            )}

            {/* STEP 3 — comfort preferences */}
            {step === 2 && (
              <StepShell
                key="step3"
                title="Set your comfort"
                subtitle="Tell Renew Home how to balance comfort and savings. You can change this anytime."
              >
                {/* target temperature */}
                <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-forest-900">
                    <ThermostatIcon className="h-5 w-5 text-forest-600" />
                    Target temperature
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-6">
                    <button
                      onClick={() => setTargetTempF((t) => Math.max(60, t - 1))}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-50 text-2xl font-bold text-forest-700 ring-1 ring-black/5 transition hover:bg-forest-100"
                      aria-label="Lower temperature"
                    >
                      −
                    </button>
                    <div className="text-center">
                      <span className="text-6xl font-extrabold tracking-tight text-forest-950">
                        {targetTempF}
                      </span>
                      <span className="text-2xl font-bold text-forest-500">°F</span>
                    </div>
                    <button
                      onClick={() => setTargetTempF((t) => Math.min(82, t + 1))}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-50 text-2xl font-bold text-forest-700 ring-1 ring-black/5 transition hover:bg-forest-100"
                      aria-label="Raise temperature"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* aggressiveness */}
                <div className="mt-4 rounded-3xl bg-white p-6 ring-1 ring-black/5">
                  <div className="text-sm font-bold text-forest-900">Optimization style</div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setAggressiveness(lvl)}
                        className={`rounded-2xl px-2 py-3 text-center text-sm font-bold transition-all ${
                          aggressiveness === lvl
                            ? "bg-forest-600 text-white shadow-soft"
                            : "bg-forest-50 text-forest-700 ring-1 ring-black/5 hover:bg-forest-100"
                        }`}
                      >
                        {AGGRESSIVENESS[lvl].label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-forest-700/70">
                    {AGGRESSIVENESS[aggressiveness].blurb}
                  </p>

                  {/* live projected savings */}
                  <div className="mt-5 flex items-end justify-between rounded-2xl bg-gradient-to-br from-forest-600 to-ocean-600 px-5 py-4 text-white">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/75">
                        Projected savings
                      </div>
                      <div className="text-3xl font-extrabold">
                        <AnimatedNumber
                          value={estimate.annualSavings}
                          format={(n) => formatCurrency(n, 0)}
                        />
                        <span className="text-base font-semibold text-white/80"> / yr</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/80">
                      <div className="flex items-center justify-end gap-1">
                        <LeafIcon className="h-3.5 w-3.5" />
                        {formatNumber(estimate.co2Kg)} kg CO₂
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <ShieldIcon className="h-3.5 w-3.5" />
                        Comfort within 1°F
                      </div>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="mt-6 w-full" onClick={handleFinish}>
                  Finish setup
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </StepShell>
            )}

            {/* STEP 4 — success */}
            {step === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[2rem] bg-white p-10 text-center shadow-soft-lg ring-1 ring-black/5"
              >
                <Confetti />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest-600 text-white shadow-glow"
                >
                  <CheckIcon className="h-10 w-10" />
                </motion.div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-forest-950">
                  You&apos;re connected! 🎉
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-forest-800/70">
                  Your {brand?.name} is now optimizing in the background. We&apos;ll hold comfort
                  within 1°F and your savings start accruing right away.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/dashboard" size="lg" className="w-full sm:w-auto">
                    Go to my dashboard
                    <ArrowRightIcon className="h-5 w-5" />
                  </ButtonLink>
                </div>
                <p className="mt-4 text-xs text-forest-700/50">Redirecting automatically…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back link */}
          {step > 0 && step < 3 && (
            <button
              onClick={() => {
                if (step === 1) setAuthState("idle");
                setStep((s) => s - 1);
              }}
              className="mx-auto mt-6 block text-sm font-semibold text-forest-700/60 transition-colors hover:text-forest-900"
            >
              ← Back
            </button>
          )}
        </div>

        {/* tiny reset for the demo */}
        {ready && session.activated && step < 3 && (
          <button
            onClick={reset}
            className="mt-8 text-xs text-forest-700/40 underline-offset-2 hover:underline"
          >
            Reset demo
          </button>
        )}
      </main>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-center text-[1.7rem] font-extrabold leading-tight tracking-tight text-forest-950">
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-[14px] text-forest-800/70">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </motion.div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-5 w-5 animate-spin rounded-full border-[3px] border-forest-200 border-t-forest-600" />
  );
}

function Confetti() {
  const pieces = Array.from({ length: 28 });
  const colors = ["#22c55e", "#3b82f6", "#14b8a6", "#86efac", "#60a5fa"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 1.6 + Math.random() * 1.4;
        const color = colors[i % colors.length];
        return (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration, delay, ease: "easeIn" }}
            style={{ left: `${left}%`, backgroundColor: color }}
            className="absolute top-0 h-2.5 w-2 rounded-sm"
          />
        );
      })}
    </div>
  );
}
