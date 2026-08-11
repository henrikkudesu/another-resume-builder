---
name: software-architecture
description: Use when analyzing module boundaries, dependency direction, coupling, and phased architecture refactors across backend and frontend.
---

# Software Architecture Skill

## Objective
Strengthen architecture with clear boundaries and practical refactor sequencing.

## Steps
1. Map layers and dependencies.
2. Detect architectural smells and coupling risks.
3. Propose staged improvements by impact and effort.
4. Define migration safety checks.

## Heuristics
- Keep domain logic independent from transport/framework concerns.
- Keep API entrypoints thin.
- Use explicit contracts between layers.
- Avoid frontend components depending on low-level API details.
- Preserve backward compatibility when possible.

## Deliverable
- Current-state architecture snapshot.
- Ranked issues with impact.
- Stepwise refactor plan and rollback notes.
