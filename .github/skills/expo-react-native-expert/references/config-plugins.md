# Expo Config Plugins

Use this reference when a feature requires native changes while staying Expo-first.

## Guidance

- Prefer existing community plugins when stable and widely used
- If a custom plugin is needed, keep it minimal and deterministic
- Avoid manual edits in `ios/` and `android/` for managed workflows

## Decision Tree

1. Works in Expo Go: no native changes needed
2. Needs native modules: use config plugin + custom dev client
3. Heavy native customization: consider `prebuild` and own the native projects

## Verification

- Regenerate native projects when required
- Confirm changes appear in the generated native files
- Test on device (simulators can hide permission issues)
