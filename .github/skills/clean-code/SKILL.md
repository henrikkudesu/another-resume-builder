---
name: clean-code
description: Use when refactoring for readability, reducing duplication, simplifying control flow, and improving naming while preserving behavior.
---

# Clean Code Skill

## Objective
Apply small and safe refactors that improve maintainability without changing business behavior.

## Steps
1. Identify readability and maintainability hotspots.
2. Propose minimal behavior-preserving edits.
3. Apply focused changes.
4. Validate with lint/tests when available.

## Heuristics
- Prefer explicit names over abbreviations.
- Keep functions focused on one responsibility.
- Reduce nesting via guard clauses when clearer.
- Extract duplicated logic only when it improves understanding.
- Improve error messages with actionable context.

## Deliverable
- List of issues found.
- Summary of edits applied.
- Validation result and residual risks.
