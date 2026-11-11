<img src="public/icon.svg" width="64" height="64" alt="">

# ShieldWise

Know your risk. Own your coverage. ShieldWise is a neutral advisor and policy hub for small business owners, starting with **SaaS companies** and **restaurants**.

This is a pitch and user-testing prototype built on the original [ShieldWise UI](https://khanlamiah019.github.io/shield_wise_insurance_ui/). All businesses, carriers, quotes and scores are sample data.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/, deployable to GitHub Pages (hash routing, relative base)
```

## What's inside

| Route | What it does |
| --- | --- |
| `#/start` | Onboarding. Pick SaaS or restaurant, answer size and risk questions, add policies, and see the score reveal. |
| `#/` | Overview: risk multiplier vs peers, peer distribution, top drivers, actions that move the score, coverage map, a 24-week trend with explained events, and a renewal alert. |
| `#/risk/:category` | Risk profile. Shows each category's multiplier, why it's high, a checklist of actions (the multiplier updates live), and which policy responds. |
| `#/policies` and `#/policies/:id` | Policies. Policy cards, a plain-English policy drawer with flagged terms, the policy's own wording and renewal reminders, an "Add a policy" drawer with a simulated PDF upload, and saved demo quote requests with withdrawal. |
| `#/coverage` | Gaps ranked by dollars at risk, where you're already fine, and links to compare providers for each gap. |
| `#/shop` | Redirects to `#/coverage`, where each gap links straight into its quote comparison. |
| `#/shop/:product` | Provider comparison: configure limits, deductibles and must-haves, sort sample quotes, compare up to three providers, and save a demo quote request to Policies. |
| `#/learn` | Guides matched to your policies and a glossary with "for you" notes. |

Press **⌘K** to search everything. Use the avatar menu to switch between the demo businesses (Northwind Labs, a SaaS company, and Saffron & Salt, a restaurant), change the theme, or restart the demo.

### Comparing providers

From **Coverage**, pick a gap and choose **Compare**, then set a limit, deductible and must-haves. Estimates update as needs change. **Best fit** puts available configurations first, then ranks by the number of selected must-haves met and annual price. You can also sort by lowest price or sample claims time, or show only full matches. Unsupported limits or deductibles are explained and cannot be requested.

Select two or three providers for the side-by-side drawer. Compare premiums, payment options, coverage features, sample claims times, illustrative financial-strength grades and limits. **Only differences** hides identical detail rows; provider descriptions and caveats stay visible. On small screens, scroll the table horizontally.

Choosing a provider opens a review of the estimate, payment options and start timing. The sharing consent switch must be enabled before saving a simulated request. Policies labels it **Demo · not sent** and lets you withdraw it. Requests persist in browser local storage separately for SaaS and restaurant; a new request for the same coverage replaces the earlier one. No details reach a provider, no agent reviews the request, and no insurance is purchased.

### Why a multiplier, not a percentage

The score is shown as **1.7×**: how exposed you are compared with a typical similar business (1.0×). A number like "82%" reads like the chance of a claim, and that's wrong. A multiplier is honest about being relative. It pairs naturally with a percentile ("more exposed than 90% of peers"), and it moves visibly when you complete an action (−0.19).

## Stack

- React 19, TypeScript, Vite
- [Astryx](https://github.com/meta/astryx) (`@astryxdesign/core`) for the command palette, drawers, tooltips, toasts, switches, responsive quote-flow stepper, limit slider, segmented controls and must-have checkboxes. It is themed into the ShieldWise palette through its CSS token bridge.
- Tailwind v4 through the Astryx bridge, and lucide icons
- The visual system is inherited from the original prototype: Bricolage Grotesque and DM Sans, a warm paper ground, pastel category colors and ink hairlines.

Product context lives in `PRODUCT.md`, and design system notes in `DESIGN.md`.

Quote requests are simulated and stored locally, separately for each demo business. Nothing is sent to a carrier; no coverage is purchased.
