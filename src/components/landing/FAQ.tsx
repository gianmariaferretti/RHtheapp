"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "./SavingsCalculator";
import { ChevronDownIcon } from "@/components/ui/icons";

const FAQS = [
  {
    q: "Will I lose comfort?",
    a: "No. Renew Home holds your home within 1°F of your target. It pre-cools or pre-heats before a peak so you barely notice anything — and you can override any event instantly.",
  },
  {
    q: "Does it work with my thermostat?",
    a: "If you have a Nest/Google, Ecobee, Honeywell, LG ThinQ, Rheem, or Amazon smart thermostat, you're covered. Connecting takes about a minute and needs no new hardware.",
  },
  {
    q: "How do I actually save money?",
    a: "Electricity costs more during peak demand. By gently shifting your heating and cooling to cheaper, cleaner windows — and earning rewards for helping the grid during peak events — your bill goes down over the year.",
  },
  {
    q: "Am I really in control?",
    a: "Always. One tap pauses optimization for any event, comfort-first. You set your temperature and how aggressive the savings are, and you can disconnect at any time.",
  },
  {
    q: "Is my data safe?",
    a: "Renew Home only uses your thermostat's temperature and setpoints to optimize energy. (This is a simulated prototype, so no real account or device is ever connected.)",
  },
  {
    q: "What does it cost?",
    a: "Connecting is free. Renew Home only succeeds when you save — there's nothing to lose by trying it.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-4">
      <div className="container-page py-12">
        <SectionHeading eyebrow="FAQ" title="Good questions, clear answers" />

        <div className="mt-7 space-y-2.5">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="card overflow-hidden transition-shadow hover:shadow-soft"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-forest-950">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-forest-500"
                  >
                    <ChevronDownIcon className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-forest-800/75">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
