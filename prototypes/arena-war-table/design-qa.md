# Arena War Table design QA

## Evidence

- Source of truth: `public/assets/arena-war-table-reference.png`
- Implementation capture: `qa/implementation.png`
- Same-frame comparison: `qa/reference-vs-implementation.png`
- Desktop viewport: 1672×941 CSS pixels at 1× density; both source and implementation are 1672×941 pixels.
- Phone viewport: 390×844 CSS pixels at 1.8× device density in the Codex in-app browser.
- States inspected: untouched setup, phone setup, battle planning, tactical objective forecast, support/strike/retaliation resolution, victory result, boon selection, and tier-two restart.
- Full-view evidence: desktop setup and the complete phone battle page.
- Focused evidence: strike-stage clash banner and victory/boon result card.

## Fidelity review

- The untouched desktop setup preserves the approved art one-to-one. Transparent hit targets reveal affordances only on hover, focus, or a changed state, so the reference composition remains the visible default.
- The same-frame comparison shows no material drift in imagery, spacing, type hierarchy, color, framing, or navigation placement.
- Portrait now uses a playable command-console layout instead of an orientation gate. Its masthead, champion cards, opening orders, intent, health, abilities, support, forecast, result, and bottom navigation stay within a 390-pixel viewport with no horizontal overflow.
- The battle surface answers the important planning questions before commitment: who acts, who is threatened, what support is coming, which doctrine counters it, expected damage in/out, resource cost, cooldown state, and whether Crown Break is ready.
- The tactical brief now exposes the following round's actor, move, target, and damage pattern, giving players a reason to conserve Wildlight and assists instead of optimizing only the current clash.
- A three-round objective cycle asks for a formation read, damage prevention, then burst damage. The command forecast confirms success before commitment, and rewards feed back into Wildlight or momentum.
- Rival roles are visually and mechanically distinct: Kael challenges the healthiest champion, Branna pressures the weakest, and Elara attacks the full squad.
- Clash resolution is staged as support, strike, and retaliation. The visible banner, hit states, combat recap, and damage-prevented statistic make the result legible.
- Victory produces a score, rank, formation-read count, prevented-damage count, three crown boons, and a tier-two continuation. The selected Ironroot Oath correctly raised all champion health from 100 to 112 in tier two.

## Comparison history

1. The original approved desktop mock was retained as the visual source of truth.
2. The gameplay overlay was expanded without changing the untouched setup composition.
3. Portrait setup initially exposed anonymous champion hitboxes; named champion cards and a compact masthead replaced them.
4. Phone bounds were rechecked at 390×844: document width remained within the viewport and all combat controls measured inside the command surface.

## Primary interaction checks

- Champion replacement drawer and opening-order cycling remain available during setup.
- Enter Arena opens a deterministic, answerable rival intent.
- Deliberate mode remains on round two after an idle wait; no hidden deadline advances the battle.
- Selecting Arrow Storm, Vex's Smoke Veil, and Lock Plan visibly entered the staged clash sequence.
- Selecting Branna as Lyra's opening target changed the forecast to `Objective secured · +1 Wildlight`; resolving the clash advanced to round two with five Wildlight, one momentum, `Hold the Crown`, and Elara's round-three Arcstorm forecast visible.
- A complete browser playthrough ended in victory after 11 rounds with a 1065 Steel-rank score.
- Selecting Ironroot Oath enabled Challenge Tier 2 and started tier two with the boon applied.
- Production browser console: 0 warnings and 0 errors.

## Automated checks

- Combat engine: 10/10 tests passed.
- Production build: passed.
- Sites packaging/worker: 4/4 tests passed.

## Final result

final result: passed
