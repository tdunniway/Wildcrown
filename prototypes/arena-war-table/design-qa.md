# Arena War Table — Design QA

## Baseline evidence

- Source of truth: `public/assets/arena-war-table-reference.png`
- Implementation capture: `qa/implementation.png`
- Same-frame comparison: `qa/reference-vs-implementation.png`
- Desktop viewport: 1672×941 CSS pixels at 1× density; both source and implementation are 1672×941 pixels.
- Phone viewport: 390×844 CSS pixels at 1.8× device density in the Codex in-app browser.
- States inspected: untouched setup, phone setup, battle planning, tactical objective forecast, support/strike/retaliation resolution, victory result, boon selection, and tier-two restart.
- Full-view evidence: desktop setup and the complete phone battle page.
- Focused evidence: strike-stage clash banner and victory/boon result card.

## Baseline fidelity review

- The untouched desktop setup preserves the approved art one-to-one. Transparent hit targets reveal affordances only on hover, focus, or a changed state, so the reference composition remains the visible default.
- The same-frame comparison shows no material drift in imagery, spacing, type hierarchy, color, framing, or navigation placement.
- Portrait uses a playable command-console layout instead of an orientation gate. Its masthead, champion cards, opening orders, intent, health, abilities, support, forecast, result, and bottom navigation stay within a 390-pixel viewport with no horizontal overflow.
- The battle surface answers the important planning questions before commitment: who acts, who is threatened, what support is coming, which doctrine counters it, expected damage in/out, resource cost, cooldown state, and whether Crown Break is ready.
- The tactical brief exposes the following round's actor, move, target, and damage pattern, giving players a reason to conserve Wildlight and assists instead of optimizing only the current clash.
- A three-round objective cycle asks for a formation read, damage prevention, then burst damage. The command forecast confirms success before commitment, and rewards feed back into Wildlight or momentum.
- Rival roles are visually and mechanically distinct: Kael challenges the healthiest champion, Branna pressures the weakest, and Elara attacks the full squad.
- Clash resolution is staged as support, strike, and retaliation. The visible banner, hit states, combat recap, and damage-prevented statistic make the result legible.
- Victory produces a score, rank, formation-read count, prevented-damage count, three crown boons, and a tier-two continuation. The selected Ironroot Oath correctly raised all champion health from 100 to 112 in tier two.

## Baseline comparison history

1. The original approved desktop mock was retained as the visual source of truth.
2. The gameplay overlay was expanded without changing the untouched setup composition.
3. Portrait setup initially exposed anonymous champion hitboxes; named champion cards and a compact masthead replaced them.
4. Phone bounds were rechecked at 390×844: document width remained within the viewport and all combat controls measured inside the command surface.

## Baseline interaction checks

- Champion replacement drawer and opening-order cycling remain available during setup.
- Enter Arena opens a deterministic, answerable rival intent.
- Deliberate mode remains on round two after an idle wait; no hidden deadline advances the battle.
- Selecting Arrow Storm, Vex's Smoke Veil, and Lock Plan visibly entered the staged clash sequence.
- Selecting Branna as Lyra's opening target changed the forecast to `Objective secured · +1 Wildlight`; resolving the clash advanced to round two with five Wildlight, one momentum, `Hold the Crown`, and Elara's round-three Arcstorm forecast visible.
- A complete browser playthrough ended in victory after 11 rounds with a 1065 Steel-rank score.
- Selecting Ironroot Oath enabled Challenge Tier 2 and started tier two with the boon applied.
- Production browser console: 0 warnings and 0 errors.

## Command Authority expansion — October 11, 2026

### Reference and implementation

