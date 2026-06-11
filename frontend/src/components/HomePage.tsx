"use client";

import { I18nProvider } from "@/i18n/I18nProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ImpactSection } from "@/components/landing/ImpactSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { VisionSection } from "@/components/landing/VisionSection";
import { Footer } from "@/components/landing/Footer";
import { WasteDetectorApp } from "@/components/WasteDetectorApp";

export function HomePage() {
  return (
    <I18nProvider>
      <SmoothScroll>
        <SiteNav />
        <main>
          <Hero />
          <ProblemSection />
          <ImpactSection />
          <SolutionSection />
          <WasteDetectorApp />
          <VisionSection />
        </main>
        <Footer />
      </SmoothScroll>
    </I18nProvider>
  );
}
