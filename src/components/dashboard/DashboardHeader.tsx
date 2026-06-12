"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useSession } from "@/lib/useSession";

export function DashboardHeader() {
  const router = useRouter();
  const { session, reset } = useSession();
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    reset();
    router.push("/");
  };

  return (
    <header className="glass-nav sticky top-0 z-20 -mt-px border-x-0">
      <div className="container-page flex h-14 items-center justify-between gap-2">
        <Logo />

        <div className="flex items-center gap-2">
          {/* live status pill */}
          <div className="glass-pill flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-forest-700">
            <span className="relative flex h-2 w-2">
              {!session.overrideActive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  session.overrideActive ? "bg-amber-400" : "bg-forest-500"
                }`}
              />
            </span>
            {session.overrideActive ? "Paused" : "Optimizing"}
          </div>

          <button
            onClick={() => setConfirming(true)}
            className="rounded-full px-3 py-2 text-[12px] font-semibold text-forest-700/70 transition-colors hover:bg-forest-100 hover:text-forest-900"
          >
            Reset
          </button>
        </div>
      </div>

      {/* reset confirm dialog */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm"
              onClick={() => setConfirming(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-soft-lg"
            >
              <h3 className="text-lg font-extrabold text-forest-950">Reset the demo?</h3>
              <p className="mt-2 text-sm text-forest-700/70">
                This clears your saved session — activation, accrued savings, and event history —
                and returns you to the landing page.
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-full bg-forest-50 px-4 py-2.5 text-sm font-bold text-forest-800 ring-1 ring-black/5 hover:bg-forest-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-600"
                >
                  Reset everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
