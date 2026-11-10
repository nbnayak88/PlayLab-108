# HR01 · Game 001 — Core HR Decision Sprint

**Template:** PL108-001 (Rapid Fire Quiz, applied scenario edition)  
**Stream:** HR01 · AWF Foundations & Core HR  
**Status:** Implemented prototype; expert and browser validation pending  
**Duration limit:** 5 minutes · **Decisions:** 10 · **Pass threshold:** 8 correct · **Score:** 10 per correct decision, maximum 100

## Business challenge

You are a Core HR solution architect. A fictional enterprise is establishing organizational data, permissions, effective-dated employee records, workflows and integration controls. Make ten defensible implementation decisions. Each decision immediately reveals the recommended action and its rationale.

Unlike the original generic arithmetic prototype, this game requires HR-specific judgment and supplies feedback grounded in Core HR concepts. There are no real employee records or customer-specific details.

## Learning objectives

- Select appropriate foundation objects, positions and job information structures.
- Recognize effective-dating and event-reason implications.
- Apply role-based permissions and approval workflows.
- Identify data-integrity and integration safeguards.
- Explain why a decision is suitable for an HR enterprise context.

## Game mechanics and content boundaries

- **Shared decision engine:** [hr01-decision-sprint.js](../../engines/hr01-decision-sprint.js)
- **Subject scenarios:** [PL108-001.json](../../content-packs/hr01/PL108-001.json)
- **Shared hub:** [index.html](../../index.html)
- **Original canonical registry:** [game-registry.json](../../standards/game-registry.json)
- **Existing 108 HR01 mappings:** [Employee Central Core example](../sap-successfactors-employee-central/README.md)

Ten cases are selected from twelve, shuffled on each attempt. Learners must commit a decision before seeing the recommended solution. The scoring display is derived from correct decisions, not generic round points. Incorrect answers remain reviewable with explanations. The pass condition is eight of ten correct within the time limit.

## Validation gates

1. Confirm all ten decisions can be completed and the score is consistent in-game and in the result.
2. Confirm incorrect decisions cannot be changed after feedback.
3. Confirm restart reshuffles the scenarios and resets progress.
4. Confirm mobile layouts, keyboard navigation and screen-reader feedback.
5. Confirm switching to HR02 does not load HR01-specific cases.
6. Have an SAP SuccessFactors Employee Central subject-matter expert validate configuration nuance against the target release.

**Not yet claimed:** certification readiness, complete 108-game mechanics, LMS gradebook integration, or end-to-end browser QA.

*SuccessLabs Academy — Architecting Experiences for a Better World.*
