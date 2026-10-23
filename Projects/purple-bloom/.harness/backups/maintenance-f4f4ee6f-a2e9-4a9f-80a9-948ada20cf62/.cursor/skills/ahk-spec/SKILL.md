---
name: ahk-spec
description: Turn approved use cases or a product request into a linked functional specification.
---

## Provider Delegation Guidance

- Sequential: Delegate to a named custom subagent with /<role-name>, or request that role naturally. Use a dependent role only after the prior result is available.
- Parallel: Launch independent roles in parallel only when their scopes do not overlap. Give each role a distinct deliverable; consolidate every result before making the next shared decision.
- Context Transfer: Give every subagent a self-contained objective, scope, relevant context, restrictions, and output contract.
- Wait For Completion: Wait for a delegated result when the next step depends on it. For background parallel work, wait for all required results before synthesis or implementation.


Locate relevant context with `specs.list`, `specs.search`, and `specs.get`. A functional spec defines the product scope, rules, exclusions, acceptance criteria, decisions, and unresolved questions. It does not select implementation details.

Read [the workflow](resources/workflow.md) and [the template](resources/template.md) before saving.

When based on use cases, reference every approved upstream use case with `sourceUseCases`. Create a `spec` draft in `docs/specs/`, save a coherent draft before approval, validate after every write, and transition only after the user explicitly approves it. A changed approved upstream use case sends this spec to `needs-decision` and derived technical work to `needs-reconciliation`.

Use `feature` or `fix` only where those existing specialized workflows fit. Offer `ahk-spec-tech` only after the functional source is approved.
