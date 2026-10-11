# Arena War Table design QA

## Evidence

- Reference: `public/assets/arena-war-table-reference.png` (1672×941)
- Implementation screenshot: `qa/implementation.png` (1280×720)
- Side-by-side comparison: `qa/reference-vs-implementation.png`
- Browser: Codex in-app Browser
- Viewports checked: default 1280×720, 1024×768 landscape, 390×844 portrait

## Fidelity review

- Layout, spacing, typography, color, imagery, icons, borders, and visual hierarchy match the approved reference in the untouched desktop state. The reference art is used directly as the visual canvas so no placeholder imagery, replacement icons, CSS illustration, or generic component skin alters the target composition.
- Interactive hit areas are transparent in the untouched state. Hover, focus, changed orders, champion replacement, and commit confirmation appear only after the corresponding action.
- The 1024×768 landscape view preserves the whole War Table without overlap or clipping. Portrait uses a focused rotate-device message because the tactical hit areas would otherwise fall below a practical tap size.
- Champion replacement opens a keyboard-accessible drawer and updates both the selected-slot badge and the related opening-order row. Opening orders cycle through Flank, Press, and Hold. Commit Plan produces a persistent committed state plus dismissible confirmation.
- Semantic buttons, labels, alt text, visible keyboard focus, and reduced-motion handling are present. Browser diagnostics returned no warnings or errors.

## Findings resolved

- P1 behavior/state: champion selection originally changed data without enough visible confirmation. Fixed with a selected-champion badge and synchronized order-row state.
- P1 responsiveness: portrait originally reduced the landscape war table to impractical controls. Fixed with a dedicated landscape-orientation prompt.
- P2 fidelity: initial active overlays obscured parts of the approved art. Fixed by making interaction overlays visually dormant until hover or state change.

## Final result

final result: passed

## Playable combat QA — 2026-10-11

- The approved war-table art remains the visual foundation; gameplay information is layered as a compact command surface using the existing navy, parchment, crown-gold, rival-red, and support-teal language.
- The round answers the core readability questions before commitment: who acts, whom they threaten, what the action does, how much Wildlight remains, which abilities are recovering, and which support options are legal.
- A manual browser playthrough verified a deliberate high-cost area attack plus defensive assist, target selection, round resolution, resource recovery, cooldown feedback, HP changes, refreshed intent, and combat recap.
- The deadline fallback prevents an abandoned round from stalling. Deterministic resolution and an explicit recap keep the result explainable instead of feeling like passive auto-battle.
- Keyboard semantics, named regions, button labels, health-bar accessible names, disabled-state legality, visible focus, reduced-motion handling, and the landscape requirement remain intact.
- Browser console review found no application warnings or errors. Combat engine tests passed 3/3, production build passed, and hosting tests passed 4/4.

final result: passed
