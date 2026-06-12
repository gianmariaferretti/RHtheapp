"use client";

import { motion } from "framer-motion";
import { ShieldIcon, BoltIcon } from "@/components/ui/icons";

export function OverrideToggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`card flex items-center gap-4 p-5 transition-colors ${
        active ? "ring-2 ring-amber-300" : ""
      }`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
          active ? "bg-amber-100 text-amber-600" : "bg-forest-100 text-forest-600"
        }`}
      >
        {active ? <ShieldIcon className="h-6 w-6" /> : <BoltIcon className="h-6 w-6" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-forest-950">
          {active ? "Comfort-first override is ON" : "Optimization is active"}
        </div>
        <p className="text-xs leading-relaxed text-forest-700/65">
          {active
            ? "Renew Home will sit out the next event. Your comfort comes first."
            : "One tap pauses optimization for events — you're always in control."}
        </p>
      </div>

      <button
        role="switch"
        aria-checked={active}
        aria-label="Toggle comfort-first override"
        onClick={() => onChange(!active)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
          active ? "bg-amber-400" : "bg-forest-200"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md ${
            active ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
