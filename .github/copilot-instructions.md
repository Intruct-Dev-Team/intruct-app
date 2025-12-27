# Copilot instructions (intruct-app)

These rules keep changes in this repo predictable, minimal, and aligned with the current Expo/React Native architecture.

## Quick project context

- Stack: Expo + React Native + TypeScript, Expo Router (file-based routing), Tamagui UI.
- Data: a single API layer in `services/api.ts`, types in `types/`, mock data in `mockdata/`.
- Theming/colors: Tamagui tokens + `useThemeColors` (see `docs/THEMING.md`).

Relevant docs:

- `README.md`, `SETUP.md`
- `docs/CREATE-COURSE.md` (create-course flow)
- `docs/DATA-LAYER.md` (data layer contract)
- `docs/THEMING.md` (how to apply theme colors)
- `docs/EXPO-GO-LIMITATIONS.md` (Expo Go limitations)

## Communication & confirmations

- Always finish work via `ask_report` (final report / question / confirmation) — even for small answers.
- If the task is ambiguous or requires a choice, stop and clarify via `ask_report`.

## Tools & checks

- For terminal commands use `execute_command` and always set `timeout`.
- After code edits always run `code_checker`.
- If changes touch TypeScript/React Native code, also run `npm run lint` (this runs `expo lint`) unless the user asks otherwise.

## Code rules (important)

UI / Tamagui

- Use Tamagui components (`YStack`, `XStack`, `Button`, `Sheet`, etc.) and tokens (`$blue9`, `$gray12`, …).
- Do not hardcode colors or theme values: use `useThemeColors` and tokens (see `docs/THEMING.md`).
- Do not introduce a new design system on top of the existing one (no new fonts/colors/shadows unless explicitly requested).

Navigation / Expo Router

- Follow file-based routing in `app/`.
- Use `useRouter()`/`router.push()` with existing routes; do not invent alternative navigation patterns.

Data / API layer

- Avoid calling `fetch()` directly in UI components unless there is a strong reason.
- Use `services/api.ts` + types from `types/` (see `docs/DATA-LAYER.md`).
- Do not hide errors behind silent fallbacks; show clear loading/empty/error states in UI.

Security

- Do not add keys/secrets to code or to `.github/*`.
- Environment values must go through the project’s env/config approach.

Files & artifacts

- Do not edit generated artifacts (`android/**/build/**`, `node_modules/**`, bundle outputs).
- Do not delete assets/files without explicit user confirmation and a repo-wide reference check.

## Skills (playbooks)

Before any non-trivial work, use 1–2 best-fit playbooks from `.github/skills/` (for example: `react-native-expert`, `expo-react-native-expert`, `ui-designer`).

## CodeRabbit

Run CodeRabbit only when the user explicitly asks. Norms: `.github/instructions/coderabbit.instructions.md`.

## Git rules

- Do not run git commands that change history/index or delete files via git (commit/push/reset/rebase/merge/clean etc.).
- Only read-only git commands are allowed (`git diff`, `git status`, `git log`, `git blame`).
