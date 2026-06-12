"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SIM_CONFIG } from "@/lib/config";
import { formatCurrency } from "@/lib/calc";
import { useSession } from "@/lib/useSession";
import type { GridEvent } from "@/lib/types";
import { OverrideToggle } from "./OverrideToggle";
import { Button } from "@/components/ui/Button";
import {
  BoltIcon,
  CheckIcon,
  ShieldIcon,
  GridIcon,
  LeafIcon,
} from "@/components/ui/icons";

type Phase = "idle" | "detecting" | "shifting" | "reward";

export function GridEventsPanel({ targetTempF }: { targetTempF: number }) {
  const { session, dispatchEvent, setOverride } = useSession();
  const [active, setActive] = useState<GridEvent | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [now, setNow] = useState(() => Date.now());

  const animatingRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const triggerRef = useRef<(auto: boolean) => void>(() => {});

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const trigger = useCallback(
    (auto: boolean) => {
      if (animatingRef.current) return;
      const event = dispatchEvent(auto);
      animatingRef.current = true;
      setActive(event);
      setPhase("detecting");
      clearTimers();
      timersRef.current.push(window.setTimeout(() => setPhase("shifting"), 1000));
      timersRef.current.push(window.setTimeout(() => setPhase("reward"), 2600));
      timersRef.current.push(
        window.setTimeout(() => {
          setPhase("idle");
          setActive(null);
          animatingRef.current = false;
        }, 5400)
      );
    },
    [dispatchEvent]
  );
  triggerRef.current = trigger;

  // Auto-fire a random event occasionally.
  useEffect(() => {
    let cancelled = false;
    let id: number;
    const schedule = () => {
      const base = SIM_CONFIG.AUTO_EVENT_AVG_SECONDS * 1000;
      const wait = base * (0.6 + Math.random() * 0.9); // ~0.6x–1.5x of average
      id = window.setTimeout(() => {
        if (cancelled) return;
        triggerRef.current(true);
        schedule();
      }, wait);
    };
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  // Keep relative timestamps fresh.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  // Cleanup on unmount.
  useEffect(() => clearTimers, []);

  const overridden = active?.overridden ?? session.overrideActive;

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-100 text-ocean-600">
            <GridIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-forest-950">Grid events</h3>
            <p className="text-sm text-forest-700/60">
              Watch Renew Home shift load during a peak.
            </p>
          </div>
        </div>
        <Button
          onClick={() => trigger(false)}
          disabled={phase !== "idle"}
          className="shrink-0"
        >
          <BoltIcon className="h-4 w-4" />
          Simulate a grid peak event
        </Button>
      </div>

      {/* Dispatch stage */}
      <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-50 to-ocean-50 p-5 ring-1 ring-black/5">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 py-3"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-forest-500" />
              </span>
              <span className="text-sm font-semibold text-forest-800">
                Grid is calm — Renew Home is standing by, optimizing quietly.
              </span>
            </motion.div>
          )}

          {phase === "detecting" && active && (
            <motion.div
              key="detecting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 py-3"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"
              >
                <BoltIcon className="h-6 w-6" />
              </motion.span>
              <div>
                <div className="text-sm font-bold text-forest-950">
                  Grid peak detected — {active.label}
                </div>
                <div className="text-xs text-forest-700/60">Analyzing the cheapest way through…</div>
              </div>
            </motion.div>
          )}

          {phase === "shifting" && active && (
            <motion.div
              key="shifting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-1"
            >
              {overridden ? (
                <div className="flex items-center gap-3 py-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <ShieldIcon className="h-6 w-6" />
                  </span>
                  <div className="text-sm font-semibold text-forest-900">
                    Override is on — holding your comfort and sitting this event out.
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-forest-700/70">
                    <span>Peak hours</span>
                    <span>Off-peak</span>
                  </div>
                  <div className="relative mt-2 flex h-9 items-center justify-between rounded-full bg-white px-3 ring-1 ring-black/5">
                    <span className="z-10 text-xs font-bold text-rose-500">$$$</span>
                    {[0, 1, 2, 3].map((i) => (
                      <motion.span
                        key={i}
                        initial={{ left: "12%", opacity: 0 }}
                        animate={{ left: "84%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity }}
                        className="absolute h-2.5 w-2.5 rounded-full bg-forest-500"
                      />
                    ))}
                    <span className="z-10 text-xs font-bold text-forest-600">¢</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-forest-800">
                    <motion.span
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      🌡️
                    </motion.span>
                    Gently shifting load · comfort {targetTempF}.0°F →{" "}
                    {(targetTempF + active.comfortDriftF).toFixed(1)}°F
                    <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[11px] text-forest-700">
                      within 1°F
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {phase === "reward" && active && (
            <motion.div
              key="reward"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 py-2 text-center"
            >
              {overridden ? (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <ShieldIcon className="h-7 w-7" />
                  </span>
                  <div className="mt-1 text-lg font-extrabold text-forest-950">Comfort protected</div>
                  <p className="text-xs text-forest-700/70">
                    You opted out of this event. No change to your home, $0 earned — your call.
                  </p>
                </>
              ) : (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 12 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-600 text-white shadow-glow"
                  >
                    <CheckIcon className="h-7 w-7" />
                  </motion.span>
                  <motion.div
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-1 text-3xl font-extrabold text-forest-700"
                  >
                    +{formatCurrency(active.reward)}
                  </motion.div>
                  <p className="text-xs text-forest-700/70">
                    Reward earned · comfort held within 1°F · {active.kWhShifted} kWh shifted off-peak
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Override control */}
      <div className="mt-4">
        <OverrideToggle active={session.overrideActive} onChange={setOverride} />
      </div>

      {/* Event history */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-forest-900">Event history</h4>
          <span className="text-xs text-forest-700/50">{session.events.length} events</span>
        </div>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {session.events.length === 0 && (
              <p className="py-6 text-center text-sm text-forest-700/50">
                No events yet — simulate one above to see it logged here.
              </p>
            )}
            {session.events.map((evt) => (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-2xl bg-forest-50/70 px-4 py-3"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    evt.overridden
                      ? "bg-amber-100 text-amber-600"
                      : "bg-white text-forest-600 shadow-sm"
                  }`}
                >
                  {evt.overridden ? (
                    <ShieldIcon className="h-5 w-5" />
                  ) : (
                    <LeafIcon className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-forest-950">{evt.label}</div>
                  <div className="text-xs text-forest-700/60">
                    {timeAgo(evt.timestamp, now)} ·{" "}
                    {evt.auto ? "Auto-dispatched" : "You triggered"}
                    {!evt.overridden && ` · ${evt.kWhShifted} kWh`}
                  </div>
                </div>
                {evt.overridden ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    Overridden
                  </span>
                ) : (
                  <span className="rounded-full bg-forest-100 px-2.5 py-1 text-sm font-extrabold text-forest-700">
                    +{formatCurrency(evt.reward)}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function timeAgo(ts: number, now: number): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
