---
name: write-spec
description: Interactive spec writer — asks targeted questions about technical decisions before generating a spec. Use when the user wants to define or refine a capability spec through conversation, not just description.
license: MIT
metadata:
  author: titico-app
  version: "1.0"
---

Write a spec for a capability through interactive Q&A.

Instead of generating from a description alone, I'll interview you about the key technical decisions first — data model, API shape, lifecycle, security, edge cases — then produce a precise `openspec/specs/<capability>/spec.md`.

---

**Input**: Capability name (kebab-case) or description of what to spec. Examples: `order`, `user-profile`, `video-access`.

**Phase 1 — Identify the capability**

If no input, ask:
> "What capability do you want to spec? Give it a short kebab-case name and a one-sentence description."

Derive the kebab-case name and a short description from user input.

**Phase 2 — Read existing context**

Before asking any questions:
1. Check if `openspec/specs/<capability>/spec.md` already exists — read it if so
2. Read `openspec/specs/` to understand adjacent capabilities (foreign keys, shared enums)
3. Read `prisma/schema.prisma` to understand current data models
4. Read relevant API route files in `src/app/api/` if they exist

Use this context to **skip questions whose answers are already determined by existing code or specs**. Only ask about genuine open decisions.

**Phase 3 — Technical interview**

Ask questions in batches of 2–3 using **AskUserQuestion**. Cover these decision areas (skip any that are already clear from context):

**Batch 1 — Data model**
- What are the core fields of the main entity? (types, required vs optional, constraints)
- Are there child/related entities? (1:N, M:N relations)
- What unique constraints or indexes does it need?

**Batch 2 — Lifecycle & status**
- Does the entity have a status or lifecycle? What are the states and valid transitions?
- What triggers each transition (user action, webhook, cron, etc.)?

**Batch 3 — API surface**
- What HTTP methods/endpoints are needed?
- Who can call each endpoint? (public, authenticated user, admin only)
- What does the request body look like for mutations?

**Batch 4 — Business rules & edge cases**
- What are the failure cases and expected error responses?
- Are there idempotency requirements?
- Any security constraints beyond standard auth? (ownership checks, rate limits, etc.)

**Batch 5 — Integration points**
- Does this capability depend on or trigger behavior in other capabilities?
- Any external services (Stripe, email, etc.) involved?

**Rules for asking questions:**
- Group related decisions into a single AskUserQuestion call (2–3 questions max per call)
- Offer concrete options with trade-offs described — don't make the user write free-form answers unless the answer is truly open-ended
- If a decision is obvious from context (e.g., schema already has the field), skip the question and note the assumption
- After each batch, briefly summarize what was decided before moving to the next

**Phase 4 — Confirm decisions**

Before writing, output a compact decision summary:

```
## Decisions confirmed

**Entity:** <name>
**Fields:** <list key fields with types>
**Relations:** <list relations>
**Status lifecycle:** <states> or "none"
**Endpoints:** <method + path list>
**Auth:** <rules per endpoint>
**Key business rules:** <bullet list>
**Error cases:** <bullet list>
**External deps:** <list or "none">
```

Ask: "Looks good? Anything to adjust before I write the spec?"

Wait for confirmation or corrections before proceeding.

**Phase 5 — Write the spec**

Determine whether this is a new or modified capability:
- **New**: write to `openspec/specs/<capability>/spec.md` directly
- **Existing**: update the spec in-place, preserving existing requirements and adding/modifying as needed

Spec format rules:
- Use `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements` sections
- Each requirement: `### Requirement: <name>` + description
- Each scenario: `#### Scenario: <name>` with `**WHEN** ... / **THEN** ...` format (exactly 4 `#`)
- Use MUST/SHALL for normative statements
- Every requirement needs at least one scenario

After writing, run:
```bash
openspec status
```

**Output**

Summarize:
- Spec written to `openspec/specs/<capability>/spec.md`
- List of requirements added/modified
- "Run `/opsx:propose` to create a change that implements this spec."
