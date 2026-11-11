---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

Scope: ShieldWise owner app (all routes in src/). Mode: Operate. Extends the established prototype world (cream paper, ink line, pastel category fields, Bricolage Grotesque + DM Sans) — no world replacement, so no concept-seed roll; the incumbent is the visual authority per user ("keep current, make better UX").

Audience/job: SaaS + restaurant owners checking exposure, coverage, next action. Demo/pitch + user testing.

## Direction contract
THESIS: Risk is a multiplier you can move. Refuses the category default of a static 0–100 gauge with a stats row; every risk number on screen is paired with the action that changes it.
OWN-WORLD: Warm paper ground (#EDE6D6) with ink (#16140F) hairlines, cards #FAF6EC, pastel category fields (pink cyber, yellow interruption, periwinkle liability, sage property/food, orange alert), electric blue #3A4DF7 for primary action and "insurance pays". Bricolage Grotesque for numbers and headings, DM Sans UI. Pill controls, 22px card radius, black sidebar.
STORY: Owner sees "1.6× riskier than similar SaaS companies", understands it's relative not a claim probability, sees which three areas drive it, ticks actions and watches the multiplier fall, checks their policies would actually pay, compares options, leaves with a ranked plan.
FIRST VIEWPORT: Greeting row; left 2/3 the multiplier hero: huge "1.6×" on a peer distribution strip (peer dots, 1.0× typical marker, you, and projected-you after actions) with the three driver categories; right 1/3 "Next best actions" list with multiplier deltas and primary CTA. Persona switcher (SaaS / Restaurant) in top bar.
FORM: established-world extension; rank 1 of 1 (incumbent); seed key: none (extension, not a new world).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Distill pass (2026-11-11)
User asked for a simpler, non-overwhelming app inspired by dub.co, keeping personality. Applied: flush paper sidebar replacing the black slab, account/persona at sidebar foot, top bar/bell/persona toggle removed, single content panel, 1px soft borders, smaller page titles, one-sentence intros. Overview reduced to multiplier, top 3 actions, coverage map (drivers and trend moved to Risk). Coverage merged with the quote catalog. Policies timeline removed, upload moved to a drawer. Shop side cards ("What providers see", "Worth knowing") removed. Learn guides are cream cards with a pastel tab. DESIGN.md "Distilled restraint" section is authoritative for these changes.
