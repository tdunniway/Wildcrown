export const MAX_ENERGY = 5;
export const ROUND_RECOVERY = 2;
export const MAX_MOMENTUM = 3;

export const DOCTRINE_LIBRARY = {
  Flank: {
    short: "Intercept support",
    description:
      "Strike the rival supporter for +8 damage and cancel their aid.",
  },
  Press: {
    short: "Punish the actor",
    description: "Strike the acting rival for +6 damage.",
  },
  Hold: {
    short: "Guard the threat",
    description: "Lead while targeted to gain 10 shield.",
  },
};

export const HERO_LIBRARY = {
  Lyra: {
    role: "Ranged",
    assist: {
      name: "Hunter's Eye",
      description: "+8 damage to the marked target",
    },
    abilities: [
      {
        id: "quickshot",
        name: "Quickshot",
        cost: 0,
        cooldown: 0,
        damage: 20,
        description: "Reliable single-target shot.",
      },
      {
        id: "pinning-shot",
        name: "Pinning Shot",
        cost: 2,
        cooldown: 1,
        damage: 28,
        weaken: 6,
        description: "28 damage · weaken the incoming attack by 6.",
      },
      {
        id: "arrow-storm",
        name: "Arrow Storm",
        cost: 3,
        cooldown: 2,
        damage: 18,
        area: true,
        description: "18 damage to every rival.",
      },
    ],
  },
  Torin: {
    role: "Melee",
    assist: { name: "Stand Guard", description: "Give the lead 12 shield" },
    abilities: [
      {
        id: "hammerfall",
        name: "Hammerfall",
        cost: 0,
        cooldown: 0,
        damage: 20,
        description: "Reliable single-target strike.",
      },
      {
        id: "shield-break",
        name: "Shield Break",
        cost: 2,
        cooldown: 1,
        damage: 27,
        pierce: 10,
        description: "27 damage · bypass up to 10 shield.",
      },
      {
        id: "crownshatter",
        name: "Crownshatter",
        cost: 3,
        cooldown: 2,
        damage: 40,
        description: "A costly finishing blow.",
      },
    ],
  },
  Vex: {
    role: "Assassin",
    assist: {
      name: "Smoke Veil",
      description: "Reduce the incoming attack by 7",
    },
    abilities: [
      {
        id: "quick-cut",
        name: "Quick Cut",
        cost: 0,
        cooldown: 0,
        damage: 20,
        description: "Reliable single-target strike.",
      },
      {
        id: "first-blood",
        name: "First Blood",
        cost: 2,
        cooldown: 1,
        damage: 35,
        fullHealthBonus: 8,
        description: "35 damage · +8 against an untouched target.",
      },
      {
        id: "shadowstep",
        name: "Shadowstep",
        cost: 3,
        cooldown: 2,
        damage: 31,
        selfShield: 10,
        description: "31 damage · gain 10 shield for this clash.",
      },
    ],
  },
  Branna: {
    role: "Vanguard",
    assist: { name: "Iron Cover", description: "Give the lead 14 shield" },
    abilities: [
      {
        id: "spear-thrust",
        name: "Spear Thrust",
        cost: 0,
        cooldown: 0,
        damage: 20,
        description: "Reliable single-target strike.",
      },
      {
        id: "hold-line",
        name: "Hold the Line",
        cost: 2,
        cooldown: 1,
        damage: 24,
        selfShield: 14,
        description: "24 damage · gain 14 shield.",
      },
      {
        id: "lion-charge",
        name: "Lion Charge",
        cost: 3,
        cooldown: 2,
        damage: 36,
        description: "Drive through the weakest defense.",
      },
    ],
  },
  Eldric: {
    role: "Warden",
    assist: { name: "Aegis", description: "Give the lead 15 shield" },
    abilities: [
      {
        id: "ward-strike",
        name: "Ward Strike",
        cost: 0,
        cooldown: 0,
        damage: 19,
        description: "Reliable single-target strike.",
      },
      {
        id: "rune-bash",
        name: "Rune Bash",
        cost: 2,
        cooldown: 1,
        damage: 25,
        weaken: 8,
        description: "25 damage · weaken the incoming attack by 8.",
      },
      {
        id: "stone-oath",
        name: "Stone Oath",
        cost: 3,
        cooldown: 2,
        damage: 28,
        selfShield: 18,
        description: "28 damage · gain 18 shield.",
      },
    ],
  },
  Mira: {
    role: "Mage",
    assist: { name: "Mend", description: "Restore 10 HP to the lead" },
    abilities: [
      {
        id: "ember",
        name: "Ember",
        cost: 0,
        cooldown: 0,
        damage: 20,
        description: "Reliable single-target spell.",
      },
      {
        id: "sun-lance",
        name: "Sun Lance",
        cost: 2,
        cooldown: 1,
        damage: 30,
        description: "Focused magical damage.",
      },
      {
        id: "wildfire",
        name: "Wildfire",
        cost: 3,
        cooldown: 2,
        damage: 17,
        area: true,
        description: "17 damage to every rival.",
      },
    ],
  },
  Rook: {
    role: "Skirmisher",
    assist: { name: "Expose", description: "+10 damage to the marked target" },
    abilities: [
      {
        id: "jab",
        name: "Jab",
        cost: 0,
        cooldown: 0,
        damage: 20,
        description: "Reliable single-target attack.",
      },
      {
        id: "feint",
        name: "Feint",
        cost: 2,
        cooldown: 1,
        damage: 26,
        expose: 6,
        description: "26 damage · add 6 exposed damage.",
      },
      {
        id: "perfect-angle",
        name: "Perfect Angle",
        cost: 3,
        cooldown: 2,
        damage: 38,
        pierce: 8,
        description: "38 damage · bypass up to 8 shield.",
      },
    ],
  },
};

