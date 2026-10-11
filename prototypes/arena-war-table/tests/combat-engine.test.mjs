import assert from "node:assert/strict";
import test from "node:test";

import {
  FORMATIONS,
  HERO_LIBRARY,
  TACTICS,
  autoResolveCombat,
  abilityIsReady,
  chooseCommandPlan,
  createCombatState,
  getCommandMastery,
  getEnemyForecast,
  getEnemyIntent,
  previewRound,
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
    formationId: "line",
    tacticId: getEnemyIntent(state).counterTactic,
    movementId: "direct",
    useSurge: false,
    generalAbilityId: "",
    itemId: "",
    useSupportWeapon: false,
  };
}

test("Scout reveals the opening target, then conceals targets without hiding actions", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const intent = getEnemyIntent(state);
  const openingForecast = getEnemyForecast(state);

  assert.equal(state.energy, 3);
  assert.equal(intent.name, "Crushing Advance");
  assert.equal(intent.targetLabel, "Lyra");
  assert.equal(intent.damage, 26);
  assert.equal(openingForecast.exact, true);

  const next = resolveRound(state, safePlan(state));
  const nextForecast = getEnemyForecast(next);
  assert.equal(nextForecast.exact, false);
  assert.equal(nextForecast.headline, "Arcstorm");
  assert.match(nextForecast.description, /final target remains concealed/i);
});

test("opening doctrines create distinct defensive and offensive trades", () => {
  const scoutState = createCombatState(["Lyra", "Torin", "Vex"], "scout");
  const fortifyState = createCombatState(["Lyra", "Torin", "Vex"], "fortify");
  const ambushState = createCombatState(["Lyra", "Torin", "Vex"], "ambush");

  const scout = resolveRound(scoutState, safePlan(scoutState));
  const fortify = resolveRound(fortifyState, safePlan(fortifyState));
  const ambush = resolveRound(ambushState, safePlan(ambushState));

  assert.ok(fortify.heroes[0].hp > scout.heroes[0].hp);
  assert.ok(ambush.enemies[0].hp < scout.enemies[0].hp);
  assert.equal(fortify.debrief.grade, "Hard counter");
});

test("a planned clash spends energy, applies support, and starts cooldowns", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const plan = {
    leadId: "lyra-0",
    abilityId: "arrow-storm",
    assistId: "vex-2",
    targetId: "branna-rival",
    formationId: "line",
    tacticId: "disrupt",
    movementId: "ranged",
    useSurge: false,
    generalAbilityId: "",
    itemId: "",
    useSupportWeapon: false,
  };

  assert.equal(validatePlan(state, plan), null);
  const next = resolveRound(state, plan);

  assert.equal(next.round, 2);
  assert.equal(next.energy, 2);
  assert.deepEqual(
    next.enemies.map((enemy) => enemy.hp),
    [52, 68, 48],
  );
  assert.equal(next.heroes[0].hp, 90);
  assert.equal(next.lastClash.tacticMatched, true);
  assert.equal(next.lastClash.combo.name, "Vanishing Point");
  assert.equal(next.momentum, 2);
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

test("each enemy intent exposes a distinct tactical counter and preview", () => {
  let state = createCombatState(["Lyra", "Torin", "Vex"]);

  for (const expected of ["disrupt", "scatter", "intercept"]) {
    const intent = getEnemyIntent(state);
    assert.equal(intent.counterTactic, expected);
    assert.ok(TACTICS[expected]);

    const plan = safePlan(state);
    const preview = previewRound(state, plan);
    assert.equal(preview.error, null);
    assert.equal(preview.grade, "Hard counter");
    assert.ok(preview.prevented > 0 || expected === "disrupt");
    state = resolveRound(state, plan);
  }
});

test("hero armies reward matching movement strategies", () => {
  const state = createCombatState([
    { name: "Lyra", armyId: "longbows" },
    { name: "Torin", armyId: "guard" },
    { name: "Vex", armyId: "riders" },
  ]);
  const rangedPlan = {
    ...safePlan(state),
    leadId: "lyra-0",
    abilityId: "quickshot",
    movementId: "ranged",
  };
  const directPlan = { ...rangedPlan, movementId: "direct" };

  const ranged = previewRound(state, rangedPlan);
  const direct = previewRound(state, directPlan);

  assert.ok(
    ranged.outgoing > direct.outgoing,
    "longbows should improve ranged attacks",
  );
  assert.ok(
    ranged.prevented > direct.prevented,
    "ranged movement should reduce retaliation",
  );
});

test("formations create distinct offensive and defensive trades", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const base = safePlan(state);
  const wedge = previewRound(state, { ...base, formationId: "wedge" });
  const bulwark = previewRound(state, { ...base, formationId: "bulwark" });

  assert.ok(FORMATIONS.wedge);
  assert.ok(wedge.outgoing > bulwark.outgoing);
  assert.ok(bulwark.incoming < wedge.incoming);
});

test("General powers, items, and the support weapon are limited resources", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const plan = {
    ...safePlan(state),
    generalAbilityId: "decree",
    itemId: "spark",
    useSupportWeapon: true,
  };

  const preview = previewRound(state, plan);
  const next = resolveRound(state, plan);

  assert.ok(preview.outgoing >= 60);
  assert.equal(next.general.charges.decree, 0);
  assert.equal(next.items.spark, 0);
  assert.equal(next.supportWeaponReady, false);
  assert.match(
    validatePlan(next, { ...safePlan(next), generalAbilityId: "decree" }),
    /already been spent/i,
  );
  assert.match(
    validatePlan(next, { ...safePlan(next), itemId: "spark" }),
    /already been used/i,
  );
  assert.match(
    validatePlan(next, { ...safePlan(next), useSupportWeapon: true }),
    /already fired/i,
  );
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

test("commander styles produce legal, explainable orders", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);

  for (const style of ["balanced", "aggressive", "guardian"]) {
    const choice = chooseCommandPlan(state, style);
    assert.ok(choice);
    assert.equal(validatePlan(state, choice.plan), null);
    assert.match(choice.explanation, /Lyra|Torin|Vex/);
    assert.ok(choice.preview.outgoing > 0);
  }
});

test("auto resolve reaches a result and records every AI decision", () => {
  const initial = createCombatState(["Lyra", "Torin", "Vex"]);
  const resolved = autoResolveCombat(initial, "balanced");

  assert.ok(resolved.state.outcome);
  assert.equal(resolved.state.stats.rounds, resolved.decisions.length);
  assert.equal(resolved.state.stats.aiRounds, resolved.decisions.length);
  assert.equal(resolved.state.stats.manualRounds, 0);
  assert.ok(resolved.decisions.every((decision) => decision.explanation));
});

test("command mastery awards bonuses for victory and optional objectives", () => {
  const state = createCombatState(["Lyra", "Torin", "Vex"]);
  const mastery = getCommandMastery({
    ...state,
    outcome: "victory",
    stats: {
      ...state.stats,
      hardCounters: 2,
      combos: 1,
    },
  });

  assert.equal(mastery.title, "Master Commander");
  assert.equal(mastery.bonusPercent, 20);
  assert.ok(mastery.objectives.every((objective) => objective.complete));
});
