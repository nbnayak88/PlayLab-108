# SuccessLabs PlayLab 108

**108 universal game templates · 12 HR learning streams · 5–30-minute game sessions**

**Mission:** Architecting Experiences for a Better World.

PlayLab 108 separates universal gameplay mechanics from interchangeable learning content. A template is not tied to any product, industry, sector, vendor or curriculum. The currently shipped HTML is a **prototype of 12 family-level mechanics**, not 108 independently finished game implementations.

## 🎮 Branded interactive hub

- [Open PlayLab HTML source](index.html)
- [12 HR game content packs](content-packs/hr/manifest.json)
- [108 canonical game definitions](standards/game-registry.json)
- [Universal master standard](standards/PLAYLAB-108-MASTER.md)
- [Automated validation & GitHub Pages deployment workflow](.github/workflows/pages.yml)

**GitHub Pages target (after GitHub Pages is enabled and deployment succeeds):** `https://nbnayak88.github.io/PlayLab-108/`. A committed workflow does not prove the site is live.

## 12 HR streams

[Complete 12-stream table and implementation status](examples/hr-streams/README.md)

| ID | Academy HR learning stream | Source |
|---|---|---|
| HR01 | AWF Foundations & Core HR | [Employee Central Core example](examples/sap-successfactors-employee-central/README.md) |
| HR02 | Talent Acquisition | [108-game mapping](examples/hr-streams/hr02-talent-acquisition/README.md) |
| HR03 | High Performance Organization | [108-game mapping](examples/hr-streams/hr03-high-performance-organization/README.md) |
| HR04 | Growth & Leadership | [108-game mapping](examples/hr-streams/hr04-growth-leadership/README.md) |
| HR05 | Rewards & Performance | [108-game mapping](examples/hr-streams/hr05-rewards-performance/README.md) |
| HR06 | Learning & Mobility | [108-game mapping](examples/hr-streams/hr06-learning-mobility/README.md) |
| HR07 | Payroll Enterprises | [Employee Central Payroll example](examples/sap-successfactors-employee-central-payroll/README.md) |
| HR08 | Time & Operations | [108-game mapping](examples/hr-streams/hr08-time-operations/README.md) |
| HR09 | Workforce Intelligence | [108-game mapping](examples/hr-streams/hr09-workforce-intelligence/README.md) |
| HR10 | Digital Employee Experience | [108-game mapping](examples/hr-streams/hr10-digital-experience/README.md) |
| HR11 | AI-Powered HR | [Joule Studio example](examples/sap-joule-studio/README.md) |
| HR12 | Connected HR | [108-game mapping](examples/hr-streams/hr12-connected-hr/README.md) |

## Brand and platform contract

Comfortaa font, bright two-color gradient, responsive layout, sticky header and footer, right-side SLA text-mark fallback, lower of two header progress tracks, and A/V/G/I (Affirmation, Visualization, Gratitude, Intention) footer.

The approved brand logo image is **not yet bundled**; the HTML currently uses a labeled SLA text mark rather than claiming the official logo asset has been installed.

The hub reads one 108-game registry; the HR content changes in `hr-packs.js`. Separate JSON packs reside in `content-packs/hr/`. Game mechanics must remain product-neutral. Work to externalize every game instance into individually validated pack files is still ongoing.

## Delivery status

- **Published to GitHub:** Master specification, 108-entry registry, 12 HR content packs and 12 corresponding 108-game mappings (three earlier specifications preserved).
- **Prototype:** HTML hub and 12 shared game-family loops with stream switching, scoring, restart and local completion tracking.
- **Not complete:** 108 distinct playable production-quality engines, expert-validated content for all scenarios, browser/mobile test execution, verified certification and confirmed live GitHub Pages deployment.
- **Security:** Fictional learner scenarios only. Never commit PII or credentials. SAP product usage remains subject to official licensing and documentation.

*SuccessLabs Academy is not affiliated with or endorsed by SAP.*
