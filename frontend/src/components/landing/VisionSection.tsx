"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

const POINT_ICONS = ["🗑️", "📱", "🏙️"];

export function VisionSection() {
  const { t } = useI18n();

  return (
    <section
      id="vision"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950 px-4 py-24 text-white sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
            {t.vision.label}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
              {t.vision.title}
            </span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
            {t.vision.body}
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {t.vision.points.map((point, i) => (
            <ScrollReveal key={point.title} delay={0.1 * i}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/35 sm:p-7">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl ring-1 ring-emerald-400/25 sm:text-3xl">
                  {POINT_ICONS[i]}
                </div>
                <h3 className="mt-4 text-base font-bold sm:text-lg">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{point.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-7 text-center shadow-[0_30px_80px_-30px_rgba(16,185,129,0.5)] sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-100">
              {t.vision.goalTitle}
            </h3>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-white sm:text-xl">
              “{t.vision.goal}”
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
