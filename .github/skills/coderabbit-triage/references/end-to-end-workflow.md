# CodeRabbit end-to-end workflow (archived)

This document was previously the standalone skill `coderabbit`.
It is kept here for reference after consolidating to two active skills: `coderabbit-triage` and `coderabbit-fix`.

## When to use

- You want a structured, pre-PR review to catch correctness/security issues early.
- You want to use CodeRabbit output as an input for a focused, minimal-fix workflow.

## Inputs

- Target scope: repo root or a subfolder (e.g. `src/`).
- CodeRabbit output (prompt-only) for triage.

## Process

1. Run CodeRabbit (prompt-only) for the relevant scope.
2. If the review fails (rate limit/auth/network), stop and resolve the failure first.
3. Triage findings with `coderabbit-triage`.
4. Implement fixes with `coderabbit-fix` (one issue at a time).
5. Verify quality gates (project checks, tests).

## Critical prohibitions

- Do not introduce fallbacks, mocks, or stubs in production code.
- Do not “fix” style nits if tooling already covers them.
- Do not broaden the scope beyond the reviewed findings.

## Links

- Norms: `.github/instructions/coderabbit.instructions.md`
- Triage: `.github/skills/coderabbit-triage/SKILL.md`
- Fixing a single issue: `.github/skills/coderabbit-fix/SKILL.md`
