import { SIM_CONFIG, AGGRESSIVENESS, SECONDS_PER_YEAR } from "./config";
import type { Aggressiveness } from "./types";

export interface SavingsEstimate {
  annualSavings: number; // $
  co2Kg: number; // kg CO2 avoided / yr
  trees: number; // tree-years equivalent
}

/**
 * Indicative savings model (fully fictional):
 *   annual_savings ≈ monthly_bill * 12 * RATE * aggressiveness
 *   co2_kg         ≈ annual_savings * CO2_KG_PER_DOLLAR
 *   trees          ≈ co2_kg / CO2_KG_PER_TREE
 */
export function estimateSavings(
  monthlyBill: number,
  aggressiveness: Aggressiveness = "balanced"
): SavingsEstimate {
  const multiplier = AGGRESSIVENESS[aggressiveness].multiplier;
  const annualSavings = monthlyBill * 12 * SIM_CONFIG.ANNUAL_SAVINGS_RATE * multiplier;
  const co2Kg = annualSavings * SIM_CONFIG.CO2_KG_PER_DOLLAR;
  const trees = co2Kg / SIM_CONFIG.CO2_KG_PER_TREE;
  return { annualSavings, co2Kg, trees };
}

/** Dollars accrued per real second of the live ticker (accelerated for the demo). */
export function ratePerSecond(annualSavings: number): number {
  return (annualSavings / SECONDS_PER_YEAR) * SIM_CONFIG.DEMO_TIME_MULTIPLIER;
}

/**
 * Total simulated savings-to-date = passive optimization accrual + grid-event rewards.
 * Recomputed purely from timestamps so a page refresh stays consistent.
 */
export function savingsToDate(
  annualSavings: number,
  activatedAt: number | null,
  rewardSavings: number,
  now: number = Date.now()
): number {
  if (!activatedAt) return rewardSavings;
  const elapsedSeconds = Math.max(0, (now - activatedAt) / 1000);
  return rewardSavings + ratePerSecond(annualSavings) * elapsedSeconds;
}

export function co2FromSavings(savings: number): number {
  return savings * SIM_CONFIG.CO2_KG_PER_DOLLAR;
}

export function treesFromCo2(co2Kg: number): number {
  return co2Kg / SIM_CONFIG.CO2_KG_PER_TREE;
}

// ---- formatting helpers ----

export function formatCurrency(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
