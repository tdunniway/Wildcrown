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
- Treat the General as the persistent player-facing commander: show readable advice plus limited powers, quick items, and a support weapon with visible cooldown or consumption state.
- Every deployed hero commands a selectable army. Army and movement pairings must create visible, forecastable mechanical synergies rather than cosmetic labels.
- Keep the battle UI strategically rich but visually calm: use progressive disclosure, show one command decision at a time, preserve a compact summary of the full plan, and keep advanced General tools collapsed until requested.
- Keep the allied and rival hero lines visually adjacent. Do not place planning cards or redundant General recommendations between them; put the compact round objective in the top status bar and keep formation choices in the command flow.
- Use a three-camera combat language: Plan is the default decision view, Clash becomes the cinematic execution view, and Tactical is an optional battlefield inspection view. Allow manual switching at any time it is safe.
- Treat both Generals as battlefield actors. Each should collapse to a portrait rail or expand to a readable command sheet; the enemy General has health and can be damaged by clearly signposted General-targeting attacks.
- When either General is collapsed, remove the sheet entirely and leave only the General portrait in the battlefield's top corner with its compact health/resolve meter. The portrait itself is the control that restores the full sheet.
- The Plan, Clash, and Tactical cameras must change the battlefield composition and information hierarchy, not merely apply a zoom. Plan should resemble the original command-map concept, Clash should prioritize character action and impact, and Tactical should expose lanes, paths, and threat relationships.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
