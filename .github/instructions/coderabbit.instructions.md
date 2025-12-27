---
description: "Baseline norms for using CodeRabbit on src/**/*.py. Procedures, templates, and playbooks live in CodeRabbit skills."
applyTo: "src/**/*.py"
---

# CodeRabbit norms (src/\*_/_.py)

This file contains **norms only** for using CodeRabbit on `src/**/*.py`.
All procedures, templates, and playbooks must live in skills.

## MUST

- Only run CodeRabbit when the user explicitly requests it (the assistant must not invoke it proactively).
- "Prompt-only" means CodeRabbit produces findings/prompts only (no code changes).
- If a CodeRabbit review is required and the `coderabbit` CLI is available in the workspace, run it in prompt-only mode for the relevant scope.
- If the CLI is not available or CodeRabbit fails (rate limit/auth/network), ask the user to run it in prompt-only mode and share the full output.
- Save the full CodeRabbit output (unaltered) to `./.reviews/coderabbit-report.txt` at the repository root once the user provides it.
- If CodeRabbit fails (rate limit/auth/network), stop and request a successful output before proceeding with CodeRabbit-driven fixes.
- Prioritize by severity: **CRITICAL** -> **HIGH** -> **MEDIUM**; typically skip **LOW** style/nit suggestions.
- After saving the report, start applying fixes immediately in priority order.
- Keep fixes minimal and address the root cause.
- Verify after edits (see project checks and tests instructions).

## MUST NOT

- Must not introduce fallbacks, mocks, or stubs into production code.
- Must not change behavior outside the reviewed scope without explicit justification.
- Must not hide errors behind generic messages.

## Skills

- Issue triage matrix + reporting: `../skills/coderabbit-triage/SKILL.md`
- Implementing a single fix safely: `../skills/coderabbit-fix/SKILL.md`

Recommended workflow: triage -> fix.
