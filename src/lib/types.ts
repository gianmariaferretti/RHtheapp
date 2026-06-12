// Shared domain types for the Renew Home simulated prototype.

export type Aggressiveness = "comfort" | "balanced" | "max";

export interface Brand {
  id: string;
  name: string;
  /** Short tagline shown in the brand picker. */
  blurb: string;
  /** Tailwind gradient classes used for the brand chip. */
  accent: string;
}

export interface GridEvent {
  id: string;
  /** Epoch ms when the event fired. */
  timestamp: number;
  /** Human label, e.g. "Evening grid peak". */
  label: string;
  /** Reward credited to the user, in dollars. */
  reward: number;
  /** Max comfort drift during the event, in °F (always <= 1). */
  comfortDriftF: number;
  /** kWh of load shifted away from the peak. */
  kWhShifted: number;
  /** Whether the user overrode (opted out of) this event. */
  overridden: boolean;
  /** True if auto-fired by the simulation, false if user-triggered. */
  auto: boolean;
}

/** The persisted user session. Everything is simulated. */
export interface Session {
  /** Has the user completed activation? */
  activated: boolean;
  brandId: string | null;
  aggressiveness: Aggressiveness;
  targetTempF: number;
  /** Monthly electricity bill captured during onboarding, in dollars. */
  monthlyBill: number;
  /** Epoch ms the thermostat was connected. Drives the live ticker. */
  activatedAt: number | null;
  /** Sum of rewards earned from grid events, in dollars. */
  rewardSavings: number;
  /** Event history, newest first. */
  events: GridEvent[];
  /** Is optimization currently paused (comfort-first override)? */
  overrideActive: boolean;
  /** Schema version for forward-compatible migrations. */
  version: number;
}
