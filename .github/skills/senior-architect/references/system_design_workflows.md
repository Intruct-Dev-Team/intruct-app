System Design Workflows

## Overview

This reference guide provides comprehensive information for senior architects.

Goal: turn ambiguous requirements into a design that is testable, secure, and maintainable.

## Workflow (recommended)

1. Scope and constraints

   - Identify the primary user journey and success metrics.
   - Write explicit non-goals.
   - Capture constraints: latency/availability targets, cost, compliance, team skills.

2. Thin slice first

   - Define the smallest end-to-end flow that proves the architecture.
   - Prefer incremental complexity: auth -> CRUD -> async jobs -> caching.

3. Boundary contracts

   - Make interfaces explicit: API, data store, external integrations.
   - Define error shapes (don’t throw across boundaries).
   - Version public schemas.

4. Failure and recovery

   - Enumerate failure modes (timeouts, retries, partial failure).
   - Make handlers idempotent (request IDs, dedupe keys).
   - Use bounded retries with backoff.

5. Observability

   - Add structured logs with correlation IDs.
   - Define SLOs and dashboards for the thin slice.

6. Review and iterate
   - Capture decisions as ADRs near the code.
   - Validate with a small load test against latency budgets.

## Patterns and Practices

### Pattern 1: Thin-slice architecture

Description: start with a minimal end-to-end slice, then expand by adding one architectural concern at a time.

When to use:

- Requirements are uncertain and you want to reduce rework.
- You need early validation and fast iteration.

Implementation:

```typescript
// illustrative
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export interface FeatureService {
  execute(input: unknown): Promise<Result<{ id: string }>>;
}
```

Benefits:

- De-risks architecture early.
- Keeps diffs small and reviewable.

Trade-offs:

- Early interfaces may need revision as the domain becomes clear.

### Pattern 2: Async offload for slow work

Description: keep user latency stable by moving variable work (third-party calls, heavy processing) to async jobs.

Implementation:

```typescript
// illustrative
export async function enqueueJob(
  name: string,
  payload: unknown
): Promise<void> {
  void name;
  void payload;
}
```

## Guidelines

### Code Organization

- Keep side effects at the edges; keep domain logic pure.
- Prefer clear boundary modules: UI, domain, data access, integrations.

### Performance Considerations

- Define latency budgets per endpoint/user action.
- Avoid N+1 queries; batch where possible.
- Add timeouts and bounded retries for remote calls.

### Security Best Practices

- Validate input at boundaries (API and job consumers).
- Enforce authorization consistently (deny by default).
- Avoid secrets in code; use secret stores.

## Anti-Patterns to Avoid

- Implicit contracts (undocumented response shapes, hidden side effects).
- Infinite retries without backoff/max attempts.

## Tools and Resources

- Mermaid diagrams: quick architecture sketches.
- ADRs: lightweight decision records stored next to code.
- Load testing: k6 (or equivalent) for validating budgets.

## Conclusion

Start small, make boundaries explicit, and design for failure early.# System Design Workflows

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