| Source reference                                                                                                                                                             | Implemented prototype                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/assets/arena-war-table-reference.png` — cinematic blue/gold war table, three-champion formation, explicit rival line, opening orders, and a large commitment action. | `src/App.jsx` + `src/styles.css` — preserves the same visual hierarchy while turning the center board into a playable clash and adding Command Authority without replacing the established Wildcrown art direction. |

Compared side by side at desktop landscape and a 500 × 900 narrow viewport on October 11, 2026.

### Visual fidelity

- **Palette and materials:** Pass. Gold rules, teal tactical feedback, dark blue panels, restrained red rival signals, and the original arena art remain consistent with the reference.
- **Hierarchy:** Pass. Rival intent and battlefield stay dominant during combat; Command Authority is a compact secondary control surface. The result screen clearly prioritizes outcome, mastery tier, optional objectives, and replay actions.
- **Typography:** Pass. Cinzel remains reserved for heraldic labels and major actions; compact sans-serif copy carries tactical detail.
- **Density:** Pass. Desktop keeps the board readable without hiding the three-versus-three formation. Narrow layout stacks setup choices and preserves touch-sized controls.
- **Motion and feedback:** Pass. Clash resolution, hard-counter feedback, AI-live status, impact recap, and result reveal make state changes visible. Reduced-motion support remains available.

### Interaction coverage

- Auto Resolve reaches a legal result and reports the commander’s final reasoning.
- Watch visibly advances rounds and keeps **Take Command** available.
- Assisted Command produces a complete legal recommendation that can be edited or committed.
- Full Command exposes tactic, lead, ability, assist, target, and surge decisions.
- A delegated battle can be reclaimed and manual controls become available immediately.
- Results show Command Mastery, optional objectives, reward bonus, manual/AI round split, damage dealt, and damage prevented.

### Issues found and fixed

1. **Watch-mode render loop:** The watch effect was updating its own dependency through a newly allocated plan. Removed the redundant state writes; Watch now advances normally without new console errors.
2. **Result comprehension:** Added an explicit control ledger and the final commander decision so Auto and hybrid play remain understandable rather than feeling arbitrary.
3. **Narrow-screen authority controls:** Added stacked authority panels, two-column mode selection, compact strategy buttons, vertical mastery objectives, and a vertical result ledger.

### Verification

- Combat engine: 8/8 tests passing.
- Sites/static routing: 4/4 tests passing.
- Production build: passing with Vite 8.3.4.
- Browser flows checked: setup, Assisted recommendation, manual commit, Watch, Take Command, Auto Resolve, and results.
- Browser console: no new warnings or errors after the Watch-mode fix.
- Final status: **Pass**.

## Battlefield Command vertical slice — October 11, 2026

### Reference and implementation

- Visual source: `public/assets/arena-war-table-reference.png` plus the previously approved Command Authority build documented above.
- Implementation: `src/App.jsx` and `src/styles.css`.
- Browser evidence: live Codex in-app browser captures at 1440 × 900 desktop and 430 × 932 phone viewports.
- Primary interactions checked: enter arena, inspect intent, select all five command steps, change movement, commit, watch the five-beat clash, read the tactical debrief, continue to round two, and open the optional General tools drawer.

### What was verified

- Desktop keeps the General, allied line, spatial formation map, rival line, enemy intent, and five tactical choice groups visible in one battle composition.
- Phone presents a fixed five-step command dock with Strategy → Movement → Response → Ability → Support, readable selections, Back/Next controls, and a final Commit action.
- The selected movement changes the live formation preview and the outgoing/incoming forecast before commitment.
- General powers, consumable items, and the support weapon remain optional on phone and expand on demand without blocking the core round loop.
- Resolution is staged as Formation → Support → Ability → Army Strike → Retaliation and remains skippable.
- Every non-final round pauses on a debrief that reports grade, damage dealt, damage taken, damage denied, the successful/failed counter, and the support interaction before the next intent appears.
- Touch targets in the mobile command dock and modal actions are at least 44 CSS pixels tall; command controls use 16-pixel or larger interactive text where browser zoom behavior matters.
- Browser console after the full mobile round flow: 0 warnings and 0 errors.

### Automated verification

- Production build: passed.
- Combat engine: 10/10 tests passing.
- Sites/static routing: 4/4 tests passing.
- `git diff --check`: passed.

### Final result

**Passed.** No P0, P1, or P2 visual or interaction defects remain in the approved vertical slice.

## Tactical feedback and pacing pass — October 11, 2026

### Reference and states reviewed

- Source visual: `public/assets/arena-war-table-reference.png` and the approved Battlefield Command vertical slice above.
- Implementation: `src/App.jsx` and `src/styles.css`.
- Viewports: 1440 × 900 desktop and 430 × 932 phone.
- States inspected: setup, command planning, paused resolution, completed resolution, tactical debrief, round-two continuation, and mobile steps one and two.

### Improvements verified

- Each round now presents one legible tactical objective based on the current enemy intent, with a live likely-secured/at-risk forecast before commitment.
- Movement choices communicate both payoff and exposure rather than only a damage modifier.
- The five-beat resolution now includes named event callouts, battlefield hit/guard effects, pause/resume, 1×/2× pacing, inspect, and skip controls.
- The debrief confirms whether the round objective was secured and provides a concrete coaching read for the next decision.
- The former center-board advice overlap was removed; General advice, movement forecast, rival move, and round objective remain readable as separate layers.
- The phone header uses three clear rows: resources, full-width rival intent, then Command Authority/Surge/Commit. Enemy intent is no longer truncated into a narrow center column.
- Mobile step navigation advanced from Strategy to Movement correctly. Every visible mobile button/select measured at least 44 CSS pixels high and no visible interactive text measured below 12 CSS pixels.
- The desktop Command Authority select now uses the same minimum tap/click height as other controls.

### Verification

- Production build: passed with Vite 8.3.4.
- Combat engine: 10/10 tests passing.
- Sites/static routing: 4/4 tests passing.
- Browser console: 0 warnings and 0 errors.
- No horizontal overflow or clipped header actions observed at 430 × 932.

### Final result

**Passed.**

## Concept-led UI repair and hands-on audit — October 11, 2026

This section supersedes the earlier blanket readiness claims above. The user rejected those revisions; this pass rebuilt the interface and checked actual interaction rather than treating a successful build as design approval. It is ready for user review, not a claim of 95% completion or exact visual matching.

### Source and design decisions

- Original references: the October 11 Plan (03_13_48 PM), Clash (03_13_30 PM), and Tactical (03_13_56 PM) images in `C:\Users\troy_\OneDrive\Desktop\Wildcrown`, plus the October 10 strikeforce setup concept.
- General clarification: small square face plus compact horizontal panel. Clicking the portrait toggles it. Collapsed panels are removed, leaving only the portrait and its health/resolve meter.
- Desktop requirement: the battle fits one screen with both General panels open. Mobile intentionally uses a vertically stacked interface.
- New backgrounds preserve the concepts' different compositions: dark diagonal fortress/grid for Plan, large opposed characters in a lion courtyard for Clash, and a circular elevated arena with three lanes for Tactical. This is an adaptation to the current interactive prototype, not a pixel-exact clone.

### Eleven-request verification matrix

| Request                   | Implemented and checked                                                                                                                                                                             | Evidence                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1. Planning setup         | Blue/gold strikeforce cards, individual champion art, selectable armies, opening doctrine and authority choices, clear Enter arena action. Hero replacement and army selection persist into battle. | `49-packaged-setup.jpg`; desktop and 320/390-pixel setup checks.                                 |
| 2. Compact Generals       | Square portraits beside short horizontal panels; icon-led powers, quick items, catapult, and enemy stats. Both fit without displacing selectors.                                                    | `52-packaged-clash.jpg`; 1280 × 720 check.                                                       |
| 3. Bottom menu            | Six compact summary tabs, one active decision surface, icon-led choices, Back/Next navigation.                                                                                                      | `50-packaged-plan.jpg`, `52-packaged-clash.jpg`.                                                 |
| 4. Top bar                | Compact rival intent, round objective, resources, authority, Surge and Commit. No redundant long central information panel.                                                                         | All three packaged battle captures.                                                              |
| 5. Step states            | Each tab names Required and Complete/Incomplete. Ability readiness, energy and support legality contribute to validity. Full Command with no response disables Commit; choosing Disrupt enables it. | Packaged manual flow; visible DOM states.                                                        |
| 6. Surge                  | Framed lightning icon, charge count, explicit disabled/ready state.                                                                                                                                 | Packaged battle header.                                                                          |
| 7. Hero selectors         | Small portraits, army/role context, HP meter, selected check, cyan/gold allied and red rival treatments.                                                                                            | `52-packaged-clash.jpg`.                                                                         |
| 8. Enemy orientation      | Rival cutouts face left, opposed to right-facing allies.                                                                                                                                            | Clash capture and independent unit states.                                                       |
| 9. Portrait-only collapse | Zero command panels remain after both portraits collapse. Faces are square (approximately 64 pixels desktop, 56 compact), with meters inside. Portrait click restores each panel.                   | `51-packaged-general-collapsed.jpg`.                                                             |
| 10. Individual actors     | All six battlefield characters select their own unit; selectors stay visible with panels open. Idle, acting, hit and retaliating states are independent. Pause stops animations.                    | Hit-area audit; `46-combat-paused.jpg`, plus paused combat inspection and packaged manual round. |
| 11. Distinct views        | Plan changes layout to a diagonal grid, Clash to large opposing fighters, Tactical to lane columns with movement/threat paths. Commit switches to Clash; planning returns to Plan.                  | `50-packaged-plan.jpg`, `52-packaged-clash.jpg`, `53-packaged-tactical.jpg`.                     |

Evidence filenames in this section refer to `ux-repair-2026-10-11/`. Earlier captures retain intermediate defects and are not all final-state examples.

### Hands-on audit and repairs

- Desktop battle: 1440 × 900 and 1280 × 720 CSS pixels, both General panels expanded, no document overflow. Packaged build at 1440 × 900 measured document width 1440 and height 900.
- Phone: 390 × 844 and 320 × 700 CSS pixels; setup and battle stay within viewport width. Vertical scrolling is intentional. Controls use a 44-pixel CSS minimum (browser geometry approximately 43.99 due to fractional scaling); primary text is 16 pixels and secondary text 14 pixels.
- A real selection bug was found by clicking Torin on phone: overflowing decorative cutout children intercepted another hero's hit area. Decorative descendants now have `pointer-events: none`. After repair, the center of each of all six character buttons resolves to its own button; clicking Torin selects Torin.
- Enemy stat labels initially overflowed the narrow panel; phone stats now use three columns with values below labels. Phone battlefield duplicate names are reduced while selector names and health remain available.
- Plan art was corrected from an overly bright courtyard to the original dusk fortress direction. Compact Tactical labels and paths were aligned to the actual unit positions, and redundant center advice was removed.
- Two legacy CSS asset URLs were double-prefixed for Vite's base path. They now use public asset paths; the assembled production build has no unresolved-asset warnings. Packaged preview reports zero broken images.
- Full Command: missing response blocks Commit, choosing Disrupt enables it, commitment locks orders and enters the five-beat Clash. The packaged round dealt 38, took 14, denied 12, secured the objective, and reached the round-one debrief/round-two intent. See `54-packaged-combat-debrief.jpg`.
- General powers, consumable items, support weapon and qualifying enemy-General damage were exercised on the dev build. Decree/Smoke/Catapult spent their charges, Malrec's HP decreased, and Aegis showed its cooldown state.
- Watch and Auto Resolve were played through to victory. A mixed run recorded two manual and four AI rounds; Auto recorded zero manual and five AI rounds. No React state injection was used for these browser flows.
- Paused resolution was inspected: acting and hit units differed from the remaining idle units, and each animation was paused. Reduced-motion CSS removes continuous/lunge animation.
- Packaged browser warning/error log: no new warnings or errors during setup, all three views, collapse/expand and the manual combat flow.

### Automated gates

| Gate                       | Result                       | Full log                 |
| -------------------------- | ---------------------------- | ------------------------ |
| Root registry/core tests   | 6 passed                     | `final-repo-tests.log`   |
| Combat engine tests        | 12 passed                    | `final-combat-tests.log` |
| Sites routing/static tests | 4 passed                     | `final-sites-tests.log`  |
| Assembled production build | Passed, no unresolved assets | `final-build.log`        |

The 22 tests validate existing engine and packaging behavior; they are not an automated visual/accessibility certification. Screenshot, bounds and actual-click checks cover this interface pass separately.

### Art archive and remaining limits

- Six generated images were copied into the prototype, saved in the designated Wildcrown Drive image folder, and inserted into the existing Wildcrown Prototype Playbook above their retained source prompts. Existing document text was preserved.
- Characters are independently animated 2D cutouts, not rigged 3D or skeletal actors. Mira's reserve art remains a clearly differentiated crest placeholder rather than a finished character illustration.
- The three views follow the reference compositions but adapt panel anatomy, text and spacing to the user's later usability requirements. Exact image fidelity is not claimed.
- Production is live at `https://wildcrown.vercel.app/prototypes/arena-war-table/`, deployment `dpl_3mwQq1QvmRnXsUfsXxwQwdpUaBQh`. The local packaged preview remains `http://127.0.0.1:4175/prototypes/arena-war-table/`.
- The deployed game was checked through setup, all three views, General collapse/expand, required-choice gating and a real manual combat round (38 dealt, 14 taken, 12 denied). The main domain served the new JavaScript and artwork with no new console warnings/errors. Large artwork can take additional time to load on first visit.
- Full logs and screenshots are retained locally in the evidence folder, not included in this source release. The user authorized production publication and a matching GitHub source push.
