# Implementation Plan

- [x] 1. Add i18n scaffolding (no screen localization yet)

  - Install dependencies: `npx expo install expo-localization` and `npm i i18n-js`.
  - Create `localization/translations.ts` (NEW) to hold dictionaries.
  - Create `localization/i18n.ts` (NEW) that initializes `i18n-js`, enables fallback, and exports `t()` + `setI18nLanguage(languageCode)`.
  - Ensure `t()` is NOT used in any UI yet (structure only).
  - Strict: do NOT relax lint rules (no `as unknown`, no `eslint-disable`). Run `npm run lint` (and add/enable a `lint:fix` script if the repo expects it).
  - _Requirements: R1, R4_

- [x] 2. Add `LanguageProvider` + `useLanguage()` (core structure)

  - Create `contexts/language-context.tsx` (NEW) with `LanguageProvider` and `useLanguage()`.
  - Read initial language from `settingsApi.getSettings()`.
  - On language resolved, call `setI18nLanguage(language)` to keep i18n in sync.
  - Expose `setLanguage(next)` that updates local state, calls `setI18nLanguage(next)`, and persists via `settingsApi.updateSettings({ language: next })`.
  - Validate language codes against existing `languageOptions` (fallback to default on invalid).
  - Strict: do NOT relax lint rules (no `as unknown`, no `eslint-disable`). Run `npm run lint` (and add/enable a `lint:fix` script if the repo expects it).
  - _Requirements: R1, R2, R3, R4_

- [x] 3. Wire `LanguageProvider` into the app root

  - Update `app/_layout.tsx` to wrap the app with `LanguageProvider` (near `ThemeProvider`).
  - Ensure provider load state is handled consistently (either provider returns `null` until loaded or root waits).
  - Strict: do NOT relax lint rules (no `as unknown`, no `eslint-disable`). Run `npm run lint` (and add/enable a `lint:fix` script if the repo expects it).
  - _Requirements: R3, R4_

- [x] 4. Connect Settings “App Language” to the provider

  - Update `app/(tabs)/settings.tsx` so the “Language” row reads from `useLanguage()`.
  - On selection in `LanguageModal`, call provider `setLanguage(code)` for the UI language target.
  - Keep “Content Language” behavior unchanged (still uses `defaultCourseLanguage` via `settingsApi`) unless explicitly requested.
  - Strict: do NOT relax lint rules (no `as unknown`, no `eslint-disable`). Run `npm run lint` (and add/enable a `lint:fix` script if the repo expects it).
  - _Requirements: R2, R3, R4_

- [x] 5. Add developer documentation for later localization

  - Create `docs/LOCALIZATION.md` describing:
    - What `LanguageProvider` stores and how to switch language.
    - What `t()` does and where dictionaries live.
    - How to later add real translations (library choice, where translation dictionaries live, how to replace hardcoded strings progressively).
    - How to add a new locale/code and keep Settings options consistent.
  - Strict: do NOT relax lint rules (no `as unknown`, no `eslint-disable`). Run `npm run lint` (and add/enable a `lint:fix` script if the repo expects it).
  - _Requirements: R5_

- [x] 6. Verification (typecheck/lint)
  - Run `code_checker` in VS Code after edits.
  - Run `npm run lint` (and if fix mode is required by workflow, introduce/enable `npm run lint:fix` in scripts).
  - Strict: do NOT relax lint rules (no `as unknown`, no `eslint-disable`).
  - _Requirements: R1, R2, R3, R4, R5_
