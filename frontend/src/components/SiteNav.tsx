"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

const LINKS = [
  { href: "#crisis", key: "crisis" as const },
  { href: "#problems", key: "problems" as const },
  { href: "#examples", key: "examples" as const },
  { href: "#scanner", key: "scan" as const },
];

export function SiteNav() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-slate-950/90 shadow-lg backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <a href="#hero" className="text-lg font-bold tracking-tight text-white sm:text-xl">
          EcoScan
        </a>

        <nav className="hidden items-center gap-5 text-sm text-emerald-100/85 md:flex">
          {LINKS.map(({ href, key }) => (
            <a key={href} href={href} className="transition hover:text-white">
              {t.nav[key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white/10 p-0.5 sm:p-1">
            {(["en", "mn"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`min-h-[36px] min-w-[36px] rounded-full px-2.5 text-xs font-bold uppercase sm:px-3 ${
                  locale === code ? "bg-emerald-400 text-emerald-950" : "text-white/80"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/15 text-white md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-slate-950/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map(({ href, key }) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-emerald-100 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {t.nav[key]}
              </a>
            ))}
            <a
              href="#scanner"
              className="mt-2 rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-emerald-950"
              onClick={() => setOpen(false)}
            >
              {t.nav.tryNow}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
