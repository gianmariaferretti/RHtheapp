"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "5M+", label: "homes already saving" },
  { value: "~$100", label: "saved per home, per year" },
  { value: "1°F", label: "max comfort drift" },
  { value: "100%", label: "of events you can override" },
];

const QUOTES = [
  {
    quote:
      "I connected my Nest in a minute and forgot about it. Months later there's real money on my dashboard and the house feels exactly the same.",
    name: "Maya R.",
    detail: "Austin, TX · Nest",
  },
  {
    quote:
      "What sold me is the override button. When we had guests I tapped it once and optimization paused. I'm genuinely in control.",
    name: "Daniel K.",
    detail: "Portland, OR · Ecobee",
  },
];

export function SocialProof() {
  return (
    <section className="container-page py-12">
      <div className="glass-dark relative overflow-hidden rounded-[2rem] p-6 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-forest-400/20 blur-2xl" />
        <div className="grid grid-cols-2 gap-5">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-forest-300 to-ocean-300 bg-clip-text text-[2.1rem] font-extrabold leading-none tracking-tight text-transparent">
                {s.value}
              </div>
              <div className="mt-1.5 text-[12px] leading-snug text-white/70">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
            >
              <div className="flex gap-0.5 text-forest-300">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s}>★</span>
                ))}
              </div>
              <blockquote className="mt-3 text-[13px] leading-relaxed text-white/85">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-4 text-[13px]">
                <span className="font-bold">{q.name}</span>
                <span className="ml-2 text-white/50">{q.detail}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
