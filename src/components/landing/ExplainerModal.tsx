"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonLink, Button } from "@/components/ui/Button";
import { ThermostatIcon, GridIcon, DollarIcon, ShieldIcon, BoltIcon } from "@/components/ui/icons";

const SCENES = [
  {
    icon: <ThermostatIcon className="h-8 w-8" />,
    title: "Your thermostat, connected",
    body: "Renew Home links to the smart thermostat you already own — securely, in about a minute.",
    color: "from-forest-500 to-forest-600",
  },
  {
    icon: <GridIcon className="h-8 w-8" />,
    title: "The grid has cheap & dirty hours",
    body: "Electricity is pricier and more carbon-heavy at peak times. We see those moments coming.",
    color: "from-ocean-500 to-ocean-600",
  },
  {
    icon: <BoltIcon className="h-8 w-8" />,
    title: "We shift your energy gently",
    body: "A tiny pre-cool or pre-heat lets your home coast through the peak — comfort held within 1°F.",
    color: "from-accent to-forest-500",
  },
  {
    icon: <DollarIcon className="h-8 w-8" />,
    title: "You earn savings & rewards",
    body: "Lower bills plus event rewards stack up automatically on your live dashboard.",
    color: "from-forest-500 to-ocean-500",
  },
  {
    icon: <ShieldIcon className="h-8 w-8" />,
    title: "Always in your control",
    body: "Override any event with one tap. It's your home — Renew Home never overrides you.",
    color: "from-forest-600 to-forest-700",
  },
];

export function ExplainerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scene, setScene] = useState(0);

  // Auto-advance the "video" while open.
  useEffect(() => {
    if (!open) return;
    setScene(0);
    const id = setInterval(() => {
      setScene((s) => (s + 1) % SCENES.length);
    }, 2600);
    return () => clearInterval(id);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const current = SCENES[scene];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Renew Home explainer"
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-soft-lg"
          >
            {/* "Video" stage */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-forest-900 to-ocean-900">
              <div className="absolute inset-0 opacity-30 [background:radial-gradient(40rem_20rem_at_70%_-10%,rgba(94,234,212,0.5),transparent)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white"
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${current.color} shadow-soft-lg`}
                  >
                    {current.icon}
                  </div>
                  <h3 className="mt-6 text-2xl font-extrabold tracking-tight">{current.title}</h3>
                  <p className="mt-2 max-w-sm text-sm text-white/80">{current.body}</p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Close explainer"
              >
                ✕
              </button>

              {/* progress dots */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {SCENES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setScene(i)}
                    aria-label={`Go to scene ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === scene ? "w-6 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6">
              <p className="text-sm text-forest-800/70">
                That&apos;s the whole idea. Ready to try it?
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
                <ButtonLink href="/activate" size="md">
                  Connect
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
