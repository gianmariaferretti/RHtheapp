"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "@/lib/useSession";
import { getBrand } from "@/lib/brands";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

/** Shown on the landing page when a previously-activated session is found in localStorage. */
export function ResumeBanner() {
  const { session, ready } = useSession();
  const show = ready && session.activated;
  const brand = getBrand(session.brandId);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="container-page pt-4"
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-2xl bg-forest-600 px-5 py-3 text-white shadow-soft transition-all hover:shadow-soft-lg"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">
              Welcome back — your {brand?.name ?? "thermostat"} is connected and saving.
            </span>
            <span className="ml-auto flex items-center gap-1 text-sm font-bold">
              Open dashboard
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
