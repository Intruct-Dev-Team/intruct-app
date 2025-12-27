# EAS Workflows

Use this reference for Expo Application Services (EAS) build and submission workflows.

## Typical Profiles

- `development`: debug builds, often with a custom dev client
- `preview`: internal QA builds, close to production settings
- `production`: store-ready builds with signing

## Reproducibility Checklist

- Keep `eas.json` profiles explicit and minimal
- Ensure consistent Node and package manager versions in CI
- Confirm `appVersionSource` and version bump strategy
- Validate credentials handling (do not hardcode secrets)

## Common Failure Modes

- Missing native config after dependency changes (needs `prebuild` or config plugin)
- Mismatched runtime versioning with OTA updates
- Incorrect bundle identifiers / package names per profile
