# Localization (structure only)

This project now has a minimal localization/i18n structure wired in, but nothing in the UI has been translated yet.

## What was added

### 1) i18n engine scaffolding

Files:

- `localization/translations.ts`

  - Holds per-language translation dictionaries.
  - Currently intentionally empty (structure only).

- `localization/i18n.ts`
  - Initializes `i18n-js` with the dictionaries.
  - Uses `expo-localization` to pick a default locale from the device.
  - Exposes:
    - `t(key, options?)`
    - `setI18nLanguage(languageCode)`

Notes:

- `i18n.enableFallback = true` is enabled.
- No screens/components call `t()` yet.

### 2) Global language state (single source of truth)

File:

- `contexts/language-context.tsx`

Exports:

- `LanguageProvider`
- `useLanguage()`

Behavior:

- On app start, the provider loads saved settings via `settingsApi.getSettings()`.
- It validates the language code against an allowlist; if invalid/missing, it falls back to `"en"`.
- It keeps the i18n engine in sync by calling `setI18nLanguage(language)`.
- When `setLanguage(next)` is called:
  - Validates `next`
  - Updates local state
  - Persists via `settingsApi.updateSettings({ language: next })`
  - Updates i18n locale via `setI18nLanguage(next)`

### 3) Root wiring

File:

- `app/_layout.tsx`

The app is wrapped with `<LanguageProvider>` at the root so that any screen can use `useLanguage()` and (later) `t()`.

## How to localize pages later

The intended usage is:

1. Add keys to `localization/translations.ts`

Example:

```ts
// localization/translations.ts
// new
export const translations = {
  en: {
    "settings.title": "Settings",
  },
  ru: {
    "settings.title": "Настройки",
  },
} as const;
```

2. Use `t()` inside screens/components

Example:

```ts
// app/(tabs)/settings.tsx
// illustrative
import { t } from "@/localization/i18n";

// ...
// <Text>{t("settings.title")}</Text>
```

3. Keep language switching via the provider

Any UI that changes language should call:

- `const { setLanguage } = useLanguage();`
- `setLanguage("ru")`

That will:

- persist the setting
- update the i18n locale globally

## Current limitation (intentional)

- No strings have been migrated to `t()` yet.
- This is only the structure + wiring to enable future incremental localization.
