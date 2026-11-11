---
name: ShieldWise
description: Smarter insurance for stronger businesses. A neutral risk advisor and policy hub for small business owners.
colors:
  paper: "#ede6d6"
  card: "#faf6ec"
  well: "#f3eddd"
  ink: "#16140f"
  muted-ink: "#625d51"
  hairline: "rgba(22, 20, 15, 0.10)"
  border: "rgba(22, 20, 15, 0.13)"
  border-strong: "rgba(22, 20, 15, 0.42)"
  surface: "#f6f1e5"
  track: "#e4dbc6"
  sidebar-black: "#100f0b"
  sidebar-text: "#cfc9ba"
  electric-blue: "#3a4df7"
  blue-ink: "#2433c9"
  highlighter-yellow: "#f7dc6a"
  blush-pink: "#f3b6d3"
  periwinkle: "#bac6f7"
  sage: "#c4e2b6"
  lilac: "#dcc8f2"
  alert-orange: "#ef6b2c"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(88px, 10vw, 148px)"
    fontWeight: 600
    lineHeight: 0.8
    letterSpacing: "-0.06em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(34px, 4.2vw, 56px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  body:
    fontFamily: "DM Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "ss01"
  body-sm:
    fontFamily: "DM Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "12.5px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  pill: "999px"
  page: "26px"
  card: "22px"
  card-compact: "20px"
  popover: "22px"
  well: "16px"
  term: "16px"
  tile: "14px"
  mark: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  xxl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-blue:
    backgroundColor: "{colors.electric-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  well-row:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.well}"
    padding: "12px 16px 12px 12px"
  pill-tag:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "46px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  nav-item-active:
    backgroundColor: "{colors.highlighter-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  segmented-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.pill}"
    height: "38px"
  actions-card:
    backgroundColor: "{colors.electric-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "24px"
  renewal-banner:
    backgroundColor: "{colors.highlighter-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 18px 16px 16px"
---

# Design System: ShieldWise

## Overview

**Creative North Star: "The Marked-Up Ledger"**

ShieldWise reads like a well-kept paper ledger that someone has gone over with a felt pen and a set of highlighters. The ground is warm cream paper; every card and control is drawn with a confident ink outline; pastel fields mark which risk you are looking at; one electric blue says what insurance pays and what you can do. The black sidebar is the binder spine that holds it together.

Density is moderate and calm: large rounded cards on an 18px rhythm, generous internal padding, one huge Bricolage numeral per hero, and short plain-English copy in DM Sans. Numbers are the protagonists and are always set in the display face. Depth comes from ink lines and three tonal paper steps, not from shadows.

The world is inherited from the original ShieldWise prototype and extended, not replaced. It ships light and dark themes from the same token names.

**Key Characteristics:**
- Cream paper ground, cream cards, darker cream wells: three tonal steps of the same paper.
- 1.5px ink outlines on every card and outer control; hairlines only inside.
- Everything interactive is a full pill; every container is a large rounded rectangle.
- Pastel fields identify risk categories; text on a pastel is always ink.
- Electric blue is reserved for coverage, the action field, and focus.
- Bricolage Grotesque for every number and heading, tight negative tracking, tabular figures.

## Colors

Warm paper and ink with a small box of highlighters and a single electric blue.

### Primary
- **Electric Blue** (`electric-blue`): what insurance pays and what you can do. It fills coverage bars, fills the "Lower your number" action card, draws the focus ring, and appears as the rare `button-blue` CTA. In dark mode it lifts to a lighter periwinkle-blue under the same token.
- **Blue Ink** (`blue-ink`): the darker companion for blue text on light surfaces.

### Secondary
- **Highlighter Yellow** (`highlighter-yellow`): the "you are here / act now" mark. Active nav item, selected severity, ticked actions, text selection, the renewal banner, the brand tile.
- **Alert Orange** (`alert-orange`): counts, unread dots, gap bars, and "not covered" status dots. Small doses only, always with ink text.

### Tertiary (category pastels)
- **Blush Pink** (`blush-pink`), **Periwinkle** (`periwinkle`), **Sage** (`sage`), **Lilac** (`lilac`), with Yellow and Orange also available as category tones. Each risk category, policy, scenario and guide carries one `tone` in the data and wears it consistently as its icon chip, tag and tooltip field. Periwinkle also marks the "Typical 1.0×" peer marker and the comparison verdict; sage marks the "Possible" goal marker, positive terms and "better" diffs; pink marks "worse" diffs and the neutral-advisor note.

