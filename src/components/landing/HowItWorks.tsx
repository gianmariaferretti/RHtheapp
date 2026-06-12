"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SavingsCalculator";
import { ThermostatIcon, GridIcon, DollarIcon } from "@/components/ui/icons";

const STEPS = [
  {
    icon: <ThermostatIcon className="h-7 w-7" />,
    title: "Connect your thermostat",
    body: "Link the smart thermostat you already own in about 60 seconds. No new hardware, no technician, no rewiring.",
  },
  {
    icon: <GridIcon className="h-7 w-7" />,
    title: "We watch the grid for you",
    body: "Renew Home reads live grid prices and carbon intensity, then pre-cools or pre-heats so you ride out expensive peaks in comfort.",
  },
  {
    icon: <DollarIcon className="h-7 w-7" />,
    title: "You save — automatically",
    body: "Savings and rewards stack up on your dashboard. Comfort stays within 1°F, and you can override anytime with one tap.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-4">
      <div className="container-page py-12">
        <SectionHeading
          eyebrow="How it works"
          title="Set it once. Save all year."
          subtitle="Three simple steps. Then Renew Home quietly does the work in the background."
        />

        <div className="relative mt-7 grid gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="card relative p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-ocean-500 text-white shadow-soft">
                {step.icon}
              </div>
              <span className="absolute right-7 top-7 text-5xl font-black text-forest-100">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold text-forest-950">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-forest-800/70">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
