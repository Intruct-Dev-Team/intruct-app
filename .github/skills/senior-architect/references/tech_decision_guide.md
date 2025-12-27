Tech Decision Guide

## Overview

This guide is for senior architects. It provides a lightweight, repeatable way to make technical decisions with clear trade-offs, explicit constraints, and a record the team can maintain.

Use it when you must choose an approach (library, architecture pattern, data store, API contract) and want decisions to be easy to review and revisit.

## Decision Workflow

1. Define the decision

   - One sentence: “We will choose X to achieve Y under constraints Z.”

2. Capture context

   - Drivers: security, performance, DX, cost, compliance, timeline.
   - Constraints: platforms, existing stack, operational maturity.

3. Enumerate options

   - Keep it to 2–4 options.
   - Include “do nothing” if applicable.

4. Evaluate trade-offs

   - What gets better?
   - What gets worse?
   - What becomes harder to change later?

5. Decide and record
   - Write an ADR (Architecture Decision Record) next to the code.
   - Include “revisit criteria” (when we should change our mind).

## Patterns and Practices

### Pattern 1: ADRs for durable decisions

Description: keep an ongoing record of why we chose an approach.

When to use:

- Selecting a new dependency or framework.
- Changing a public API shape.
- Introducing infra that affects operations.

Implementation (ADR skeleton):

```markdown
<!-- illustrative -->

# ADR: <short title>

## Status

Proposed | Accepted | Superseded

## Context

<what problem we are solving and constraints>

## Decision

<what we chose>

## Consequences

<trade-offs, costs, risks>

## Alternatives Considered

<short list>
```

Benefits:

- Reviewable history.
- Faster onboarding.

Trade-offs:

- Requires discipline to keep short and current.

### Pattern 2: Interface-first design

Description: decide the contract before internal implementation to reduce churn.

When to use:

- Teams work in parallel.
- Public APIs and integrations.

Implementation:

```typescript
// illustrative
export type ApiError = { code: string; message: string };
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
```

## Guidelines

### Code Organization

- Prefer “edges” for I/O: network, storage, device APIs.
- Keep domain logic deterministic and testable.

### Performance

- Define budgets (startup time, navigation latency, API latency).
- Avoid uncontrolled re-renders in UI layers.
- Use caching only with explicit invalidation rules.

### Security

- Validate inputs at trust boundaries.
- Keep secrets out of the repo.
- Prefer least-privilege permissions and deny-by-default authorization.

## Common Decision Areas

### Dependency choice

Ask:

- What’s the maintenance status and community health?
- Can we remove it later without a rewrite?

### Data persistence

Ask:

- What’s the failure mode (corruption, partial writes)?
- What consistency guarantees are required?

## Anti-Patterns to Avoid

- Decision by inertia (no explicit choice, no written rationale).
- Over-optimizing early without budgets/measurements.
- Hidden coupling (shared mutable globals, undocumented side effects).

## Tools and Resources

- ADR format: simple markdown records stored with the code.
- Mermaid: diagrams for architecture and flows.
- Load testing: k6 (or equivalent) for validating budgets.

## Conclusion

Make decisions explicit, keep the record short, and define revisit triggers.# Tech Decision Guide

## Overview

This reference guide provides comprehensive information for senior architect.

## Patterns and Practices

### Pattern 1: Best Practice Implementation

**Description:**
Detailed explanation of the pattern.

**When to Use:**

- Scenario 1
- Scenario 2
- Scenario 3

**Implementation:**

```typescript
// Example code implementation
export class Example {
  // Implementation details
}
```

**Benefits:**

- Benefit 1
- Benefit 2
- Benefit 3

**Trade-offs:**

- Consider 1
- Consider 2
- Consider 3

### Pattern 2: Advanced Technique

**Description:**
Another important pattern for senior architect.

**Implementation:**

```typescript
// Advanced example
async function advancedExample() {
  // Code here
}
```

## Guidelines

### Code Organization

- Clear structure
- Logical separation
- Consistent naming
- Proper documentation

### Performance Considerations

- Optimization strategies
- Bottleneck identification
- Monitoring approaches
- Scaling techniques

### Security Best Practices

- Input validation
- Authentication
- Authorization
- Data protection

## Common Patterns

### Pattern A

Implementation details and examples.

### Pattern B

Implementation details and examples.

### Pattern C

Implementation details and examples.

## Anti-Patterns to Avoid

### Anti-Pattern 1

What not to do and why.

### Anti-Pattern 2

What not to do and why.

## Tools and Resources

### Recommended Tools

- Tool 1: Purpose
- Tool 2: Purpose
- Tool 3: Purpose

### Further Reading

- Resource 1
- Resource 2
- Resource 3

## Conclusion

Key takeaways for using this reference guide effectively.
