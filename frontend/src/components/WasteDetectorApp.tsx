"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { checkHealth } from "@/lib/api";
import type { ScanMode } from "@/types/detection";
import { CameraScanner } from "./CameraScanner";
import { ImageUpload } from "./ImageUpload";
import { ScrollReveal } from "./ScrollReveal";

export function WasteDetectorApp() {
  const { t } = useI18n();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    void checkHealth().then(setApiOnline);
  }, []);

  return (
    <section id="scanner" className="scroll-mt-20 bg-slate-950 px-4 py-16 text-white sm:scroll-mt-24 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">{t.scanner.badge}</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{t.scanner.title}</h2>
          <p className="mt-3 max-w-2xl text-slate-400">{t.scanner.subtitle}</p>
          {apiOnline === false && (
            <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
              {t.scanner.apiOffline}
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-10">
          <div className="mb-8 flex gap-2 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
            {(["camera", "upload"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  mode === tab
                    ? "bg-emerald-500 text-emerald-950"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {tab === "camera" ? t.scanner.camera : t.scanner.upload}
              </button>
            ))}
          </div>

          {mode === "camera" ? <CameraScanner /> : <ImageUpload />}
        </ScrollReveal>
      </div>
    </section>
  );
}
