import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import { translations } from "./translations";

const DEFAULT_LOCALE = "en";
const supportedLocales = new Set(Object.keys(translations));
const KEY_DOT_REPLACER = "∙";

function normalizeLocale(languageCode?: string | null): string {
  if (!languageCode) return DEFAULT_LOCALE;
  if (supportedLocales.has(languageCode)) return languageCode;
  return DEFAULT_LOCALE;
}

function getDeviceLanguageCode(): string {
  const locales = getLocales();
  const languageCode = locales[0]?.languageCode;
  return normalizeLocale(languageCode);
}

function normalizeKey(key: string): string {
  return key.replace(/\./g, KEY_DOT_REPLACER);
}

const normalizedTranslations = Object.fromEntries(
  Object.entries(translations).map(([locale, dictionary]) => [
    locale,
    Object.fromEntries(
      Object.entries(dictionary).map(([key, value]) => [
        normalizeKey(key),
        value,
      ]),
    ),
  ]),
);

const i18n = new I18n(normalizedTranslations);

i18n.enableFallback = true;
i18n.defaultLocale = DEFAULT_LOCALE;
i18n.locale = getDeviceLanguageCode();

export function setI18nLanguage(languageCode: string) {
  i18n.locale = normalizeLocale(languageCode);
}

export function t(
  key: string,
  options?: Record<string, string | number | boolean | Date>,
) {
  return i18n.t(normalizeKey(key), options);
}
