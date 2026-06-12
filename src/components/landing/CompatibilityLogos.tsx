"use client";

import { motion } from "framer-motion";
import { BRANDS } from "@/lib/brands";

export function CompatibilityLogos() {
  return (
    <section className="container-page py-12">
      <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-forest-600">
        Works with the thermostat you already own
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-pill flex items-center gap-2.5 rounded-2xl px-3.5 py-3"
          >
            <span className={`h-6 w-6 shrink-0 rounded-lg bg-gradient-to-br ${brand.accent} shadow-sm`} />
            <span className="truncate text-[13px] font-bold text-forest-900">{brand.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
