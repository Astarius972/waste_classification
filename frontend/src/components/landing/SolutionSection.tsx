"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

const STEP_ICONS = ["📷", "🤖", "🗂️", "🌱"];
const STORY_ICONS = ["🏆", "🌐", "🚀"];
const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "YOLOv8",
  "OpenCV",
  "GitHub",
  "Vercel",
  "Render",
];

export function SolutionSection() {
  const { t } = useI18n();

  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <div className="pointer-events-none absolute -left-32 bottom-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
            {t.solution.label}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t.solution.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t.solution.subtitle}
          </p>
        </ScrollReveal>

        {/* Workflow */}
        <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/40 to-emerald-400/0 lg:block" />
          {t.solution.steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={0.1 * i}>
              <div className="group relative h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition hover:-translate-y-1.5 hover:border-emerald-400/40 hover:shadow-[0_20px_60px_-20px_rgba(52,211,153,0.35)]">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/10 text-3xl ring-1 ring-emerald-400/30">
                  {STEP_ICONS[i]}
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-emerald-950">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-center text-base font-bold sm:text-lg">{step.title}</h3>
                <p className="mt-2 text-center text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Story + tech stack */}
        <div className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <ScrollReveal>
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                {t.about.storyTitle}
              </h3>
            </ScrollReveal>
            <ol className="relative mt-6 space-y-8 border-l border-emerald-400/25 pl-8">
              {t.about.story.map((step, i) => (
                <ScrollReveal key={step.title} delay={0.1 * i}>
                  <li className="relative">
                    <span className="absolute -left-[2.85rem] flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/40 bg-slate-900 text-lg shadow-[0_0_20px_-4px_rgba(52,211,153,0.5)]">
                      {STORY_ICONS[i]}
                    </span>
                    <h4 className="text-base font-bold sm:text-lg">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                      {step.description}
                    </p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>

          <ScrollReveal delay={0.15}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-7">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                {t.about.techTitle}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-emerald-400/20 sm:text-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
