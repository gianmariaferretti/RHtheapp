import { SIM_CONFIG } from "./config";
import type { Aggressiveness, GridEvent } from "./types";

// ---------------------------------------------------------------------------
// Mock energy-usage curves for the dashboard chart.
// "typical" = a home with no optimization. "renew" = the same home on Renew Home.
// Values are indicative kWh per hour; the renew curve shaves the peak windows.
// ---------------------------------------------------------------------------

export interface UsagePoint {
  /** Label for the x-axis (hour of day or weekday). */
  label: string;
  typical: number;
  renew: number;
  /** True during a shaded peak window. */
  peak: boolean;
}

// Base 24-hour shape (midnight -> 11pm). Peaks: morning (6-9) + evening (17-21).
const HOURLY_TYPICAL = [
  0.4, 0.35, 0.3, 0.3, 0.35, 0.6, // 0-5
  1.4, 1.7, 1.5, 1.0, 0.8, 0.85, // 6-11
  0.9, 0.85, 0.9, 1.0, 1.3, 1.9, // 12-17
  2.2, 2.1, 1.7, 1.1, 0.7, 0.5, // 18-23
];

function isPeakHour(h: number): boolean {
  return (h >= 6 && h <= 8) || (h >= 17 && h <= 20);
}

export function buildHourlyUsage(aggressiveness: Aggressiveness = "balanced"): UsagePoint[] {
  // Stronger optimization shaves a little more off the peaks.
  const shave = aggressiveness === "max" ? 0.42 : aggressiveness === "comfort" ? 0.2 : 0.32;
  return HOURLY_TYPICAL.map((typical, h) => {
    const peak = isPeakHour(h);
    const renew = peak ? typical * (1 - shave) : typical * 1.04; // tiny pre-cooling shift
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "a" : "p";
    return {
      label: `${hour12}${ampm}`,
      typical: round(typical),
      renew: round(renew),
      peak,
    };
  });
}

// Weekly view: 7 days of daily totals.
const WEEKLY_TYPICAL = [24.1, 23.4, 25.0, 24.8, 26.2, 28.4, 27.1];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function buildWeeklyUsage(aggressiveness: Aggressiveness = "balanced"): UsagePoint[] {
  const shave = aggressiveness === "max" ? 0.14 : aggressiveness === "comfort" ? 0.07 : 0.11;
  return WEEKLY_TYPICAL.map((typical, i) => ({
    label: WEEKDAYS[i],
    typical: round(typical),
    renew: round(typical * (1 - shave)),
    peak: i >= 4, // weekend evenings run hotter on the grid
  }));
}

// ---------------------------------------------------------------------------
// Grid-event flavor text. A random label + reward is chosen on each dispatch.
// ---------------------------------------------------------------------------

const EVENT_LABELS = [
  "Evening grid peak",
  "Heatwave demand spike",
  "Cheap-wind window",
  "Solar surplus midday",
  "Cold-snap morning ramp",
  "Regional capacity crunch",
];

export function randomEventLabel(): string {
  return EVENT_LABELS[Math.floor(Math.random() * EVENT_LABELS.length)];
}

export function randomReward(): number {
  const { EVENT_REWARD_MIN, EVENT_REWARD_MAX } = SIM_CONFIG;
  const raw = EVENT_REWARD_MIN + Math.random() * (EVENT_REWARD_MAX - EVENT_REWARD_MIN);
  return Math.round(raw * 100) / 100;
}

let eventCounter = 0;

export function makeGridEvent(opts: { auto: boolean; overridden: boolean }): GridEvent {
  eventCounter += 1;
  return {
    id: `evt_${Date.now()}_${eventCounter}`,
    timestamp: Date.now(),
    label: randomEventLabel(),
    reward: opts.overridden ? 0 : randomReward(),
    comfortDriftF: opts.overridden ? 0 : Math.round((0.3 + Math.random() * 0.7) * 10) / 10,
    kWhShifted: opts.overridden ? 0 : Math.round((0.8 + Math.random() * 2.4) * 10) / 10,
    overridden: opts.overridden,
    auto: opts.auto,
  };
}

// A couple of seed events so a freshly-activated dashboard isn't empty.
export function seedEvents(): GridEvent[] {
  const now = Date.now();
  return [
    {
      id: "evt_seed_2",
      timestamp: now - 1000 * 60 * 47,
      label: "Solar surplus midday",
      reward: 2.4,
      comfortDriftF: 0.6,
      kWhShifted: 1.9,
      overridden: false,
      auto: true,
    },
    {
      id: "evt_seed_1",
      timestamp: now - 1000 * 60 * 60 * 5,
      label: "Evening grid peak",
      reward: 3.1,
      comfortDriftF: 0.8,
      kWhShifted: 2.6,
      overridden: false,
      auto: true,
    },
  ];
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
