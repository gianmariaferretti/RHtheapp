"use client";

import { useEffect, useState } from "react";
import { SIM_CONFIG } from "./config";
import { co2FromSavings, savingsToDate, treesFromCo2 } from "./calc";

export interface LiveSavings {
  total: number; // $
  co2Kg: number;
  trees: number;
}

/**
 * Continuously recomputes savings-to-date from the activation timestamp + rewards.
 * Because it derives from timestamps (not an accumulator), it survives refreshes and
 * stays correct even if the tab was backgrounded.
 */
export function useLiveSavings(
  annualSavings: number,
  activatedAt: number | null,
  rewardSavings: number
): LiveSavings {
  const [total, setTotal] = useState(() =>
    savingsToDate(annualSavings, activatedAt, rewardSavings)
  );

  useEffect(() => {
    const tick = () => setTotal(savingsToDate(annualSavings, activatedAt, rewardSavings));
    tick();
    const id = setInterval(tick, SIM_CONFIG.TICKER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [annualSavings, activatedAt, rewardSavings]);

  const co2Kg = co2FromSavings(total);
  return { total, co2Kg, trees: treesFromCo2(co2Kg) };
}
