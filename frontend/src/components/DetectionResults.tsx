"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { getWasteTranslation, resolveWasteKey } from "@/lib/waste";
import type { Detection } from "@/types/detection";

interface DetectionResultsProps {
  detections: Detection[];
  loading?: boolean;
  error?: string | null;
}

const INFO_STYLES = [
  { key: "decomposition" as const, icon: "⏳", accent: "from-amber-500/20 to-orange-500/10" },
  { key: "impact" as const, icon: "🌍", accent: "from-rose-500/20 to-red-500/10" },
  { key: "recycling" as const, icon: "♻️", accent: "from-emerald-500/20 to-teal-500/10" },
  { key: "disposal" as const, icon: "🗑️", accent: "from-sky-500/20 to-blue-500/10" },
];

function ConfidenceRing({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          className="text-emerald-400"
          strokeWidth="3"
          strokeDasharray={`${pct} 100`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs font-bold text-emerald-300">{pct}%</span>
    </div>
  );
}

export function DetectionResults({ detections, loading, error }: DetectionResultsProps) {
  const { t } = useI18n();

  if (error) {
    return (
      <div className="rounded-3xl border border-red-400/30 bg-red-950/40 p-6 backdrop-blur">
        <p className="font-semibold text-red-200">{t.results.failed}</p>
        <p className="mt-1 text-sm text-red-300/90">{error}</p>
      </div>
    );
  }

  if (!loading && detections.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center backdrop-blur">
        <p className="text-slate-300">{t.results.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {t.results.count} {detections.length > 0 ? `(${detections.length})` : ""}
        </h2>
        {loading && (
          <span className="animate-pulse text-sm text-emerald-300">{t.results.analyzing}</span>
        )}
      </div>

      {detections.map((item, index) => {
        const wasteKey = resolveWasteKey(item.label, item.waste_key);
        const info = getWasteTranslation(wasteKey, t.waste, t.unknownWaste, item.waste);

        return (
          <motion.article
            key={`${wasteKey}-${index}-${item.confidence}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-emerald-950/50 shadow-2xl backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-300/80">
                  {t.results.detectedAs}: {item.label}
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">{info.category}</h3>
              </div>
              <ConfidenceRing value={item.confidence} />
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {INFO_STYLES.map(({ key, icon, accent }) => {
                const label = t.results[key];
                const value =
                  key === "decomposition"
                    ? info.decomposition_time
                    : key === "impact"
                      ? info.environmental_impact
                      : key === "recycling"
                        ? info.recycling_recommendations
                        : info.disposal_methods;

                return (
                  <div
                    key={key}
                    className={`rounded-2xl bg-gradient-to-br ${accent} p-4 ring-1 ring-white/10`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                      <span>{icon}</span>
                      {label}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200/90">{value}</p>
                  </div>
                );
              })}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
