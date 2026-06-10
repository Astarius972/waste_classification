"use client";

import { I18nProvider } from "@/i18n/I18nProvider";
import { PresentationLanding } from "@/components/PresentationLanding";
import { SiteNav } from "@/components/SiteNav";
import { WasteDetectorApp } from "@/components/WasteDetectorApp";

export function HomePage() {
  return (
    <I18nProvider>
      <SiteNav />
      <main className="pt-14 sm:pt-16">
        <PresentationLanding />
        <WasteDetectorApp />
      </main>
    </I18nProvider>
  );
}
