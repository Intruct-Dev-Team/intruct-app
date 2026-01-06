# Implementation Plan

- [x] 1. Add `NotificationsProvider` and public hook API

  - Create `contexts/NotificationsContext.tsx` exporting `NotificationsProvider` and `useNotifications()` with `notify()` + `dismiss()`.
  - Implement single-active notification state with safe timer cleanup.
  - No linter relaxations (no `as unknown`, no rule disables). Run `npm run lint`.
  - Requirements: R1 (AC1–AC4), R6 (AC1–AC3), R5 (AC3)

- [x] 2. Implement UI component for notifications

  - Create `components/notifications/NotificationToast.tsx` (Tamagui) with title/message, optional CTA, close button, accessibility labels.
  - Use `useThemeColors()` + Tamagui tokens; do not hardcode hex colors.
  - No linter relaxations. Run `npm run lint`.
  - Requirements: R2 (AC1–AC4), R1 (AC4)

- [x] 3. Add `NotificationsHost` and wire into root layout

  - Create `components/notifications/NotificationsHost.tsx` that renders the active toast (via `@tamagui/portal` / overlay).
  - Modify `app/_layout.tsx` to wrap the tree with `NotificationsProvider` and render `NotificationsHost` inside the existing provider/portal structure.
  - No linter relaxations. Run `npm run lint`.
  - Requirements: R1 (AC1–AC4), R6 (AC2)

- [x] 4. Replace auth-related `Alert.alert` with notifications

  - Modify `contexts/AuthContext.tsx`:
    - On successful login/logout → `success` notification.
    - On auth errors → `error` notification (safe message).
  - Modify `app/(auth)/register.tsx` to replace validation/registration alerts with notifications.
  - No linter relaxations. Run `npm run lint`.
  - Requirements: R3 (AC1–AC2), R5 (AC1–AC3)

- [x] 5. Add course-generation and file-picker notifications

  - Modify `contexts/course-generation-context.tsx`:
    - When generation starts → `info` notification.
    - On createCourse failure → `error` notification.
  - Modify `components/create-course/attach-materials-step.tsx` to replace file picker failure alert with `error` notification.
  - No linter relaxations. Run `npm run lint`.
  - Requirements: R4 (AC1), R5 (AC1–AC3)

- [x] 6. Final verification pass
  - Ensure no remaining `Alert.alert` is used for the covered cases, and that notifications don’t block navigation.
  - Run `npm run lint` and `npx tsc -p tsconfig.json --noEmit`.
  - No linter relaxations.
  - Requirements: R1–R6 (all)
