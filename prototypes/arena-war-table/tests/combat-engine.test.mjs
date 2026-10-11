import assert from "node:assert/strict";
import test from "node:test";

import {
  HERO_LIBRARY,
  abilityIsReady,
  createCombatState,
  getEnemyIntent,
  getPlanForecast,
  resolveRound,
  scoreCombat,
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

test("Flank converts a correct support read into damage and momentum", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"], {
    orders: ["Flank", "Press", "Hold"],
  });
  const plan = {
    leadId: "lyra-0",
    abilityId: "quickshot",
    assistId: "brace",
    targetId: "branna-rival",
    crownBreak: false,
  };

  const next = resolveRound(state, plan);

  assert.equal(next.enemies[1].hp, 80);
  assert.equal(next.momentum, 1);
  assert.equal(next.lastClash.doctrineTrigger, "Flank intercept");
  assert.equal(next.lastClash.enemySupportCancelled, true);
});

test("Crown Break spends full momentum and interrupts enemy support", () => {
  const state = {
    ...createCombatState(["Lyra", "Torin", "Vex"]),
    momentum: 3,
  };
  const plan = {
    leadId: "lyra-0",
    abilityId: "quickshot",
    assistId: "brace",
    targetId: "kael",
    crownBreak: true,
  };

  const forecast = getPlanForecast(state, plan);
  const next = resolveRound(state, plan);

  assert.equal(forecast.damageDealt, 38);
  assert.equal(next.enemies[0].hp, 54);
  assert.equal(next.momentum, 0);
  assert.equal(next.stats.crownBreaks, 1);
  assert.equal(next.lastClash.enemySupportCancelled, true);
});

test("elite tiers increase rival durability and threat", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"], { tier: 3 });
  const intent = getEnemyIntent(state);

  assert.equal(state.enemies[0].maxHp, 120);
  assert.equal(intent.damage, 32);
  assert.equal(state.tier, 3);
});

test("completed combat produces a readable score and rank", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  state.outcome = "victory";
  state.stats.doctrineTriggers = 2;
  const result = scoreCombat(state);

  assert.ok(result.score > 0);
  assert.ok(["Steel", "Crown", "Sovereign"].includes(result.rank));
});
