---
name: ahk-spec-tech
description: Turn an approved spec, feature, or fix into a linked evidence-backed technical specification.
---

## Provider Delegation Guidance

- Sequential: Delegate to a named custom subagent with /<role-name>, or request that role naturally. Use a dependent role only after the prior result is available.
- Parallel: Launch independent roles in parallel only when their scopes do not overlap. Give each role a distinct deliverable; consolidate every result before making the next shared decision.
- Context Transfer: Give every subagent a self-contained objective, scope, relevant context, restrictions, and output contract.
- Wait For Completion: Wait for a delegated result when the next step depends on it. For background parallel work, wait for all required results before synthesis or implementation.


Start by locating the approved `spec`, `feature`, or `fix` source. Research the current codebase first. For libraries, frameworks, SDKs, APIs, CLIs, cloud services, versions, configuration, or migration questions, use current primary documentation through Context7 and the configured documentation index.

Read [the workflow](resources/workflow.md) and [the template](resources/template.md) before saving.

Define boundaries, contracts, data flow, alternatives and rationale, compatibility, dependencies, rollout, risks, validation, and implementation phases. Create a `spec-tech` draft in `docs/specs/` with `sourceSpec`, validate after every write, and transition to approved only after explicit user confirmation. A `needs-reconciliation` technical spec cannot guide implementation until reconciled and approved again.