export const ENEMY_LIBRARY = [
  { id: "kael", name: "Kael", role: "Duelist", maxHp: 92 },
  { id: "branna-rival", name: "Branna", role: "Vanguard", maxHp: 108 },
  { id: "elara", name: "Elara", role: "Invoker", maxHp: 88 },
];

export function createCombatState(heroNames, options = {}) {
  const tier = options.tier ?? 1;
  const orders = options.orders ?? ["Flank", "Press", "Hold"];
  const enemyBonus = Math.max(0, tier - 1) * 14;
  return {
    round: 1,
    energy: 3,
    momentum: 0,
    tier,
    intentDamageBonus: Math.max(0, tier - 1) * 3,
    heroes: heroNames.map((name, slot) => ({
      id: `${name.toLowerCase()}-${slot}`,
      name,
      role: HERO_LIBRARY[name].role,
      hp: 100,
      maxHp: 100,
      cooldowns: {},
      assistReadyRound: 1,
      order: orders[slot] ?? orders[slot % orders.length] ?? "Press",
    })),
    enemies: ENEMY_LIBRARY.map((enemy) => ({
      ...enemy,
      maxHp: enemy.maxHp + enemyBonus,
      hp: enemy.maxHp + enemyBonus,
      shield: 0,
    })),
    log: [`Tier ${tier}: the rival reveals its opening intent.`],
    stats: {
      roundsResolved: 0,
      damageDealt: 0,
      damageTaken: 0,
      doctrineTriggers: 0,
      crownBreaks: 0,
    },
    outcome: null,
  };
}

const living = (unit) => unit.hp > 0;

