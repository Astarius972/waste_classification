"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";

const EarthCanvas = dynamic(() => import("./EarthCanvas"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const earthScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-slate-950"
    >
      {/* 3D Earth backdrop */}
      <motion.div style={{ scale: earthScale }} className="absolute inset-0">
        <EarthCanvas />
      </motion.div>

      {/* Readability gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-8 lg:px-12"
      >
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {t.hero.badge}
        </motion.span>

        <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
            className="block"
          >
            {t.hero.title1}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26, ease: EASE }}
            className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent"
          >
            {t.hero.title2}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href="#scanner"
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-emerald-400 px-8 text-sm font-bold text-emerald-950 shadow-[0_8px_40px_-8px_rgba(52,211,153,0.6)] transition hover:bg-emerald-300 hover:shadow-[0_8px_50px_-6px_rgba(52,211,153,0.8)]"
          >
            {t.hero.ctaPrimary}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#problem"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-emerald-400/70"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block h-7 w-px bg-gradient-to-b from-emerald-400/80 to-transparent"
          />
          {t.hero.scrollHint}
        </motion.p>
      </motion.div>
    </section>
  );
}
