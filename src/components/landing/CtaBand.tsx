"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { BoltIcon } from "@/components/ui/icons";

export function CtaBand() {
  return (
    <section className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-600 via-forest-600 to-ocean-600 px-6 py-12 text-center text-white shadow-soft-lg"
      >
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-ocean-300/20 blur-3xl" />
        <h2 className="relative text-balance text-[1.9rem] font-extrabold leading-tight tracking-tight">
          Cheaper, cleaner energy is one tap away.
        </h2>
        <p className="relative mx-auto mt-3 text-[15px] text-white/85">
          Join 5M+ homes already saving — effortlessly. Free to connect, always in your control.
        </p>
        <div className="relative mt-7 flex justify-center">
          <ButtonLink href="/activate" variant="white" size="lg">
            <BoltIcon className="h-5 w-5" />
            Connect My Thermostat
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