### Neutral
- **Paper** (`paper`): page ground.
- **Card Cream** (`card`): card and control surfaces.
- **Well Cream** (`well`): recessed rows, inner tiles, pill tags inside cards.
- **Ink** (`ink`): text, outlines, the primary button, selected segments, chart axes.
- **Muted Ink** (`muted-ink`): secondary copy, captions, axis ticks.
- **Hairline** (`hairline`): dividers inside cards, keyboard hints, list separators.
- **Track** (`track`): empty bar and progress tracks.
- **Sidebar Black** (`sidebar-black`) with **Sidebar Text** (`sidebar-text`): the navigation spine.

### Named Rules
**The Blue Pays Rule.** Electric blue means coverage, action, or focus. It is never a decorative fill, and a blue bar always means money a policy would pay.

**The Ink-On-Pastel Rule.** Text on any pastel or on yellow/orange is ink (#16140f) in both themes. Pastels do not invert in dark mode.

**The One Tone Per Category Rule.** A category's pastel is set once in data and reused everywhere that category appears. Never assign a pastel for decoration.

## Typography

**Display Font:** Bricolage Grotesque (with Helvetica Neue, Arial)
**Body Font:** DM Sans (with Helvetica Neue, Arial), stylistic set `ss01` on
**Quotation Font:** the system serif stack (ui-serif, Georgia), only for verbatim policy wording

**Character:** a chunky, slightly quirky grotesque for numbers and headings over a clean geometric sans for everything you read. The contrast makes figures feel like the point of the page.

### Hierarchy
- **Display** (600, clamp 88-148px, line-height 0.8, -0.06em, tabular): the hero multiplier only. The "×" is set at half size, untracked. Smaller page-level multipliers scale the same treatment down.
- **Headline** (600, clamp 34-56px, line-height 1, -0.035em, balanced): page greeting and page titles. Onboarding uses a larger variant (clamp 40-68px, -0.045em).
- **Lead** (500, 22px, 1.2): the sentence that explains the hero number. 19px on phones.
- **Title** (600, 24px, 1.1, -0.02em): card headings.
- **Title Small** (600, 18px, 1.2): sub-headings and in-card headings.
- **Figure** (600, 26px, 1, -0.03em, tabular): driver multipliers, gap amounts, key-value figures (20px), prices (34px), deltas (18px).
- **Body** (400, 15px, 1.5): running text; long reads cap at 58-70ch.
- **Body Small** (400-600, 14px): card subtitles in muted ink, list rows, buttons in small size.
- **Label** (600, 12.5px): pill tags, marker tags, fine print. Sentence case, no tracking.

### Named Rules
**The Numbers Wear Bricolage Rule.** Every multiplier, dollar amount, price, count and delta is set in Bricolage Grotesque with negative tracking and tabular figures. Body numerals inside sentences may stay in DM Sans.

**The Sentence-Case Rule.** No uppercase labels and no tracked-out small caps. Labels are sentence case at 12-12.5px, weight 600.

## Layout

A fixed 252px sidebar column plus a fluid main column, inside an 18px outer padding and capped at 1560px. The main column stacks a top bar (search, persona switch, notifications, account), a page greeting, then a 12-column grid with an 18px gap. Cards span 3/4/5/6/7/8/12 columns; the overview hero is 8 + 4.

Rhythm is 18px between cards, 24px inside cards, 8-12px between rows inside a card, 20px under a card head.

Responsive steps: at 1240px, 4-8 column spans go full width and 3-column spans go half. At 960px the sidebar is replaced by a mobile bar, the app padding drops to 12px, driver tiles and gap rows stack, and the keyboard hint and account name hide. At 600px cards drop to 18px padding and a 24px radius, the persona switch hides, two-up pickers become one column, and chart tick labels thin out.

## Elevation & Depth

Flat at rest. Depth comes from the ink outline and from three paper steps (paper, card, well); recessed rows are darker than the card they sit on. Shadows are soft, warm, heavily negative-spread, and appear only as a response to state or for floating layers.

### Shadow Vocabulary
- **Button lift** (`box-shadow: 0 8px 18px -10px rgba(22, 20, 15, 0.6)`): primary button hover.
- **Card lift** (`box-shadow: 0 18px 30px -24px rgba(22, 20, 15, 0.7)`): policy card hover, paired with a 3px rise.
- **Selected row** (`box-shadow: 0 10px 24px -18px rgba(22, 20, 15, 0.6)`): the selected risk category.
- **Popover** (`box-shadow: 0 18px 40px -18px rgba(22, 20, 15, 0.35)`): menus.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow at rest. A shadow means hover, selection or a floating layer.

## Shapes

Two shapes only: the full pill for anything you press or type into, and the large soft rectangle for anything that holds content. Radii step down as you nest: sidebar 30px, card 28px, option card 24px, popover 22px, well row 20px, term row 16px, tile and icon chip 14px, checkbox 8px. Icon chips are pastel squares at the 14px radius (circles inside scenario pills). Card outlines are 1.5px ink; inner wells carry a transparent 1.5px border that turns ink on hover so nothing shifts. Dashed lines mean "possible" or "drop here": the goal marker, its stem, and the upload zone.

## Components

### Buttons
Confident ink pills.
- **Shape:** full pill (999px), 1.5px border matching the fill.
- **Primary:** ink fill, cream text, 600 weight, 12px 20px. May carry a trailing 26px yellow circle holding an icon.
- **Hover / Focus / Active:** soft button-lift shadow on hover; press nudges down 1px and scales to 0.99; focus is a 3px electric-blue outline at 2px offset.
- **Ghost:** transparent with a currentColor outline; hover tints 8% of currentColor.
- **Blue:** electric-blue fill with white text, used sparingly for the commit step of a flow.
- **Small:** 8px 14px at 14px.
- **Text link:** 600 weight, underlined at 4px offset, thickness 1.5px growing to 2.5px on hover.

### Chips and Tags
- **Pill tag:** well-cream pill, 12.5px/600 label. On a pastel it keeps ink text. Inside meta rows it sits on card cream with a hairline border at weight 500.
- **Icon chip:** a pastel square (14px radius) holding a 1.9-stroke line icon in ink.
- **Status:** an orange dot before "Not covered / Underinsured", no dot for "Covered".

### Cards / Containers
- **Corner Style:** 28px (24px under 600px).
- **Background:** card cream; wells inside use well cream at a 20px radius.
- **Shadow Strategy:** flat; see Elevation.
- **Border:** 1.5px ink.
- **Internal Padding:** 24px (18px on phones); card head has 20px below.

### Inputs / Fields
- **Style:** 46px pill (50px for the top search), card cream, 1.5px ink outline, muted placeholder.
- **Focus:** 3px electric-blue outline at 2px offset on the whole pill (focus-within).
- **Keyboard hint:** small well-cream tag with hairline border, 8px radius.

### Navigation
- **Sidebar:** sidebar-black slab, 30px radius, sticky. Brand in Bricolage 700 22px with the yellow shield tile. Items are pills in sidebar text at weight 500; hover gets a 9% cream wash; the active item is a yellow pill with ink text. Counts are orange pills with ink text. The foot holds the pink neutral-advisor note.
- **Mobile:** the sidebar is replaced by a top bar with the brand and a round menu button.
- **Segmented controls:** a 1.5px ink-outlined pill track; the selected segment fills ink with cream text (persona switch, onboarding choices); severity uses yellow for the selected segment.

### Multiplier Hero (signature)
The display multiplier beside a lead sentence and a pastel status tag, over a peer strip: a dot cloud of peers on an ink axis with tag markers. "You" is an ink-filled tag on a 3px stem, "Typical" is periwinkle, "Possible" is sage with a dashed border and dashed stem below the axis. Markers glide (0.9s, ease) when actions change the number. Three driver tiles (well rows with icon chip, figure, name) close the card.

### Action Field (signature)
A full electric-blue card listing actions as rows separated by 26%-white rules. Each row has a 26px circle check, a title, a muted-white detail line and a Bricolage delta. Ticking fills the circle yellow with an ink check, scales it to 1.06 and strikes the title through.

### Policy Wording Block
Verbatim policy text in the system serif at 13.5px/1.6, on a well-cream field with a 1px ink rule on the left and a 0 12px 12px 0 radius. It exists to mark "the policy's own words" against the plain-English body.

### Renewal Banner
A full-width yellow card with an ink outline, a 68px ink "days left" block with yellow Bricolage numerals, a short paragraph, and an ink pill CTA.

## Do's and Don'ts

### Do:
- **Do** outline every card and outer control with a 1.5px ink line; use the hairline only for dividers inside a card.
- **Do** nest paper steps: paper ground, cream card, darker well inside.
- **Do** set every number in Bricolage Grotesque 600 with negative tracking and tabular figures.
- **Do** use the full pill (999px) for every button, field, tag and segmented control.
- **Do** give each category one pastel tone from data and reuse it everywhere that category appears.
- **Do** keep ink text on pastels, yellow and orange in both themes.
- **Do** reserve electric blue for coverage fills, the action field, focus and rare commit buttons.
- **Do** use soft negative-spread shadows only for hover, selection and floating layers.
- **Do** honor reduced motion; every transition collapses to near zero.

### Don't:
- **Don't** use grey or low-contrast outlines on cards; the line is ink.
- **Don't** use blue as a decorative fill or for anything other than coverage, action or focus.
- **Don't** put white text on a pastel.
- **Don't** add uppercase, letter-spaced labels or eyebrow lines above headings.
- **Don't** use hard offset shadows or shadows at rest.
- **Don't** introduce square corners on containers; radii step down with nesting, never to zero.
- **Don't** use the serif outside verbatim policy wording.

## Distilled restraint (Nov 2026)

The app was simplified with dub.co as the reference for restraint. The ledger personality stays: paper, Bricolage numerals, highlighter yellow, category pastels and the blue action field. The noise is gone.

- **One job per page.** Overview: multiplier, top three actions, would-your-policies-pay. Risk: category list and detail, with the trend chart under the list. Policies: cards only; upload lives in a drawer behind "Add a policy". Coverage & quotes: ranked gaps, each linking straight into the quote flow (the separate catalog page and the /shop index are gone; /shop redirects to /coverage). What-if: scenario pills, result and ledger. Learn: three cream guide cards and the glossary.
- **Shell.** The black sidebar slab is retired. The sidebar sits flush on paper: brand, a search pill (⌘K), six nav pills (active is the yellow highlighter), a one-line neutral-advisor note with a pink dot, and the account/demo-business switcher at the foot (menu opens upward). Content sits in one `surface` panel (26px radius, 1px border). The top bar, the persona toggle and the notification bell are gone. On phones the panel dissolves and cards sit directly on paper.
- **Lines.** Cards and outer controls use a 1px `border` at rest and `border-strong` on hover. The 1.5px ink outline is reserved for checkboxes and pressed states. This supersedes "1.5px ink outlines on every card" above.
- **Type scale.** Page titles are clamp(30px, 3vw, 40px); card titles 21px. The hero multiplier keeps its display size, so it is the only loud number on a page.
- **Copy.** Page intros are one sentence. Repeated explanations (neutral-advisor cards, "what providers see", "worth knowing", timeline legends) are each said once, where the decision happens.
- **Motion.** Route changes use the View Transitions API (`viewTransition` on nav links): the `page` panel fades out in 140ms and rises 8px into place over 320ms. Re-sorting or filtering quotes animates each row to its new position (a `q-<id>` transition name on every row). Buttons scale to 0.97 when pressed; tick circles overshoot slightly. All of this is off under reduced motion.
- **Quote rows.** A row shows the monogram, carrier name and badge, then a line with the rating and claims days, the must-haves as a single inline row of ticks, and the highlight with any caveat. Price, "Compare" and "Choose" sit on the right. On phones a sticky blue bar replaces the match card: "N of M match · from $X" with a "Compare N" button.
- **Floating layers.** The compare tray is a cream pill with a stronger border and a soft shadow, not a black slab. The policy drawer header is cream with a 6px category-colour band along the top; flagged terms get a light yellow tint and an orange dot.
- **Text floor.** Secondary text is at least 13px, `--muted` is #5a5549, and card cream (#fdfaf3) sits visibly above the panel (#f3eee2). The axe audit for WCAG 2.2 AA reports zero violations on every route, in both themes, for both personas, at 1440px and 390px.