export function getEnemyIntent(state) {
  const livingEnemies = state.enemies.filter(living);
  const livingHeroes = state.heroes.filter(living);
  if (!livingEnemies.length || !livingHeroes.length) return null;

  const actor = livingEnemies[(state.round - 1) % livingEnemies.length];
  const support = livingEnemies.find((enemy) => enemy.id !== actor.id);
  const lowestHero = [...livingHeroes].sort(
    (a, b) => a.hp - b.hp || a.id.localeCompare(b.id),
  )[0];
  const highestHero = [...livingHeroes].sort(
    (a, b) => b.hp - a.hp || a.id.localeCompare(b.id),
  )[0];
  const damageBonus = state.intentDamageBonus ?? 0;

  if (state.round % 3 === 2) {
    return {
      actorId: actor.id,
      actorName: actor.name,
      name: "Arcstorm",
      description: `${15 + damageBonus} damage to every living champion`,
      area: true,
      damage: 15 + damageBonus,
      targetIds: livingHeroes.map((hero) => hero.id),
      targetLabel: "All champions",
      support: support
        ? {
            type: "heal",
            source: support.name,
            sourceId: support.id,
            targetId: actor.id,
            amount: 12,
            label: `Reknit ${actor.name} for 12`,
          }
        : null,
    };
  }

  if (state.round % 3 === 0) {
    return {
      actorId: actor.id,
      actorName: actor.name,
      name: "Executioner's Mark",
      description: `${34 + damageBonus} damage to your weakest champion`,
      area: false,
      damage: 34 + damageBonus,
      targetIds: [lowestHero.id],
      targetLabel: lowestHero.name,
      support: support
        ? {
            type: "shield",
            source: support.name,
            sourceId: support.id,
            targetId: actor.id,
            amount: 14,
            label: `Aegis ${actor.name} for 14`,
          }
        : null,
    };
  }

  return {
    actorId: actor.id,
    actorName: actor.name,
    name: "Crushing Advance",
    description: `${26 + damageBonus} damage to your healthiest champion`,
    area: false,
    damage: 26 + damageBonus,
    targetIds: [highestHero.id],
    targetLabel: highestHero.name,
    support: support
      ? {
          type: "shield",
          source: support.name,
          sourceId: support.id,
          targetId: actor.id,
          amount: 12,
          label: `Aegis ${actor.name} for 12`,
        }
      : null,
  };
}

export function abilityIsReady(hero, ability, round) {
  return (hero.cooldowns[ability.id] ?? 1) <= round;
}

export function validatePlan(state, plan) {
  const lead = state.heroes.find((hero) => hero.id === plan.leadId);
  const target = state.enemies.find((enemy) => enemy.id === plan.targetId);
  const ability =
    lead &&
    HERO_LIBRARY[lead.name].abilities.find(
      (entry) => entry.id === plan.abilityId,
    );
  if (!lead || !living(lead)) return "Choose a living lead.";
  if (!target || !living(target)) return "Choose a living rival.";
  if (!ability) return "Choose an ability.";
  if (ability.cost > state.energy) return `You need ${ability.cost} energy.`;
  if (!abilityIsReady(lead, ability, state.round))
    return `${ability.name} is still recovering.`;
  if (plan.crownBreak && state.momentum < MAX_MOMENTUM)
    return "Crown Break needs 3 momentum.";
  if (plan.assistId !== "brace") {
    const assist = state.heroes.find((hero) => hero.id === plan.assistId);
    if (!assist || !living(assist) || assist.id === lead.id)
      return "Choose a different living assistant.";
    if (assist.assistReadyRound > state.round)
      return `${assist.name}'s assist is still recovering.`;
  }
  return null;
}

function applyShieldedDamage(unit, rawDamage, pierce = 0) {
  const shield = unit.shield ?? 0;
  const bypass = Math.min(rawDamage, pierce);
  const absorbable = Math.max(0, rawDamage - bypass);
  const absorbed = Math.min(shield, absorbable);
  const hpLoss = Math.min(unit.hp, rawDamage - absorbed);
  return {
    ...unit,
    hp: Math.max(0, unit.hp - hpLoss),
    shield: Math.max(0, shield - absorbed),
    hpLoss,
    absorbed,
  };
}

