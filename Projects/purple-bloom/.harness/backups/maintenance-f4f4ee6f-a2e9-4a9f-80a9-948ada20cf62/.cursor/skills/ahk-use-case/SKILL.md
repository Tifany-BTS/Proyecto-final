---
name: ahk-use-case
description: Define one user-centered use case through an iterative decision tree, then persist it as a reviewable draft.
---

## Provider Delegation Guidance

- Sequential: Delegate to a named custom subagent with /<role-name>, or request that role naturally. Use a dependent role only after the prior result is available.
- Parallel: Launch independent roles in parallel only when their scopes do not overlap. Give each role a distinct deliverable; consolidate every result before making the next shared decision.
- Context Transfer: Give every subagent a self-contained objective, scope, relevant context, restrictions, and output contract.
- Wait For Completion: Wait for a delegated result when the next step depends on it. For background parallel work, wait for all required results before synthesis or implementation.


Start from the user's outcome, actor, and trigger. Ask exactly one decision question at a time. Research independent facts in the project with the available tools before asking the user to decide them.

Read [the workflow](resources/workflow.md) and [the template](resources/template.md) before saving.

Split the request when it contains independent actor-goal-result scenarios. Explain the proposed split and keep linked use cases separately reviewable. Do not choose implementation architecture, libraries, APIs, or a technical design.

Capture preconditions, main flow, alternatives, failures, business rules, boundaries, exclusions, observable outcome, and acceptance criteria. Persist a `use-case` draft with `specs.create`; real use cases are stored in `docs/use-cases/`. Save the first coherent draft before asking for explicit approval. Update it as the conversation refines it, validate after every write, and only transition it to `approved` after direct user approval.

An approved use case can be linked from a functional `spec` through `sourceUseCases`. Offer `ahk-spec` when the user wants scope and requirements derived from approved use cases.
