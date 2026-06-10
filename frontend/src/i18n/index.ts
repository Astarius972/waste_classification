import en from "./en";
import mn from "./mn";
import type { Dictionary, Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = { en, mn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary, Locale, WasteTranslation } from "./types";
