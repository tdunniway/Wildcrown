# Wildcrown Arena War Table — UI/UX Audit and Optimization

**Date:** October 11, 2026

**Scope:** Pre-battle setup, combat planning, command submission, animated resolution, and tactical debrief

**Surfaces tested:** Local prototype and current production build; 432 × 589 mobile and compact/desktop browser layouts

## Executive verdict

The prototype already has a strong dark-fantasy identity and meaningful tactical depth, but the battle screen was presenting too many decisions and explanations simultaneously. The main usability problem was hierarchy, not a lack of features.

This pass converts the command area into a five-step decision flow, keeps the battlefield visible, collapses advanced General tools until requested, removes duplicated information, strengthens selected states, and raises the practical floor for type and touch targets. The result is materially easier to scan without removing tactical choice.

## Audited player journey

1. **Prepare the squad — Healthy, with a long-scroll caveat.** Hero, doctrine, control mode, and army assignments are understandable and touch-friendly. The setup remains vertically long on small phones, but each choice is distinct and the primary action is clear.

2. **Read the battle state — Improved to healthy.** Rival intent, Crown/Wildlight resources, General advice, hero health, formation, objective, and target state are visually separated. Duplicate rival-intent and recommendation elements were removed from the center column so the same information is not competing in three places.

3. **Build a command — Improved from high-friction to healthy.** The previous desktop presentation exposed strategy, movement, response, ability, and support simultaneously. The optimized deck presents one step at a time, with a persistent five-step summary and clear Back/Next/Commit controls. Existing selections remain visible, so simplification does not hide the plan.

4. **Commit and watch the clash — Healthy.** Commit changes to an explicit resolving state, choices lock, and the clash sequence appears in a focused modal with pause, speed, inspect, and skip controls. The battlefield remains visible as context.

5. **Understand the result — Healthy.** The tactical debrief explains damage dealt, taken, and denied; states what changed; identifies the counter/support interaction; and confirms whether the round objective was secured before continuing.

## What was working well

- Strong visual identity: gold, cyan, and crimson consistently distinguish command, allied, and hostile information.
- Tactical decisions have real texture: strategy, formation, counter-response, hero ability, support, armies, and General powers create a credible strategy-game vocabulary.
- Assisted and Full Command modes support both casual and expert play without requiring separate combat systems.
- The debrief teaches the combat model instead of showing damage numbers without cause.
- Reduced-motion support already exists in the prototype.

## Highest-impact findings and fixes

| Finding | Severity | Optimization applied |
|---|---:|---|
| Five command categories competed for attention at once | High | Converted the deck to one active category with a persistent five-step plan summary |
| General powers, items, and support weapon consumed scarce battle space | High | Collapsed them behind a clearly labeled `General powers & items` disclosure |
| Rival intent and recommendation content repeated in multiple regions | Medium | Removed duplicate center-column intent and AI-insight blocks |
| Small labels and compact controls reduced readability | High | Raised command controls to 48–52px minimum heights and increased mobile control text |
| Selected states relied too heavily on glow/border color | Medium | Added a clear cyan inset selection bar and quieter default panels |
| Mobile reference art caused horizontal overflow | Medium | Normalized the art anchor and maximum width at narrow/aspect-ratio breakpoints |
| Advice could grow until it displaced essential controls | Medium | Limited default advice to three lines while keeping advanced tools available on demand |

## Measured usability checks

| Check | Before | After |
|---|---:|---:|
| Visible mobile controls in the audited battle viewport | 26 | 19 |
| Mobile interactive targets below 44px | 0 | 0 |
| Mobile control text below 14px | 0 | 0 |
| Mobile horizontal overflow | Present | None |
| Visible desktop battle controls | 38 in the compact baseline | 26 in the optimized desktop state |
| Optimized desktop controls below 44px or 12px text | — | 0 |

The desktop before/after counts use different viewport sizes and are directional rather than a controlled benchmark. The mobile measurements use the same 432 × 589 viewport.

## Accessibility and inclusive-use review

- Mobile controls meet a 44px minimum target in the tested combat viewport; primary command controls are 52px tall.
- Mobile interactive text is at least 14px in the tested viewport.
- Focus-visible styles remain intact, native select semantics are preserved, and combat regions retain accessible names.
- Color is supported by labels, borders, icons, position, and text; it is not the only status cue.
- Motion can be reduced, and the resolution sequence can be paused or skipped.

This is a focused product audit, not a full WCAG conformance claim. It does not replace testing with a screen reader, keyboard-only play, browser zoom, color-vision simulators, or physical mobile devices.

## Evidence

- `01-planning-desktop-before.jpg` — compact desktop baseline
- `01-planning-desktop-before-full.jpg` — full baseline composition
- `02-planning-mobile-before.jpg` — mobile baseline
- `04-planning-mobile-after.jpg` — optimized mobile planning flow
- `05-planning-desktop-after.jpg` — optimized desktop planning flow
- `06-resolution-after.jpg` — resolving/clash sequence
- `07-debrief-after.jpg` — tactical debrief

## Verification

- Production and local visual inspection completed.
- Full local flow exercised from setup through round-two continuation.
- Browser console: no warnings or errors during the verified flow.
- `npm run build`: passed.
- `npm run test:combat`: 10/10 passed.
- `npm run test:sites`: 4/4 passed.
- `git diff --check`: passed.

## Recommended next validation

Run five short playtests—two casual players, two strategy players, and one low-vision player—measuring time to first valid command, incorrect selections, use of General tools, and whether players can explain why the round result occurred. The structure is now ready for that test; the next meaningful improvements should come from observed player behavior rather than adding more surface area.
