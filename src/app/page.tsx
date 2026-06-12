"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { CompatibilityLogos } from "@/components/landing/CompatibilityLogos";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Values } from "@/components/landing/Values";
import { SocialProof } from "@/components/landing/SocialProof";
import { FAQ } from "@/components/landing/FAQ";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";
import { ExplainerModal } from "@/components/landing/ExplainerModal";
import { ResumeBanner } from "@/components/ResumeBanner";

export default function LandingPage() {
  const [explainerOpen, setExplainerOpen] = useState(false);

  return (
    <div>
      <Header />
      <ResumeBanner />
      <main>
        <Hero onWatchExplainer={() => setExplainerOpen(true)} />
        <CompatibilityLogos />
        <HowItWorks />
        <SavingsCalculator />
        <Values />
        <SocialProof />
        <FAQ />
        <CtaBand />
      </main>
      <Footer />
      <ExplainerModal open={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </div>
  );
}
