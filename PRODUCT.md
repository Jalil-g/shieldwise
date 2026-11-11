# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated to the agent. The user said "run all, finish on your own" and asked for the Astryx design system to be used. Choice: Vite + React 19 + TypeScript, `@astryxdesign/core` for interactive primitives (command palette, drawers, tooltips, toasts, switches), Tailwind v4 through the Astryx bridge, react-router (hash routing so it deploys to GitHub Pages like the original prototype). Mock data only; no backend.

## Users

Small business owners (confirmed), not brokers. They are not insurance experts. They open ShieldWise to answer three questions: how exposed is my business, do my policies actually cover it, and what should I do next. Launch verticals (confirmed): **SaaS companies** and **restaurants**.

## Product Purpose

Help a small business owner understand their risk, see gaps in their coverage, and make informed decisions. Success: the owner can name their biggest exposure, knows what their policies would pay in a bad scenario, and has a short, ranked list of actions.

## Positioning

ShieldWise is a **neutral advisor and comparison tool** plus a **policy hub** (confirmed). It does not sell insurance. It refers owners to options and stores all of their policies in one place. Recommendations come from the owner's risk profile and the gaps in their existing coverage, not from what a carrier wants to sell.

## Operating Context

Owners check in occasionally: at renewal, after something changes (new hires, new revenue, a scare), or when a carrier sends a quote. They come with policy PDFs that they don't fully understand. The use is short and decision-shaped rather than all-day monitoring.

## Capabilities and Constraints

- Relative risk measure versus similar businesses (same industry and size). It is **not** a claim probability. Shown as a multiplier against peers (1.0× = typical peer). Decided by the agent at the user's request ("82% or 2×, 1.5×, wdyt").
- Risk profile by category, with drivers (why) and actions that lower exposure.
- Policy hub: store policies, read limits, deductibles, sublimits and exclusions in plain English, plus renewal dates.
- Coverage recommender driven by gaps, and side-by-side policy comparison (sample quotes).
- Learn: plain-English guides and a glossary matched to the policies the owner holds.
- Not built: a what-if scenario simulator (removed 2026-11-11), claims filing, AI chat, real carrier integrations, auth.

## Brand Commitments

The incumbent prototype (https://khanlamiah019.github.io/shield_wise_insurance_ui/) is the established visual world. The user said to keep the current direction and make the UX better. Name: ShieldWise. Tagline in the prototype: "Smarter insurance for stronger businesses."

## Evidence on Hand

None. Every business, person, policy, carrier, quote and score is synthetic demo data and must be labeled as sample data. Do not invent customer counts, testimonials, partner carriers presented as real, or savings claims.

## Product Principles

1. Relative, not alarming: frame risk against peers and always pair it with what to do about it.
2. Plain English first, and the policy's own wording on request.
3. Neutral: show trade-offs honestly, including when the owner's current coverage is good enough.
4. Every number explains itself: what changed, why, and what moves it.

## Accessibility & Inclusion

WCAG 2.2 AA. Every chart has a text equivalent, the app is fully keyboard operable, and it respects reduced motion.
