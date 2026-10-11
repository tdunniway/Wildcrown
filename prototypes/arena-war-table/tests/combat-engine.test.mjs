import assert from "node:assert/strict";
import test from "node:test";

import {
  HERO_LIBRARY,
  abilityIsReady,
  createCombatState,
  getEnemyIntent,
  resolveRound,
  validatePlan,
} from "../src/combatEngine.js";

function safePlan(state) {
  const lead = state.heroes.find((hero) => hero.hp > 0);
  const target = state.enemies.find((enemy) => enemy.hp > 0);
  const ability = [...HERO_LIBRARY[lead.name].abilities]
    .reverse()
    .find(
      (entry) =>
        entry.cost <= state.energy && abilityIsReady(lead, entry, state.round),
    );
  const assist = state.heroes.find(
    (hero) =>
      hero.hp > 0 &&
      hero.id !== lead.id &&
      hero.assistReadyRound <= state.round,
  );

  return {
    leadId: lead.id,
    abilityId: ability.id,
    assistId: assist?.id ?? "brace",
    targetId: target.id,
  };
}

test("opening state reveals a deterministic, answerable intent", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const intent = getEnemyIntent(state);

  assert.equal(state.energy, 3);
  assert.equal(intent.name, "Crushing Advance");
  assert.equal(intent.targetLabel, "Lyra");
  assert.equal(intent.damage, 26);
});

test("a planned clash spends energy, applies support, and starts cooldowns", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const plan = {
    leadId: "lyra-0",
    abilityId: "arrow-storm",
    assistId: "vex-2",
    targetId: "branna-rival",
  };

  assert.equal(validatePlan(state, plan), null);
  const next = resolveRound(state, plan);

  assert.equal(next.round, 2);
  assert.equal(next.energy, 2);
  assert.deepEqual(
    next.enemies.map((enemy) => enemy.hp),
    [86, 90, 70],
  );
  assert.equal(next.heroes[0].hp, 81);
  assert.equal(
    abilityIsReady(next.heroes[0], HERO_LIBRARY.Lyra.abilities[2], 2),
    false,
  );
  assert.equal(
    abilityIsReady(next.heroes[0], HERO_LIBRARY.Lyra.abilities[2], 4),
    true,
  );
  assert.equal(next.heroes[2].assistReadyRound, 3);
});

test("legal fallback play always reaches a result without deadlocking", () => {
  let state = createCombatState(["Lyra", "Torin", "Vex"]);
  let resolvedRounds = 0;

  while (!state.outcome && resolvedRounds < 30) {
    const plan = safePlan(state);
    assert.equal(validatePlan(state, plan), null);
    state = resolveRound(state, plan);
    resolvedRounds += 1;
  }

  assert.ok(state.outcome, "combat should reach victory, defeat, or draw");
  assert.ok(resolvedRounds < 30, `combat took ${resolvedRounds} rounds`);
});
