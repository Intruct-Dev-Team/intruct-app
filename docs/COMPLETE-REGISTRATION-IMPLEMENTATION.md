# Complete Registration — Implementation Notes

## What this adds

This implementation introduces an onboarding step that blocks access to the main app until the user completes their profile (name, surname, birthdate, avatar).

High-level flow:

1. User signs in / signs up (Supabase session exists)
2. App checks whether the user profile exists (`GET /user/profile` via the API layer)
   1. If profile is missing → route to `/(onboarding)/complete-registration`
3. User submits the form → `POST /auth/complete-registration`
4. On success → route to `/(tabs)`

## Routing & gating

### Route group

- Onboarding route group: [app/(onboarding)/\_layout.tsx](<../app/(onboarding)/_layout.tsx>)
  - Uses an Expo Router `Stack` with `headerShown: false`.

### Gate logic

- Auth + routing gate is handled in [contexts/AuthContext.tsx](../contexts/AuthContext.tsx)

Key pieces:

- When `session.access_token` is available, AuthProvider calls `profileApi.getProfile(token)`.
- The result updates two flags:
  - `profileLoading`: prevents auto-routing to tabs while the profile status is still being resolved.
  - `needsCompleteRegistration`: whether the user must complete onboarding.

Routing decisions:

- No user → route to `/(auth)/welcome`
- User + `needsCompleteRegistration === true` → route to `/(onboarding)/complete-registration`
- User + `needsCompleteRegistration === false` → route to `/(tabs)`

## Complete registration screen

- Screen: [app/(onboarding)/complete-registration.tsx](<../app/(onboarding)/complete-registration.tsx>)

UI:

- Avatar picker is shown at the top with a large preview.
- Fields:
  - `name`
  - `surname`
  - `birthdate` (format `YYYY-MM-DD`, chosen via 3 native selects: year/month/day)
- Confirm button is disabled until required fields are valid.

Prefill:

- `user.user_metadata.full_name` → splits into `name` and `surname`
- `user.user_metadata.avatar_url` → pre-fills avatar
- Prefill does not overwrite the user’s edits.

Avatar selection:

- Uses `expo-document-picker` to pick an `image/*` and stores the selected `uri` string in local state.
- Important: the backend contract currently expects `avatar` as a string.
  - Right now we send the `uri` string as `avatar`.
  - For a real backend, this will likely change to a two-step process:
    1. upload image to storage and get a URL/key
    2. send that URL/key in `POST /auth/complete-registration`

Submit:

- Temporary (testing): On Confirm, the screen does not call `authApi.completeRegistration(...)`.
- It immediately clears `needsCompleteRegistration` in context to avoid redirect loops and routes to `/(tabs)`.

Error handling:

- If the session token is missing/expired → toast, `signOut()`, route to `/(auth)/welcome`

## API layer (mock vs real)

API is implemented in [services/api.ts](../services/api.ts).

### Dual-mode behavior

The API layer works in two modes:

1. Real backend mode

- Enabled when `process.env.EXPO_PUBLIC_API_BASE_URL` is set.
- Uses `fetch()` with `Authorization: Bearer <token>`.
- Endpoints:
  - `GET /user/profile` → returns `user_profile`
  - `POST /auth/complete-registration` → returns `user_profile`

1. Mock mode (default in this repo right now)

- Used when `EXPO_PUBLIC_API_BASE_URL` is not set.
- Persists a mock profile in AsyncStorage under the key `intruct.userProfile`.
- Behavior:
  - `profileApi.getProfile()` reads from storage; if missing → treated as needs onboarding
  - `authApi.completeRegistration()` writes a profile to storage so `getProfile()` succeeds afterward

### Error model

- API errors are surfaced as `ApiError` with:
  - `status` (HTTP status, or 0 for network)
  - `code` (one of: `unauthorized`, `needs_complete_registration`, `validation`, `network`, `unknown`)

### Snake_case → camelCase mapping

- Backend responses are modeled as `UserProfileResponse` (snake_case)
- UI uses `UserProfile` (camelCase)
- Mapping is done in `mapUserProfile()` inside the API layer, so UI never touches snake_case.

## Notes for later backend migration

When moving from mock → real backend:

- Set `EXPO_PUBLIC_API_BASE_URL` in `.env`.
- Decide the final avatar strategy:
  - keep `avatar` as URL string only, or
  - add an upload endpoint / storage integration.
- Keep the `ApiError` contract stable so the gating logic does not need to change.
