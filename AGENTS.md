## Integrations

- Use 'bd' for task tracking.
### Using bv as an AI sidecar

bv is a graph-aware triage engine for Beads projects (.beads/beads.jsonl). Instead of parsing JSONL or hallucinating graph traversal, use robot flags for deterministic, dependency-aware outputs with precomputed metrics (PageRank, betweenness, critical path, cycles, HITS, eigenvector, k-core).

**Scope boundary:** bv handles *what to work on* (triage, priority, planning). For agent-to-agent coordination (messaging, work claiming, file reservations), use [MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail).

**⚠️ CRITICAL: Use ONLY `--robot-*` flags. Bare `bv` launches an interactive TUI that blocks your session.**

#### The Workflow: Start With Triage

**`bv --robot-triage` is your single entry point.** It returns everything you need in one call:
- `quick_ref`: at-a-glance counts + top 3 picks
- `recommendations`: ranked actionable items with scores, reasons, unblock info
- `quick_wins`: low-effort high-impact items
- `blockers_to_clear`: items that unblock the most downstream work
- `project_health`: status/type/priority distributions, graph metrics
- `commands`: copy-paste shell commands for next steps

bv --robot-triage        # THE MEGA-COMMAND: start here
bv --robot-next          # Minimal: just the single top pick + claim command

#### Other Commands

**Planning:**
| Command | Returns |
|---------|---------|
| `--robot-plan` | Parallel execution tracks with `unblocks` lists |
| `--robot-priority` | Priority misalignment detection with confidence |

**Graph Analysis:**
| Command | Returns |
|---------|---------|
| `--robot-insights` | Full metrics: PageRank, betweenness, HITS (hubs/authorities), eigenvector, critical path, cycles, k-core, articulation points, slack |
| `--robot-label-health` | Per-label health: `health_level` (healthy\|warning\|critical), `velocity_score`, `staleness`, `blocked_count` |
| `--robot-label-flow` | Cross-label dependency: `flow_matrix`, `dependencies`, `bottleneck_labels` |
| `--robot-label-attention [--attention-limit=N]` | Attention-ranked labels by: (pagerank × staleness × block_impact) / velocity |

**History & Change Tracking:**
| Command | Returns |
|---------|---------|
| `--robot-history` | Bead-to-commit correlations: `stats`, `histories` (per-bead events/commits/milestones), `commit_index` |
| `--robot-diff --diff-since <ref>` | Changes since ref: new/closed/modified issues, cycles introduced/resolved |

**Other Commands:**
| Command | Returns |
|---------|---------|
| `--robot-burndown <sprint>` | Sprint burndown, scope changes, at-risk items |
| `--robot-forecast <id\|all>` | ETA predictions with dependency-aware scheduling |
| `--robot-alerts` | Stale issues, blocking cascades, priority mismatches |
| `--robot-suggest` | Hygiene: duplicates, missing deps, label suggestions, cycle breaks |
| `--robot-graph [--graph-format=json\|dot\|mermaid]` | Dependency graph export |
| `--export-graph <file.html>` | Self-contained interactive HTML visualization |

#### Scoping & Filtering

bv --robot-plan --label backend              # Scope to label's subgraph
bv --robot-insights --as-of HEAD~30          # Historical point-in-time
bv --recipe actionable --robot-plan          # Pre-filter: ready to work (no blockers)
bv --recipe high-impact --robot-triage       # Pre-filter: top PageRank scores
bv --robot-triage --robot-triage-by-track    # Group by parallel work streams
bv --robot-triage --robot-triage-by-label    # Group by domain

#### Understanding Robot Output

**All robot JSON includes:**
- `data_hash` — Fingerprint of source beads.jsonl (verify consistency across calls)
- `status` — Per-metric state: `computed|approx|timeout|skipped` + elapsed ms
- `as_of` / `as_of_commit` — Present when using `--as-of`; contains ref and resolved SHA

