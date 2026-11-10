# HR01 — Batch 01 Quality Gate (PL108-001–009)

**Status: IN PROGRESS / NOT RELEASE-CERTIFIED**

## What has been delivered

1. A 9-game HR01 batch contract in [qa/hr01-batch-01.test.cjs](../../qa/hr01-batch-01.test.cjs), executed by the GitHub Pages workflow.
2. Automated static checks: unique and complete scenario answers, canonical IDs, dedicated handler registration, script inclusion, HR01 dispatch and the correct community CTA.
3. Generic HR01 placeholders outside the current development batch are **disabled** in the catalog rather than misleading learners with unrelated arithmetic, number puzzles or icons.
4. Games 001–009 remain available as **QA-pending prototypes**, not validated enterprise training.
5. PL108-107 remains separately accessible as the contextual workforce break-even prototype.

## Critical defects to resolve before Batch 01 release

| ID | Intended mechanic | Current concern | Required acceptance |
|---|---|---|---|
| 001 | Rapid Fire Quiz | Scenario feedback works; time limit and browser QA unverified | Ten decisions, 8/10 threshold, identical HUD/final score |
| 002 | Millionaire Challenge | Lifeline not implemented | Genuine 50:50, tiered rewards, immediate loss, restart |
| 003 | Jeopardy Board | Categories not persistently tracked | Selectable clue board, spent tiles locked, score correct |
| 004 | Quiz Wheel | No actual random wheel mechanics | Random sector selection, visible spin and sector-specific content |
| 005 | True-or-False Blitz | Correctness determined by round parity | Scenario-backed truth claims and validated explanations |
| 006 | Last Learner Standing | Simplified lives mechanic | Three-life elimination, round-end controls, no extra scoring |
| 007 | Risk Your Points | Double-counts correct wagers in score | Stake deducted/awarded exactly once; no exploit |
| 008 | Trivia Bingo | Three-correct streak instead of bingo | Real 3×3 board, marks, row/column/diagonal validation |
| 009 | Quiz Boss Battle | Boss health and win state not fully aligned | Visible risk HP, damage, failure and victory rules |

## Five release gates

- **G1 Business relevance:** Every decision maps to a Core HR capability and has a defensible rationale.
- **G2 Mechanics fidelity:** Gameplay matches the named game.
- **G3 Logical integrity:** Exactly one correct response for single-choice prompts, deterministic finish states.
- **G4 Functional integrity:** Complete, fail, restart, timeout, scoring and browser/mobile behavior tested.
- **G5 Experience:** Accessibility, responsive design, brand, free-community CTA.

**No game is considered approved until all five pass.** Static CI passing alone is insufficient.

## Execution

`node qa/hr01-batch-01.test.cjs` generates `qa/reports/hr01-batch-01.json` during the CI job. This is an ephemeral build report unless uploaded as an artifact or committed; do not treat the repository as containing a current report until verified.

**Live site:** https://nbnayak88.github.io/PlayLab-108/  
**CTA:** https://hub.successlabsacademy.com/web/checkout/694af8798dd872a219700dd3

*SuccessLabs Academy · Architecting Experiences for a Better World.*
