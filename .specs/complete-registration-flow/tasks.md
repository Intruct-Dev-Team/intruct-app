# Implementation Plan

- [ ] 1. Add types + API layer methods for profile + complete registration
- _Requirements: Requirement 3 (all), Requirement 4 (API-related ACs)_
- Lint rule: do NOT relax lint rules (no `as unknown`, no disables). Run `npm run lint -- --fix` (or `npm run lint`) after the change.

- [x] 1.1 Add `UserProfile` + `CompleteRegistrationRequest` types

  - Create NEW type(s) matching `user_profile` from `api_requests_structure.md` and request payload for `POST /auth/complete-registration`.
  - Ensure snake_case ↔ camelCase mapping is defined in one place (prefer API layer).
  - _Requirements: Requirement 3 AC2; Requirement 2 AC1_

- [x] 1.2 Add `profileApi.getProfile(token)` for `GET /user/profile`

  - Implement in `services/api.ts` following the existing API-layer pattern.
  - Return typed `UserProfile` on success; surface errors for `401` and network.
  - _Requirements: Requirement 1 AC2; Requirement 4 AC2, AC4_

- [x] 1.3 Add `authApi.completeRegistration(token payload)` for `POST /auth/complete-registration`

  - Implement request payload `{ name, surname, birthdate, avatar }`.
  - Handle `200`/`401`/`422` with typed responses/errors.
  - _Requirements: Requirement 3 AC1, AC2; Requirement 4 AC2, AC3, AC4_

- [ ] 2. Add onboarding route group + Complete Registration screen UI
- _Requirements: Requirement 2 (all), Requirement 4 AC1_
- Lint rule: do NOT relax lint rules (no `as unknown`, no disables). Run `npm run lint -- --fix` (or `npm run lint`) after the change.

- [x] 2.1 Create `app/(onboarding)/_layout.tsx`

  - Add a Stack layout for onboarding screens.
  - _Requirements: Requirement 1 AC1, AC2_

- [x] 2.2 Create `app/(onboarding)/complete-registration.tsx` form

  - Use existing form UI patterns (`AuthInput`, `AuthButton`, SafeArea/KeyboardAvoidingView).
  - Fields: `name`, `surname`, `birthdate` (YYYY-MM-DD), `avatar` (URL string).
  - Disable Confirm until required fields are valid.
  - _Requirements: Requirement 2 AC1; Requirement 4 AC1_

- [x] 2.3 Implement prefill from Google OAuth metadata

  - Prefill from Supabase `user.user_metadata.full_name` and `user.user_metadata.avatar_url` when present.
  - Keep fields editable and do not overwrite user edits.
  - _Requirements: Requirement 2 AC2, AC3_

- [x] 2.4 Wire Confirm → `authApi.completeRegistration` + success routing

  - On success (200): store profile in context/state and proceed to tabs.
  - On 401/422/network: show error state and allow retry.
  - _Requirements: Requirement 3 AC1, AC2; Requirement 4 AC2–AC4; Requirement 1 AC3_

- [ ] 3. Update auth gating logic to include onboarding
- _Requirements: Requirement 1 (all)_
- Lint rule: do NOT relax lint rules (no `as unknown`, no disables). Run `npm run lint -- --fix` (or `npm run lint`) after the change.

- [x] 3.1 Extend `AuthProvider` state: `needsCompleteRegistration` + `profileLoading`

  - Compute these values from `session` state transitions.
  - _Requirements: Requirement 1 AC2_

- [x] 3.2 On session available call `profileApi.getProfile` and decide gate

  - If profile loads successfully → `needsCompleteRegistration=false`.
  - If unauthorized → show auth error + sign out.
  - If error (network/unknown) → show blocking retry state (do not route to tabs).
  - _Requirements: Requirement 1 AC2; Requirement 4 AC2, AC4_

- [x] 3.3 Update routing decision tree for `/(auth)` vs `/(onboarding)` vs `/(tabs)`

  - Ensure user never lands in `/(tabs)` while `needsCompleteRegistration===true`.
  - _Requirements: Requirement 1 AC1–AC3_

- [x] 4. Fix compilation/lint blockers in touched files (only where required)
- _Requirements: supports all (enables shipping)_
- Lint rule: do NOT relax lint rules (no `as unknown`, no disables). Run `npm run lint -- --fix` (or `npm run lint`) after the change.

- [x] 4.1 Ensure TypeScript syntax is valid in files modified by this feature
  - Focus on: `contexts/AuthContext.tsx`, `services/api.ts`, new onboarding files, and any type files you touch.
  - Keep edits minimal and scoped to enabling the new flow.
  - _Requirements: Requirement 1–4 (enabler)_