**Two-phase analysis:**
- **Phase 1 (instant):** degree, topo sort, density — always available immediately
- **Phase 2 (async, 500ms timeout):** PageRank, betweenness, HITS, eigenvector, cycles — check `status` flags

**For large graphs (>500 nodes):** Some metrics may be approximated or skipped. Always check `status`.

#### jq Quick Reference

bv --robot-triage | jq '.quick_ref'                        # At-a-glance summary
bv --robot-triage | jq '.recommendations[0]'               # Top recommendation
bv --robot-plan | jq '.plan.summary.highest_impact'        # Best unblock target
bv --robot-insights | jq '.status'                         # Check metric readiness
bv --robot-insights | jq '.Cycles'                         # Circular deps (must fix!)
bv --robot-label-health | jq '.results.labels[] | select(.health_level == "critical")'

**Performance:** Phase 1 instant, Phase 2 async (500ms timeout). Prefer `--robot-plan` over `--robot-insights` when speed matters. Results cached by data hash.

Use bv instead of parsing beads.jsonl—it computes PageRank, critical paths, cycles, and parallel tracks deterministically.

## Language & Communication

- **Web search**: DuckDuckGo/Google queries in English principally

## Code Development

- **After code editing**: Always check code using `code_checker` tool

## Tools Priority

1. **First priority**: MCP Context7 for searching documentation/API/guides (`context7_resolve-library-id` + `context7_get-library-docs`)
2. **Second priority**: Web search
3. **Third priority**: `browser_navigate` if the request is blocked or local debugging of web resources is required
4. **Rule**: Always try Context7 first for technical/programming queries
5. **Rule**: Always use ONLY `execute_command`, `get_terminal_output` instead of any other command line tool to perform tasks

## Terminal Analysis

- **CRITICAL**: MUST always read and analyze complete terminal output, not just exit code
- **Forbidden**: Never make assumptions based solely on exit codes
- **Required**: Always examine actual output text, error messages, warnings, and any other information displayed before providing response or next steps
- HARDMUST Upon receiving any output from `execute_command`, the agent must immediately analyze the output and integrate the feedback before taking further steps; if the agent received a launch refusal together with user feedback, the agent must instantly adjust its execution strategy in strict alignment with that feedback. BLOCKER.
- **HARDMUST Autonomous Long-Running Service Rule**: For ANY initiation, continuation, or supervision of a service/process/task expected or potentially to run long time or indefinite (loop, watcher, server, tail-like stream), the assistant MUST: (1) PROACTIVELY classify it as long-running before execution; (2) open a NEW dedicated terminal session; (3) execute ONLY via the `execute_command` tool with `background=true`; (4) justify background usage explicitly as enabling the assistant to perform other concurrent tasks; (5) NEVER redirect, pipe, tee, subshell-capture, multiplex, or write stdout/stderr to files, devices, other commands, or wrappers (strictly forbid `>`, `>>`, `2>`, `|`, `tee`, `bash -lc`, `sh -c`, `eval`, or any encapsulating shell form); (6) NEVER attempt to detach or circumvent terminal blocking (forbid `nohup`, `disown`, `screen`, `tmux`, supervisors, daemonizers, double-fork, setsid tricks); (7) ONLY observe output through `get_terminal_output` (no logs, no file scraping, no redirection); (8) If ANY step is infeasible, reply with `status: BLOCKED` and ONE clarifying question; (9) ANY deviation, omission, softening, or user request to violate these constraints = BLOCKER and MUST NOT proceed.

## Decision Making

