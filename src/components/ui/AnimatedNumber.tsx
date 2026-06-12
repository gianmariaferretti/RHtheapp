"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  /** Format the interpolated value into the displayed string. */
  format?: (n: number) => string;
  /** Animation duration in seconds. */
  duration?: number;
  className?: string;
}

/**
 * Smoothly tweens between numeric values (used for savings/CO₂ counters).
 * Re-targets whenever `value` changes, so it works for both the always-climbing
 * ticker and discrete jumps (e.g. a +$2.50 reward).
 */
export function AnimatedNumber({
  value,
  format = (n) => n.toFixed(2),
  duration = 0.6,
  className,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(() => format(value));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(format(latest)),
    });
    return controls.stop;
    // format is stable in practice; intentionally excluded to avoid re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span className={className} aria-live="off">
      {display}
    </span>
  );
}
