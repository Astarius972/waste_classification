"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

// Decomposition timelines (approximate years) rendered on a log scale.
const ITEMS = [
  { key: "paper", icon: "📦", years: 0.12 },
  { key: "food_waste", icon: "🍌", years: 0.5 },
  { key: "plastic_bag", icon: "🛍️", years: 20 },
  { key: "can", icon: "🥫", years: 200 },
  { key: "plastic_bottle", icon: "🧴", years: 450 },
  { key: "glass_bottle", icon: "🍾", years: 1_000_000 },
] as const;

const MAX_LOG = Math.log10(1_000_000 * 10);

function barWidth(years: number): number {
  return Math.max(7, (Math.log10(years * 10) / MAX_LOG) * 100);
}

export function ImpactSection() {
  const { t } = useI18n();

  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/25 to-slate-950 px-4 py-24 text-white sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
            {t.impact.label}
          </span>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t.impact.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t.impact.subtitle}
          </p>
        </ScrollReveal>

        <div className="mt-14 space-y-3 sm:space-y-4">
          {ITEMS.map((item, i) => {
            const waste = t.waste[item.key];
            if (!waste) return null;
            return (
              <ScrollReveal key={item.key} delay={0.06 * i}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition hover:border-emerald-400/30 hover:bg-white/[0.07] sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-sm font-bold sm:text-base">{waste.category}</h3>
                        <span className="text-xs font-semibold text-emerald-300 sm:text-sm">
                          {waste.decomposition_time}
                        </span>
                      </div>
                      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/10 sm:h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${barWidth(item.years)}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-rose-400"
                        />
                      </div>
                      <p className="mt-2 hidden text-xs leading-relaxed text-slate-400 group-hover:block sm:text-sm">
                        {waste.environmental_impact}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-xs uppercase tracking-widest text-slate-500">
            {t.impact.scaleNote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