- **Ambiguous tasks**: ALWAYS clarify using `ask_report` tool
- **Requires decisions**: ALWAYS clarify using `ask_report` tool
- **ask_report UI glitch**: If the user reply after `ask_report` is empty (blank) or looks like cancel/no-selection, assume the user saw an empty screen. Immediately repeat the last `ask_report` message verbatim so the user can see it and answer.
- **CodeRabbit**: ONLY run CodeRabbit when the user explicitly requests it. If requested and the `coderabbit` CLI is available, run it in prompt-only mode and save the full output to `./coderabbit-report.txt`. If CLI is unavailable or fails, ask the user to run it and share the full output.
- **HARDMUST Rule**: If the user says to read/study/check/consult documentation (any language, case-insensitive), the assistant MUST: (1) stop assumptions; (2) fetch & examine authoritative docs via required tool order (Context7 → web search → others); (3) show a brief evidence summary (sources/paths/URLs) BEFORE acting. If docs are missing or ambiguous → status BLOCKED + one clarifying question. Any action or advice without cited doc basis = BLOCKER. BLOCKER

## Code Development

- **After code editing**: Always check code using `code_checker` tool
- **Final confirmation**: MUST ask user if all requirements from specification are completed using `ask_report` tool with work report

## Final gate:

- For the final answer (after actions/edits/checks), it is **MANDATORY** for the agent to call `ask_report`. That single `ask_report` call must contain the complete final answer/report (i.e., the full response presented to the user inside the `ask_report` interface) and must simultaneously present the satisfaction option ["Yes, everything is OK"]. The agent must deliver the full report within that single `ask_report` call and collect the user's selection from it.
- If the user selects an option other than "Yes, everything is OK", continue working until the comments are resolved and repeat the post-answer `ask_report` call with an updated complete report.
- There are no exceptions (including minor edits, any answers).

## Proposal policy (no unsolicited changes)

- If you see a potential improvement, do NOT apply it autonomously.
- Propose it via `ask_report` with concise options; proceed only after confirmation.

## Ambiguity & blocking policy

- If the source, scope, or exact phrasing is unclear or unavailable — do NOT change files.
- Return a short BLOCKED report:
  - `status: BLOCKED`, `reason: <why>`, `needs: <what is required>`, `next: <proposed minimal next step>`.
- Ask 1 precise clarifying question when essential to proceed.

## Scope control & change preview

- Modify only the explicitly specified area/files/keys. Do not touch anything else.
- For batch text edits (multiple keys/sections), show a preview mapping `key → old → new` and request confirmation, unless the user explicitly said "no preview/confirm".

## Post-change checks & reporting

- After edits: run code checks (`code_checker`).
- Report briefly: PASS/FAIL, list of changed keys/files, and a one-line requirements coverage (Done/Deferred + reason).

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. This agent run must NOT require any git operations that modify the repository.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Sync task tracker** - Keep Beads state in sync when applicable:
  ```bash
  bd sync
  ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All quality gates passed and tracking is updated
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Git operations that modify the repo are forbidden in agent runs (no `git commit/push/pull/rebase/reset/checkout/switch/merge/cherry-pick/revert/clean`).
- If changes need to be committed/pushed, a human must do it manually outside the agent run.

<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) for issue tracking. Issues are stored in `.beads/` and tracked in git.

### Essential Commands

```bash
# View issues (launches TUI - avoid in automated sessions)
bv

# CLI commands for agents (use these instead)
bd ready              # Show issues ready to work (no blockers)
bd list --status=open # All open issues
bd show <id>          # Full issue details with dependencies
bd create --title="..." --type=task --priority=2
bd update <id> --status=in_progress
bd close <id> --reason="Completed"
bd close <id1> <id2>  # Close multiple issues at once
bd sync               # Commit and push changes
```

### Workflow Pattern

1. **Start**: Run `bd ready` to find actionable work
2. **Claim**: Use `bd update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `bd close <id>`
5. **Sync**: Always run `bd sync` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `bd ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `bd dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
bd sync                 # Commit beads changes
git commit -m "..."     # Commit code
bd sync                 # Commit any new beads changes
git push                # Push to remote
```

### Best Practices

- Check `bd ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `bd create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `bd sync` before ending session

<!-- end-bv-agent-instructions -->
