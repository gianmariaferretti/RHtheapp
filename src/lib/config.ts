// Central knobs for the simulation. Tweak these to change how the demo "feels".
// NOTE: every number here is fictional and for demonstration only.

export const SIM_CONFIG = {
  /** Savings calculator: bill * 12 * RATE = indicative annual savings. */
  ANNUAL_SAVINGS_RATE: 0.06,
  /** kg CO2 avoided per dollar saved (indicative). */
  CO2_KG_PER_DOLLAR: 3.4,
  /** kg CO2 absorbed by one tree per year (indicative). */
  CO2_KG_PER_TREE: 21,

  /** Default monthly bill for the calculator slider ($). */
  DEFAULT_MONTHLY_BILL: 150,
  BILL_MIN: 50,
  BILL_MAX: 500,

  /**
   * Live ticker acceleration. Real elapsed seconds are multiplied by this so
   * the dollar counter visibly climbs during a demo while staying believable.
   * (A real year of savings would otherwise be invisible second-to-second.)
   */
  DEMO_TIME_MULTIPLIER: 2600,

  /** How often the ticker recomputes, in ms. */
  TICKER_INTERVAL_MS: 120,

  /** Reward range for a simulated grid event ($). */
  EVENT_REWARD_MIN: 1.75,
  EVENT_REWARD_MAX: 3.5,

  /** Average seconds between auto-fired grid events during the demo. */
  AUTO_EVENT_AVG_SECONDS: 75,

  /** Gamified "top X% of savers" band. */
  TOP_SAVER_PERCENT: 8,
} as const;

/** Multipliers applied to base savings depending on optimization aggressiveness. */
export const AGGRESSIVENESS = {
  comfort: { label: "Comfort", multiplier: 0.72, blurb: "Barely-there shifts. Comfort always wins." },
  balanced: { label: "Balanced", multiplier: 1.0, blurb: "The sweet spot of savings and comfort." },
  max: { label: "Max savings", multiplier: 1.34, blurb: "Lean into the cheapest, cleanest moments." },
} as const;

export const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
