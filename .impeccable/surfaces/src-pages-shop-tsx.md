---
version: 1
slug: "src-pages-shop-tsx"
primary_target: "src/pages/Shop.tsx"
related_targets: []
---

Scope: Provider shopping at `#/shop` and `#/shop/:product`, with saved request tracking in Policy hub. Mode: Operate. Ordinary extension of the incumbent ShieldWise app; no new visual world or system change. Parent direction: `.impeccable/surfaces/src-app-tsx.md`. `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json` remain authoritative and unchanged.

Audience/job: SaaS and restaurant owners comparing illustrative insurance options against their gaps and renewal needs, then saving or withdrawing a simulated quote request.

## Direction contract
THESIS: Make provider trade-offs legible against the owner's chosen coverage needs, then provide an explicit, consent-gated demo request step.
OWN-WORLD: Inherit the warm paper, ink outlines, category pastels, Bricolage Grotesque headings and figures, DM Sans UI, pill controls and black navigation spine. Reuse the existing Astryx token bridge and primitives. The blue match summary is an action field; pastel badges and provider monograms retain ink text in both themes. No new global tokens or rules are established here.
STORY: Choose coverage; adjust limits, deductibles and must-haves; inspect fit, price and sample claims trade-offs; compare two or three providers; review payment/start preferences and consent; save a local demo request; track or withdraw it in Policy hub. Sample estimates, grades and claims times are illustrative, not carrier integrations.
FIRST VIEWPORT: Existing shell and product heading, return-to-catalog action and Astryx progress stepper. Needs shows editable coverage requirements alongside a live match/action summary on desktop, stacked on mobile. Compare shows requirements and sorting controls followed by provider rows. Catalog shows coverage cards with gaps, renewal context and sample starting prices.
FORM: Established-world extension. Desktop quote rows distribute identity, coverage and pricing across columns; phones stack them. The comparison drawer preserves a semantic table with horizontal scrolling. Astryx owns responsive Stepper presentation. No shipping raster assets are introduced.

## Implemented behavior
- Best fit sorts available configurations before blocked ones, then selected must-haves met, then annual price. Alternatives sort by price or sample claims time. Full-match filtering and explicit unavailable configurations keep trade-offs visible.
- Compare selection caps at three; the drawer opens with at least two. Only differences filters identical detail rows while retaining provider narratives and caveats.
- Consent defaults off. Pre-submit copy explicitly says the request is simulated. Requests are stored per demo business in local storage, replace the prior request for that product, and can be withdrawn in Policy hub. Nothing is sent, reviewed by an agent or purchased.

## Documentation evidence
Checked `src/pages/Shop.tsx`, `src/data/shop.ts`, the provider styles in `src/index.css`, `src/pages/PolicyHub.tsx`, `src/state.tsx` and routing in `src/App.tsx` against the parent contract, `PRODUCT.md`, `DESIGN.md` and its sidecar.

Inspected supplied browser captures in `.impeccable/review/`: `desktop.png`, `mobile.png`, `needs-desktop.png`, `needs-mobile.png`, `compare-desktop.png`, `compare-mobile.png`, `dark-mobile.png` and `shop-catalog.png`. They evidence the inherited shell, paper surfaces, type pairing, pastel/ink treatments, stacked needs layout, mobile Stepper and horizontally scrollable comparison. Source confirms white match-summary copy and explicit pre-submit/PolicyHub demo truth. This documentation pass does not substitute for an interactive finish review.

Pre-existing drift, left unchanged: the parent surface brief says 22px cards; normative DESIGN.md, its sidecar and incumbent CSS use 28px cards (24px on phones). The Astryx container bridge separately uses 22px. Preserve these authorities; do not promote the discrepancy into a new system rule.
