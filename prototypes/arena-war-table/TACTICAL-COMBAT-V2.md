# Crown Arena — Tactical Combat V2

## Player promise

Read the rival, assemble a three-hero answer, and watch the arena clearly show why the plan succeeded or failed.

## What changed

The original prototype had a useful skeleton—lead, target, ability, support—but most consequences were hidden in text and the round timer could choose for the player. V2 makes the combat decision visible and deliberate:

1. **Read:** Every rival action has a tactical family and a threatened target.
2. **Counter:** Choose Intercept, Scatter, or Disrupt. Each has one strong matchup and a weaker fallback effect.
3. **Chain:** Choose a lead ability and a second hero's assist. Specific pairings create named chains.
4. **Predict:** The clash preview shows outgoing damage, incoming damage, prevented damage, and any chain before commitment.
5. **Resolve:** Battlefield staging, threat states, motion, impact lines, floating values, health transitions, and a short debrief explain the result.

## Tactical grammar

| Rival intent | Best response | Payoff |
| --- | --- | --- |
| Hunt | Intercept | Denies 14 focused damage |
| Volley | Scatter | Denies 8 damage to every threatened ally |
| Formation | Disrupt | Cancels enemy support and adds 12 damage |

A correct counter grants one Crown Momentum. A valid hero chain grants one more. At three momentum, the player can spend Crown Surge for +12 damage. This rewards good reads without adding another resource economy.

## Hero-chain examples

- Hunter's Eye + a single-target ability → **Marked Volley**
- Guard assist + Intercept → **Shieldwall**
- Smoke Veil + Disrupt → **Vanishing Point**
- Mend + Scatter → **Second Wind**
- Expose + a piercing/exposing ability → **Open Crown**

## Reference principles used

- **Kingshot:** The installed 1.14.12 build's hero skill screen uses a strong central focus, clearly highlighted selection, skill levels, and visible upgrade deltas. V2 borrows that clarity of hierarchy, not its visual design or content.
- **Into the Breach:** Enemy attacks are telegraphed so the player's turn is about analyzing and countering a known problem.
- **Darkest Dungeon:** Position, status, party composition, and strong audiovisual feedback make each turn feel consequential.
- **Kingshot / Whiteout-style hero rosters:** Heroes need situational value, not only larger numbers; assists now form explicit tactical chains.

## Next design passes

1. Add two enemy squads with different intent decks and AI personalities.
2. Add persistent battlefield conditions such as burning lanes, broken cover, and rally zones.
3. Give every hero one signature status interaction so roster construction changes the available chains.
4. Add a three-round encounter objective beyond elimination: hold, escort, or crown capture.
5. Replace monogram sigils with final portrait crops once approved character art exists.

## Evaluation criteria

- A new player can explain why damage was prevented after one round.
- Each round presents at least two plausible plans, not one obviously dominant button.
- A full match produces at least one named chain and one Crown Surge opportunity.
- The result of a click is visible on the battlefield before it is explained in text.
- Mobile play never auto-commits a plan.

## Sources

- Century Games, Kingshot: https://www.centurygames.com/games/kingshot/
- Kingshot official site: https://www.kingshot.com/
- Subset Games, Into the Breach: https://www.subsetgames.com/itb.html
- Red Hook Studios, Darkest Dungeon: https://www.darkestdungeon.com/darkest-dungeon/
- Red Hook Studios, The Fire's Edge: https://www.darkestdungeon.com/news/the-fire-s-edge-dlc-releases-august-18th/
