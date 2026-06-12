"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SavingsCalculator";
import { ShieldIcon, SparklesIcon, LeafIcon } from "@/components/ui/icons";

const VALUES = [
  {
    icon: <ShieldIcon className="h-6 w-6" />,
    title: "Full control",
    body: "It's your home. Override any event with a single tap, set your comfort range, and pause whenever you like. Renew Home never overrides you.",
    tint: "from-forest-500 to-forest-600",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: "Beautifully simple",
    body: "No spreadsheets, no schedules, no guesswork. Connect once and watch the savings roll in from a dashboard that's genuinely a joy to check.",
    tint: "from-ocean-500 to-ocean-600",
  },
  {
    icon: <LeafIcon className="h-6 w-6" />,
    title: "Savings & safety",
    body: "Lower bills and a lighter footprint, without ever sacrificing comfort. Temperatures stay within 1°F — you'll barely notice a thing.",
    tint: "from-accent to-forest-500",
  },
];

export function Values() {
  return (
    <section id="values" className="scroll-mt-4">
      <div className="container-page py-12">
        <SectionHeading
          eyebrow="Why Renew Home"
          title="Effortless by design"
          subtitle="Built around three promises that never bend."
        />
        <div className="mt-7 grid gap-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="card group p-8 transition-shadow hover:shadow-soft-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${v.tint} text-white shadow-soft transition-transform group-hover:scale-110`}
              >
                {v.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-forest-950">{v.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-forest-800/70">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
