# Implementation Plan

- [x] 1. Update TypeScript data contracts to remove flash cards

  - Modify `types/index.ts`:
    - Remove `Lesson.flashcards` field
    - Remove exported `Flashcard` interface
  - Ensure all remaining references fail fast at compile time (no silent fallbacks).
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). Run `npm run lint`. If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R2.AC1, R2.AC2, R2.AC3_

- [x] 2. Remove flash cards from mock data

  - Modify `mockdata/courses.ts` to remove `flashcards: [...]` from every lesson.
  - Keep the rest of the mock structure intact (materials/tests remain).
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). Run `npm run lint`. If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R1.AC1, R1.AC2_

- [x] 3. Remove flash cards phase and UI usage from lesson screen

  - Modify `app/course/lesson/[id].tsx`:
    - Remove `FlashcardView` import and render branch
    - Remove `"flashcards"` from `LessonPhase` and all state/transitions related to it
    - Update progress calculation to exclude flash cards
    - Update any button labels that mention Flashcards
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). Run `npm run lint`. If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R3.AC1, R3.AC2, R3.AC3, R5.AC1_

- [x] 4. Keep `FlashcardView` file but decouple it from removed exported types

  - Modify `components/lesson/FlashcardView.tsx`:
    - Remove `import type { Flashcard } from "@/types"`
    - Replace with a local, non-exported `FlashcardItem` type for props
  - Ensure the component compiles even if unused.
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). Run `npm run lint`. If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R5.AC1, R2.AC1, R2.AC3_

- [x] 5. Remove remaining user-facing mentions of flash cards in UI copy

  - Modify `components/create-course/review-step.tsx` to remove “flashcards” wording.
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). Run `npm run lint`. If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R3.AC1_

- [x] 6. Remove flash cards API surface if present

  - Search within `services/` for flash-card-related methods; if present, remove them and update callers.
  - Confirm `services/api.ts` has no flash-card calls remaining.
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). Run `npm run lint`. If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R4.AC1, R4.AC2_

- [x] 7. Repo-wide cleanup and verification

  - Run a repo-wide search for `flashcards`, `flashcard`, and `Flashcard` and remove remaining references that are part of active functionality.
  - Run `code_checker` to confirm no TypeScript diagnostics.
  - Run `npm run lint`.
  - Lint rules MUST NOT be relaxed (no `as unknown`, no `any`, no eslint-disable). If autofix is required, use `npx eslint . --fix`.
  - _Requirements: R6.AC1, R6.AC2, R1.AC3, R2.AC3_
