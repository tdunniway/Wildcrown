# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

## Approved gameplay direction

- Preserve the established Crown Arena mock and Wildcrown art direction as the visual source of truth.
- Make the core rhythm readable: reveal the rival plan, choose a counter, then resolve support, strike, and retaliation as distinct beats.
- Formation orders must create real mechanical counters rather than decorative labels.
- Deliberate planning is the default; the countdown is an optional pressure mode.
- Victories should create a lightweight run-building choice before the next tier.
- Keep the prototype playable in portrait instead of replacing it with a rotate-only gate.
- Favor forecastable tactical depth over hidden automation: show the next threat, rotate optional combat objectives, and reward players for changing their answer without obscuring the core clash.
- Keep the battle command sequence explicit and consistent: army formation, commander strategy, movement strategy, tactical response, lead ability, then hero support.
- Keep Command Authority and the Commit action together in the top battle-status header so control mode and execution state are always visible.
- Treat the General as the persistent player-facing commander: show limited powers, quick items, and a support weapon with visible cooldown or consumption state. Do not restore redundant General advice; the rival intent and round objective already explain the decision.
- Every deployed hero commands a selectable army. Army and movement pairings must create visible, forecastable mechanical synergies rather than cosmetic labels.
- Keep the battle UI strategically rich but visually calm: use progressive disclosure, show one command decision at a time, preserve a compact summary of the full plan, and keep advanced General tools collapsed until requested.
- Keep the allied and rival hero lines visually adjacent. Do not place planning cards or redundant General recommendations between them; put the compact round objective in the top status bar and keep formation choices in the command flow.
- Use a three-camera combat language: Plan is the default decision view, Clash becomes the cinematic execution view, and Tactical is an optional battlefield inspection view. Allow manual switching at any time it is safe.
- Treat both Generals as battlefield actors. Use a small square face icon beside a compact horizontal command panel, never a tall portrait rail. The enemy General has health and can be damaged by clearly signposted General-targeting attacks.
- When either General is collapsed, remove the panel entirely and leave only the square face icon in the battlefield's top corner with its compact health/resolve meter. Clicking the portrait toggles the panel; do not add a separate Show/Hide control.
- The Plan, Clash, and Tactical cameras must change the battlefield composition and information hierarchy, not merely apply a zoom. Plan should resemble the original command-map concept, Clash should prioritize character action and impact, and Tactical should expose lanes, paths, and threat relationships.
- The original three camera concepts are saved in `C:\Users\troy_\OneDrive\Desktop\Wildcrown`: October 11, 2026 images at 03_13_48 PM (Plan), 03_13_30 PM (Clash), and 03_13_56 PM (Tactical). Use their actual compositions, not invented camera definitions. Document any adaptation rather than claiming pixel-exact fidelity.
- Fit the full desktop battle on one screen at 1280 × 720 and 1440 × 900 CSS pixels, including both expanded General panels and all six hero selectors. Phone layouts may scroll vertically, but must not overflow horizontally.
- Use at least 16-pixel primary interactive text, 14-pixel secondary UI text, and 44-pixel control targets. Keep required, complete, and incomplete states explicit and truthful for all six command steps; block commitment until the plan is legal.
- Make each battlefield character a separate selectable and independently animated actor. Enemy characters must face left toward their opponents. Decorative art must not intercept another character's hit area. Respect reduced-motion preferences and playback pause.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