export function resolveRound(state, plan) {
  const error = validatePlan(state, plan);
  if (error) throw new Error(error);

  const intent = getEnemyIntent(state);
  const lead = state.heroes.find((hero) => hero.id === plan.leadId);
  const ability = HERO_LIBRARY[lead.name].abilities.find(
    (entry) => entry.id === plan.abilityId,
  );
  const target = state.enemies.find((enemy) => enemy.id === plan.targetId);
  const assist =
    plan.assistId === "brace"
      ? null
      : state.heroes.find((hero) => hero.id === plan.assistId);
  const log = [];
  let heroes = state.heroes.map((hero) => ({ ...hero, shield: 0 }));
  let enemies = state.enemies.map((enemy) => ({ ...enemy, shield: 0 }));
  let incomingReduction = ability.weaken ?? 0;
  let bonusDamage = ability.expose ?? 0;
  let doctrineTrigger = null;
  let enemySupportCancelled = false;

  if (
    !ability.area &&
    lead.order === "Flank" &&
    intent?.support?.sourceId === target.id
  ) {
    bonusDamage += 8;
    doctrineTrigger = "Flank intercept";
    enemySupportCancelled = true;
    log.push(
      `${lead.name} flanks ${target.name}: +8 damage and support denied.`,
    );
  } else if (
    !ability.area &&
    lead.order === "Press" &&
    intent?.actorId === target.id
  ) {
    bonusDamage += 6;
    doctrineTrigger = "Press punish";
    log.push(`${lead.name} presses the acting rival for +6 damage.`);
  } else if (lead.order === "Hold" && intent?.targetIds.includes(lead.id)) {
    heroes = heroes.map((hero) =>
      hero.id === lead.id ? { ...hero, shield: 10 } : hero,
    );
    doctrineTrigger = "Hold guard";
    log.push(`${lead.name} holds against the revealed threat for 10 shield.`);
  }

  if (plan.crownBreak) {
    bonusDamage += 18;
    enemySupportCancelled = true;
    log.push(`${lead.name} unleashes Crown Break for +18 damage.`);
  }

  if (intent?.support && enemySupportCancelled) {
    log.push(
      `${intent.support.source}'s support is interrupted (${intent.support.label}).`,
    );
  } else if (intent?.support?.type === "shield") {
    enemies = enemies.map((enemy) =>
      enemy.id === intent.support.targetId
        ? { ...enemy, shield: intent.support.amount }
        : enemy,
    );
    log.push(
      `${intent.support.source} grants ${intent.support.amount} Aegis to ${intent.actorName}.`,
    );
  }
  if (!enemySupportCancelled && intent?.support?.type === "heal") {
    enemies = enemies.map((enemy) =>
      enemy.id === intent.support.targetId
        ? {
            ...enemy,
            hp: Math.min(enemy.maxHp, enemy.hp + intent.support.amount),
          }
        : enemy,
    );
    log.push(
      `${intent.support.source} restores ${intent.support.amount} HP to ${intent.actorName}.`,
    );
  }

  if (plan.assistId === "brace") {
    heroes = heroes.map((hero) =>
      hero.id === lead.id ? { ...hero, shield: 8 } : hero,
    );
    log.push(`${lead.name} braces for 8 shield.`);
  } else if (assist) {
    const assistName = HERO_LIBRARY[assist.name].assist.name;
    if (["Stand Guard", "Iron Cover", "Aegis"].includes(assistName)) {
      const amount =
        assistName === "Stand Guard"
          ? 12
          : assistName === "Iron Cover"
            ? 14
            : 15;
      heroes = heroes.map((hero) =>
        hero.id === lead.id ? { ...hero, shield: amount } : hero,
      );
      log.push(`${assist.name} gives ${lead.name} ${amount} shield.`);
    } else if (assistName === "Mend") {
      heroes = heroes.map((hero) =>
        hero.id === lead.id
          ? { ...hero, hp: Math.min(hero.maxHp, hero.hp + 10) }
          : hero,
      );
      log.push(`${assist.name} restores 10 HP to ${lead.name}.`);
    } else if (assistName === "Smoke Veil") {
      incomingReduction += 7;
      log.push(`${assist.name} cuts the incoming attack by 7.`);
    } else {
      bonusDamage += assistName === "Expose" ? 10 : 8;
      log.push(
        `${assist.name} marks ${target.name} for +${assistName === "Expose" ? 10 : 8} damage.`,
      );
    }
  }

  if (ability.selfShield) {
    heroes = heroes.map((hero) =>
      hero.id === lead.id
        ? { ...hero, shield: (hero.shield ?? 0) + ability.selfShield }
        : hero,
    );
  }

  const targetAtSnapshot = state.enemies.find(
    (enemy) => enemy.id === target.id,
  );
  const fullHealthBonus =
    targetAtSnapshot.hp === targetAtSnapshot.maxHp
      ? (ability.fullHealthBonus ?? 0)
      : 0;
  const primaryDamage = ability.damage + bonusDamage + fullHealthBonus;
  const damageTargets = ability.area
    ? enemies.filter(living).map((enemy) => enemy.id)
    : [target.id];
  const playerLosses = [];
  enemies = enemies.map((enemy) => {
    if (!damageTargets.includes(enemy.id)) return enemy;
    const raw = ability.area ? ability.damage : primaryDamage;
    const result = applyShieldedDamage(enemy, raw, ability.pierce ?? 0);
    playerLosses.push({
      name: enemy.name,
      hpLoss: result.hpLoss,
      absorbed: result.absorbed,
    });
    return result;
  });
  log.push(
    `${lead.name} uses ${ability.name}: ${playerLosses.map((loss) => `${loss.hpLoss} to ${loss.name}`).join(", ")}.`,
  );

  const enemyLosses = [];
  const incomingDamage = Math.max(0, (intent?.damage ?? 0) - incomingReduction);
  heroes = heroes.map((hero) => {
    if (!intent?.targetIds.includes(hero.id)) return hero;
    const result = applyShieldedDamage(hero, incomingDamage, 0);
    enemyLosses.push({
      name: hero.name,
      hpLoss: result.hpLoss,
      absorbed: result.absorbed,
    });
    return result;
  });
  if (intent)
    log.push(
      `${intent.actorName} uses ${intent.name}: ${enemyLosses.map((loss) => `${loss.hpLoss} to ${loss.name}`).join(", ")}.`,
    );

  const nextRound = state.round + 1;
  heroes = heroes.map((hero) => ({
    ...hero,
    shield: 0,
    cooldowns:
      hero.id === lead.id && ability.cooldown > 0
        ? {
            ...hero.cooldowns,
            [ability.id]: state.round + ability.cooldown + 1,
          }
        : hero.cooldowns,
    assistReadyRound:
      assist?.id === hero.id ? state.round + 2 : hero.assistReadyRound,
  }));
  enemies = enemies.map((enemy) => ({ ...enemy, shield: 0 }));

  const alliesAlive = heroes.some(living);
  const enemiesAlive = enemies.some(living);
  const outcome =
    !alliesAlive && !enemiesAlive
      ? "draw"
      : !enemiesAlive
        ? "victory"
        : !alliesAlive
          ? "defeat"
          : null;
  const energy = outcome
    ? state.energy - ability.cost
    : Math.min(MAX_ENERGY, state.energy - ability.cost + ROUND_RECOVERY);
  const damageDealt = playerLosses.reduce(
    (total, loss) => total + loss.hpLoss,
    0,
  );
  const damageTaken = enemyLosses.reduce(
    (total, loss) => total + loss.hpLoss,
    0,
  );
  const momentum = Math.min(
    MAX_MOMENTUM,
    Math.max(
      0,
      (state.momentum ?? 0) -
        (plan.crownBreak ? MAX_MOMENTUM : 0) +
        (doctrineTrigger ? 1 : 0),
    ),
  );
  const stats = state.stats ?? {
    roundsResolved: 0,
    damageDealt: 0,
    damageTaken: 0,
    doctrineTriggers: 0,
    crownBreaks: 0,
  };

  return {
    ...state,
    round: outcome ? state.round : nextRound,
    energy,
    momentum,
    heroes,
    enemies,
    log: [...log, ...state.log].slice(0, 8),
    stats: {
      roundsResolved: stats.roundsResolved + 1,
      damageDealt: stats.damageDealt + damageDealt,
      damageTaken: stats.damageTaken + damageTaken,
      doctrineTriggers: stats.doctrineTriggers + (doctrineTrigger ? 1 : 0),
      crownBreaks: stats.crownBreaks + (plan.crownBreak ? 1 : 0),
    },
    lastClash: {
      damageDealt,
      damageTaken,
      doctrineTrigger,
      crownBreak: Boolean(plan.crownBreak),
      enemySupportCancelled,
    },
    outcome,
  };
}

export function getPlanForecast(state, plan) {
  const error = validatePlan(state, plan);
  if (error) return { error };
  const next = resolveRound(state, plan);
  return {
    ...next.lastClash,
    energyAfter: next.energy,
    momentumAfter: next.momentum,
  };
}

export function scoreCombat(state) {
  const remainingHealth = state.heroes.reduce(
    (total, hero) => total + hero.hp,
    0,
  );
  const score = Math.max(
    0,
    (state.outcome === "victory" ? 900 : 300) +
      state.tier * 150 +
      remainingHealth * 2 +
      state.stats.doctrineTriggers * 80 +
      state.stats.crownBreaks * 120 -
      state.stats.roundsResolved * 45,
  );
  const rank = score >= 1400 ? "Sovereign" : score >= 1100 ? "Crown" : "Steel";
  return { score, rank };
}
