"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { ScrollReveal } from "./ScrollReveal";
import type { WasteModelType } from "./WasteModel3D";

const WasteModel3D = dynamic(
  () => import("./WasteModel3D").then((m) => m.WasteModel3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] min-h-[220px] items-center justify-center rounded-2xl bg-slate-900/60 sm:min-h-[280px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    ),
  },
);

const PROBLEM_ICONS = ["🌊", "💨", "🧪", "🦊"];
const SLIDE_IDS = ["hero", "crisis", "problems", "examples", "cta"];

function SlideShell({
  id,
  children,
  className = "",
  dark = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative flex min-h-[100svh] items-center overflow-hidden px-4 py-20 sm:px-8 sm:py-24 lg:px-12 ${className}`}
    >
      {dark && (
        <>
          <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </>
      )}
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function PresentationLanding() {
  const { t } = useI18n();
  const [model, setModel] = useState<WasteModelType>("bottle");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const sections = SLIDE_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SLIDE_IDS.indexOf(entry.target.id);
            if (idx >= 0) setActiveSlide(idx);
          }
        });
      },
      { threshold: 0.45 },
    );
    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="presentation-scroll">
      {/* Slide progress — desktop side rail */}
      <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex lg:right-6">
        {SLIDE_IDS.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              activeSlide === i ? "scale-125 bg-emerald-400" : "bg-white/25 hover:bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <SlideShell id="hero" dark className="bg-slate-950 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                {t.hero.badge}
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                  {t.hero.title}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {t.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#crisis"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-emerald-400 px-6 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-300"
                >
                  {t.hero.cta}
                </a>
                <a
                  href="#scanner"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  {t.nav.tryNow}
                </a>
              </div>
              <p className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400/70">
                <span className="inline-block h-6 w-px animate-pulse bg-emerald-400/50" />
                {t.hero.scrollHint}
              </p>
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <WasteModel3D type="bottle" />
          </ScrollReveal>
        </div>
      </SlideShell>

      <SlideShell id="crisis" className="bg-gradient-to-b from-white to-emerald-50/40 text-slate-900 dark:from-zinc-950 dark:to-emerald-950/20 dark:text-zinc-50">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{t.slides.crisis.label}</span>
          <h2 className="mt-3 max-w-4xl text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {t.slides.crisis.title}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-zinc-400 sm:text-lg">
            {t.slides.crisis.body}
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            [t.slides.crisis.stat1, t.slides.crisis.stat1Label],
            [t.slides.crisis.stat2, t.slides.crisis.stat2Label],
            [t.slides.crisis.stat3, t.slides.crisis.stat3Label],
          ].map(([value, label], i) => (
            <ScrollReveal key={label} delay={0.08 * i}>
              <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white p-5 shadow-xl shadow-emerald-900/5 sm:p-6 dark:border-emerald-900/30 dark:bg-zinc-900/80">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl" />
                <p className="text-2xl font-black text-emerald-600 sm:text-3xl md:text-4xl dark:text-emerald-400">{value}</p>
                <p className="mt-2 text-sm leading-snug text-slate-600 dark:text-zinc-400">{label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SlideShell>

      <SlideShell id="problems" className="bg-slate-100 text-slate-900 dark:bg-zinc-900 dark:text-zinc-50">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{t.slides.problems.label}</span>
          <h2 className="mt-3 max-w-3xl text-2xl font-extrabold sm:text-3xl md:text-4xl">{t.slides.problems.title}</h2>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {t.slides.problems.items.map((item, i) => (
            <ScrollReveal key={item.title} delay={0.06 * i}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-2xl dark:from-emerald-900/50 dark:to-teal-900/30">
                  {PROBLEM_ICONS[i]}
                </div>
                <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-zinc-400">{item.description}</p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all group-hover:w-full" />
              </article>
            </ScrollReveal>
          ))}
        </div>
      </SlideShell>

      <SlideShell id="examples" dark className="bg-gradient-to-br from-slate-950 via-emerald-950/80 to-slate-950 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <ScrollReveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{t.slides.examples.label}</span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl md:text-4xl">{t.slides.examples.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/75 sm:text-base">{t.slides.examples.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              {(["bottle", "can", "bag"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setModel(key)}
                  className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                    model === key
                      ? "bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {key === "bottle" ? t.slides.examples.bottle : key === "can" ? t.slides.examples.can : t.slides.examples.bag}
                </button>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <WasteModel3D type={model} />
          </ScrollReveal>
        </div>
      </SlideShell>

      <SlideShell id="cta" className="bg-white dark:bg-zinc-950">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{t.slides.cta.label}</span>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl md:text-4xl dark:text-zinc-50">
            {t.slides.cta.title}
          </h2>
          <p className="mx-auto mt-4 text-base text-slate-600 sm:text-lg dark:text-zinc-400">{t.slides.cta.subtitle}</p>
          <Link
            href="#scanner"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition hover:brightness-110"
          >
            {t.nav.tryNow} →
          </Link>
        </ScrollReveal>
      </SlideShell>
    </div>
  );
}
