import { SIM_CONFIG } from "./config";
import { seedEvents } from "./mockData";
import type { Session } from "./types";

export const STORAGE_KEY = "renew-home:session:v1";
const SCHEMA_VERSION = 1;

export function defaultSession(): Session {
  return {
    activated: false,
    brandId: null,
    aggressiveness: "balanced",
    targetTempF: 70,
    monthlyBill: SIM_CONFIG.DEFAULT_MONTHLY_BILL,
    activatedAt: null,
    rewardSavings: 0,
    events: [],
    overrideActive: false,
    version: SCHEMA_VERSION,
  };
}

export function loadSession(): Session {
  if (typeof window === "undefined") return defaultSession();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSession();
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed || parsed.version !== SCHEMA_VERSION) return defaultSession();
    // Merge against defaults so missing keys never crash the app.
    return { ...defaultSession(), ...parsed };
  } catch {
    return defaultSession();
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore quota / private-mode errors in this demo
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Build the session that results from completing the activation wizard. */
export function activatedSession(
  base: Session,
  payload: Pick<Session, "brandId" | "aggressiveness" | "targetTempF" | "monthlyBill">
): Session {
  return {
    ...base,
    ...payload,
    activated: true,
    activatedAt: Date.now(),
    // Seed with a little history so the dashboard feels lived-in.
    events: base.events.length ? base.events : seedEvents(),
    rewardSavings: base.events.length
      ? base.rewardSavings
      : seedEvents().reduce((sum, e) => sum + e.reward, 0),
    overrideActive: false,
  };
}
