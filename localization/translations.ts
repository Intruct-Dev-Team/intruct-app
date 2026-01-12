export type TranslationDictionary = Record<string, string>;
export type Translations = Record<string, TranslationDictionary>;

// Keep dictionaries intentionally minimal for now.
// We are scaffolding i18n only; UI is not localized yet.
export const translations: Translations = {
  en: {},
};
