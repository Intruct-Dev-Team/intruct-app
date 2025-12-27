# Expo Updates (OTA)

Use this reference for safe OTA update setup and release discipline.

## Key Concepts

- OTA updates must match the correct `runtimeVersion`
- Use channels/branches to control rollout (e.g., `preview`, `production`)
- Plan rollback strategies and monitoring

## Safety Checklist

- Lock down `runtimeVersion` strategy (do not change casually)
- Ensure updates do not introduce new native requirements
- Test updates on both platforms with release-like builds

## Common Pitfalls

- Publishing an update that requires a new native dependency
- Inconsistent `runtimeVersion` between builds and updates
- Missing guardrails for staged rollouts
