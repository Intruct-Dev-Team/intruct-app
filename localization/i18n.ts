import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import { translations } from "./translations";

function getDeviceLanguageCode(): string {
  const locales = getLocales();
  const languageCode = locales[0]?.languageCode;
  return languageCode ?? "en";
}

const i18n = new I18n(translations);

i18n.enableFallback = true;
i18n.locale = getDeviceLanguageCode();

export function setI18nLanguage(languageCode: string) {
  i18n.locale = languageCode;
}

export function t(
  key: string,
  options?: Record<string, string | number | boolean | Date>
) {
  return i18n.t(key, options);
}
