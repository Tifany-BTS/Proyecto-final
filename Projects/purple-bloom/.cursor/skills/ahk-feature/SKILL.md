---
name: ahk-feature
description: Turn an idea or Jira request into a reviewable, evidence-backed feature specification.
---

## Provider Delegation Guidance

- Sequential: Delegate to a named custom subagent with /<role-name>, or request that role naturally. Use a dependent role only after the prior result is available.
- Parallel: Launch independent roles in parallel only when their scopes do not overlap. Give each role a distinct deliverable; consolidate every result before making the next shared decision.
- Context Transfer: Give every subagent a self-contained objective, scope, relevant context, restrictions, and output contract.
- Wait For Completion: Wait for a delegated result when the next step depends on it. For background parallel work, wait for all required results before synthesis or implementation.


## Purpose

Read [the feature workflow](resources/feature-workflow.md) before discovery and [the feature template](resources/feature-template.md) before saving.

## Persistence and handoff

After the required questions and project evidence produce a complete first synthesis, create or update a `feature` draft with structured specification MCP tools. Use `specs.list` and `specs.search` to find related context, `specs.get` to read it, and `specs.validate` after every write. Keep drafts reviewable and editable through MCP; transition to `approved` only after explicit user confirmation.

Do not choose an implementation design. Offer `ahk-spec-tech` only after this feature is approved and the user asks for technical design.
