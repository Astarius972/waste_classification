"use client";

import { useI18n } from "@/i18n/I18nProvider";

const NAV_LINKS = [
  { href: "#problem", key: "problem" as const },
  { href: "#impact", key: "impact" as const },
  { href: "#solution", key: "solution" as const },
  { href: "#scanner", key: "scan" as const },
];

const TECH = ["Next.js", "TypeScript", "FastAPI", "YOLOv8", "Vercel", "Render"];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative border-t border-white/10 bg-slate-950 px-4 pb-10 pt-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">
              Eco<span className="text-emerald-400">Scan</span>
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
              {t.footer.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {t.footer.description}
            </p>
            <a
              href="https://github.com/Astarius972/waste_classification"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              GitHub
            </a>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              {t.footer.navTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map(({ href, key }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-slate-300 transition hover:text-emerald-300">
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              {t.footer.techTitle}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {TECH.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} EcoScan</p>
          <p className="flex items-center gap-1.5">
            <span className="text-emerald-400">🌱</span>
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
