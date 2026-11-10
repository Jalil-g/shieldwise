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
| `#/policies/:id` | Policy hub. Has a renewal timeline, policy cards, a plain-English policy drawer with flagged terms, the policy's own wording, renewal reminders and a simulated PDF upload. |
| `#/coverage` | Gaps ranked by dollars at risk, where you're already fine, and side-by-side quote comparison with a written verdict. |
| `#/simulator/:id` | What-if scenarios. Shows the line-by-line payout (limits, sublimits, deductibles) and a "with the recommended option" replay. |
| `#/learn` | Guides matched to your policies and a glossary with "for you" notes. |

Press **⌘K** to search everything. Use the avatar menu to switch between the demo businesses (Northwind Labs, a SaaS company, and Saffron & Salt, a restaurant), change the theme, or restart the demo.

### Why a multiplier, not a percentage

The score is shown as **1.7×**: how exposed you are compared with a typical similar business (1.0×). A number like "82%" reads like the chance of a claim, and that's wrong. A multiplier is honest about being relative. It pairs naturally with a percentile ("more exposed than 90% of peers"), and it moves visibly when you complete an action (−0.19).

## Stack

- React 19, TypeScript, Vite
- [Astryx](https://github.com/meta/astryx) (`@astryxdesign/core`) for the command palette, drawers, tooltips, toasts and switches. It is themed into the ShieldWise palette through its CSS token bridge.
- Tailwind v4 through the Astryx bridge, and lucide icons
- The visual system is inherited from the original prototype: Bricolage Grotesque and DM Sans, a warm paper ground, pastel category colors and ink hairlines.

Product context lives in `PRODUCT.md`, and design system notes in `DESIGN.md`.
