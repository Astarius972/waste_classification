"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CountUp } from "./CountUp";

export function ProblemSection() {
  const { t } = useI18n();

  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-rose-400">
            {t.problem.label}
          </span>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t.problem.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t.problem.body}
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {t.problem.stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.12 * i}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition hover:border-emerald-400/30 sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl transition group-hover:bg-emerald-400/20" />
                <CountUp
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  className="block bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl"
                />
                <p className="mt-4 text-sm leading-snug text-slate-400 sm:text-base">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mongolia spotlight */}
        <ScrollReveal delay={0.15}>
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-rose-400/20 bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-slate-950 p-6 backdrop-blur-md sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl" aria-hidden>
                🇲🇳
              </span>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  {t.problem.mongolia.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  {t.problem.mongolia.body}
                </p>
              </div>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {t.problem.mongolia.stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={0.1 * i}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <CountUp
                      value={stat.value}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                      className="block bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl"
                    />
                    <p className="mt-3 text-xs leading-snug text-slate-400 sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
