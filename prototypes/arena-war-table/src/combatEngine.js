export const MAX_ENERGY = 5;
export const ROUND_RECOVERY = 2;

export const COMMAND_STYLES = {
  balanced: {
    id: "balanced",
    name: "Crownwise",
    short: "Counter first, then press",
    description: "Balances survival, counters, chains, and finishing pressure.",
    weights: { damage: 1, safety: 1, prevention: 0.75, combo: 12 },
  },
  aggressive: {
    id: "aggressive",
    name: "Relentless",
    short: "Break the weakest rival",
    description:
      "Prioritizes damage, executions, and Crown Surge opportunities.",
    weights: { damage: 1.45, safety: 0.45, prevention: 0.3, combo: 8 },
  },
  guardian: {
    id: "guardian",
    name: "Iron Oath",
    short: "Preserve the whole line",
    description:
      "Prioritizes hard counters, protection, and low-risk exchanges.",
    weights: { damage: 0.65, safety: 1.5, prevention: 1.2, combo: 10 },
  },
};

export const FORMATIONS = {
  line: {
    id: "line",
    name: "Battle Line",
    code: "BL",
    short: "Stable damage & cover",
    description:
      "A disciplined line that keeps offense and protection balanced.",
  },
  wedge: {
    id: "wedge",
    name: "Crown Wedge",
    code: "CW",
    short: "+9 strike · +4 risk",
    description: "Concentrate the army behind one decisive breakthrough.",
  },
  bulwark: {
    id: "bulwark",
    name: "Shield Wall",
    code: "SW",
    short: "Deny 10 · -3 strike",
    description: "Close ranks to absorb a dangerous rival commitment.",
  },
  crescent: {
    id: "crescent",
    name: "Crescent Line",
    code: "CL",
    short: "Deny 7 volleys · +6 vs focus",
    description:
      "Spread against area fire or fold inward around a focused threat.",
  },
};

export const DOCTRINES = {
  scout: {
    id: "scout",
    name: "Scout",
    short: "Exact opening read",
    description: "Reveal the rival's exact first action and target.",
  },
  fortify: {
    id: "fortify",
    name: "Fortify",
    short: "Soften the opening blow",
    description: "Reduce the rival's first attack by 8 damage.",
  },
  ambush: {
    id: "ambush",
    name: "Ambush",
    short: "Punish the opening",
    description: "Add 8 damage to your first lead action.",
  },
};

export const TACTICS = {
  intercept: {
    id: "intercept",
    name: "Intercept",
    code: "I",
    short: "Stop a focused strike",
    description: "Best against Hunts. Reduce a focused attack by 14.",
  },
  scatter: {
    id: "scatter",
    name: "Scatter",
    code: "S",
    short: "Break the blast pattern",
    description: "Best against Volleys. Reduce damage to every ally by 8.",
  },
  disrupt: {
    id: "disrupt",
    name: "Disrupt",
    code: "D",
    short: "Collapse enemy support",
    description: "Best against Formations. Cancel support and add 12 damage.",
  },
};

export const MOVEMENT_STRATEGIES = {
  direct: {
    id: "direct",
    name: "Direct Attack",
    code: "DA",
    short: "+6 strike damage",
    description: "Drive the lead army straight through the rival line.",
  },
  flank: {
    id: "flank",
    name: "Flanking Attack",
    code: "FA",
    short: "+10 damage · +3 risk",
    description: "Trade safety for a stronger strike around the formation.",
  },
  ranged: {
    id: "ranged",
    name: "Ranged Attack",
    code: "RA",
    short: "+4 damage · deny 4",
    description: "Pressure the rival from distance while limiting retaliation.",
  },
  shield: {
    id: "shield",
    name: "Defensive Shield",
    code: "DS",
    short: "Deny 11 · -4 damage",
    description: "Lock shields and absorb the rival's committed attack.",
  },
};

export const ARMY_TYPES = {
  guard: {
    id: "guard",
    name: "Crown Guard",
    icon: "◆",
    short: "+5 protection",
    description: "Armored infantry that reduces incoming damage.",
  },
  longbows: {
    id: "longbows",
    name: "Dawn Longbows",
    icon: "➶",
    short: "+6 ranged damage",
    description: "Disciplined archers strongest behind a ranged advance.",
  },
  riders: {
    id: "riders",
    name: "Thorn Riders",
    icon: "✦",
    short: "+7 flank damage",
    description: "Fast cavalry built to exploit flanking attacks.",
  },
};

export const GENERAL_ABILITIES = {
  rally: {
    id: "rally",
    name: "Royal Rally",
    icon: "♛",
    short: "+12 damage",
    description: "The General rallies every banner behind the lead strike.",
    cooldown: 3,
  },
  aegis: {
    id: "aegis",
    name: "Crown Aegis",
    icon: "⬡",
    short: "Deny 14",
    description: "Raise a royal ward over the threatened formation.",
    cooldown: 3,
  },
  decree: {
    id: "decree",
    name: "Final Decree",
    icon: "✹",
    short: "+20 damage · once",
    description:
      "Spend the General's once-per-battle command to break the line.",
    charges: 1,
  },
};

export const BATTLE_ITEMS = {
  tonic: { id: "tonic", name: "Field Tonic", icon: "+", short: "Heal lead 18" },
  smoke: { id: "smoke", name: "Smoke Flask", icon: "◌", short: "Deny 9" },
  spark: { id: "spark", name: "Wild Spark", icon: "◆", short: "+9 damage" },
};

export const SUPPORT_WEAPON = {
  id: "catapult",
  name: "Sunfire Catapult",
  icon: "☄",
  short: "+8 to every rival · once",
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

export function createCombatState(heroSelections, doctrine = "scout") {
  return {
    round: 1,
    energy: 3,
    momentum: 0,
    doctrine: DOCTRINES[doctrine] ? doctrine : "scout",
    heroes: heroSelections.map((selection, slot) => {
      const name = typeof selection === "string" ? selection : selection.name;
      const armyId =
        typeof selection === "string"
          ? Object.keys(ARMY_TYPES)[slot % Object.keys(ARMY_TYPES).length]
          : selection.armyId;
      return {
        id: `${name.toLowerCase()}-${slot}`,
        name,
        role: HERO_LIBRARY[name].role,
        armyId: ARMY_TYPES[armyId] ? armyId : "guard",
        hp: 100,
        maxHp: 100,
        cooldowns: {},
        assistReadyRound: 1,
      };
    }),
    enemies: ENEMY_LIBRARY.map((enemy) => ({
      ...enemy,
      hp: enemy.maxHp,
      shield: 0,
    })),
    log: ["The rival line shifts. Read the stance before you commit."],
    debrief: null,
    lastClash: null,
    outcome: null,
    general: {
      id: "seraphine",
      name: "Seraphine Vale",
      title: "The Crown Marshal",
      level: 61,
      command: 84,
      resolve: 76,
      cooldowns: {},
      charges: { decree: 1 },
    },
    enemyGeneral: {
      id: "malrec",
      name: "Malrec Drake",
      title: "The Ash Regent",
      hp: 320,
      maxHp: 320,
      threat: 88,
      guard: 82,
      will: 91,
    },
    items: { tonic: 1, smoke: 1, spark: 1 },
    supportWeaponReady: true,
    stats: {
      rounds: 0,
      manualRounds: 0,
      aiRounds: 0,
      hardCounters: 0,
      combos: 0,
      surges: 0,
      damageDealt: 0,
      damageTaken: 0,
      damagePrevented: 0,
    },
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

  if (state.round % 3 === 2) {
    return {
      actorId: actor.id,
      actorName: actor.name,
      name: "Arcstorm",
      description: "15 damage to every living champion",
      area: true,
      kind: "volley",
      counterTactic: "scatter",
      damage: 15,
      targetIds: livingHeroes.map((hero) => hero.id),
      targetLabel: "All champions",
      support: support
        ? {
            type: "heal",
            source: support.name,
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
      description: "34 damage to your weakest champion",
      area: false,
      kind: "hunt",
      counterTactic: "intercept",
      damage: 34,
      targetIds: [lowestHero.id],
      targetLabel: lowestHero.name,
      support: support
        ? {
            type: "shield",
            source: support.name,
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
    description: "26 damage to your healthiest champion",
    area: false,
    kind: "formation",
    counterTactic: "disrupt",
    damage: 26,
    targetIds: [highestHero.id],
    targetLabel: highestHero.name,
    support: support
      ? {
          type: "shield",
          source: support.name,
          targetId: actor.id,
          amount: 12,
          label: `Aegis ${actor.name} for 12`,
        }
      : null,
  };
}

export function getEnemyForecast(state) {
  const intent = getEnemyIntent(state);
  if (!intent) return null;

  const exact = state.doctrine === "scout" && state.round === 1;
  const signal = intent.area
    ? "Pressure is spreading across every lane"
    : `${intent.targetLabel} is drawing the rival's attention`;

  return {
    actorName: intent.actorName,
    exact,
    confidence: exact ? 100 : state.doctrine === "fortify" ? 62 : 54,
    headline: intent.name,
    targetLabel: exact ? intent.targetLabel : signal,
    description: exact
      ? intent.description
      : `${intent.name} is locked. Its final target remains concealed.`,
    kind: intent.kind,
    counterTactic: intent.counterTactic,
    counterLabel: TACTICS[intent.counterTactic].name,
    targetIds: intent.area
      ? state.heroes.filter(living).map((hero) => hero.id)
      : intent.targetIds,
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
  if (!FORMATIONS[plan.formationId]) return "Choose a formation.";
  if (!TACTICS[plan.tacticId]) return "Choose a tactical response.";
  if (!MOVEMENT_STRATEGIES[plan.movementId])
    return "Choose a movement strategy.";
  if (plan.useSurge && state.momentum < 3)
    return "Build 3 Crown Momentum before using a surge.";
  if (ability.cost > state.energy) return `You need ${ability.cost} energy.`;
  if (!abilityIsReady(lead, ability, state.round))
    return `${ability.name} is still recovering.`;
  if (plan.assistId !== "brace") {
    const assist = state.heroes.find((hero) => hero.id === plan.assistId);
    if (!assist || !living(assist) || assist.id === lead.id)
      return "Choose a different living assistant.";
    if (assist.assistReadyRound > state.round)
      return `${assist.name}'s assist is still recovering.`;
  }
  if (plan.generalAbilityId) {
    const generalAbility = GENERAL_ABILITIES[plan.generalAbilityId];
    if (!generalAbility) return "Choose a valid General ability.";
    if ((state.general?.cooldowns?.[generalAbility.id] ?? 1) > state.round)
      return `${generalAbility.name} is still recovering.`;
    if (
      generalAbility.charges &&
      (state.general?.charges?.[generalAbility.id] ?? 0) <= 0
    )
      return `${generalAbility.name} has already been spent.`;
  }
  if (plan.itemId && (state.items?.[plan.itemId] ?? 0) <= 0)
    return "That battle item has already been used.";
  if (plan.useSupportWeapon && !state.supportWeaponReady)
    return `${SUPPORT_WEAPON.name} has already fired.`;
  if (
    plan.targetGeneral &&
    plan.generalAbilityId !== "decree" &&
    !plan.useSupportWeapon &&
    !ability.area
  )
    return "Choose a breaching attack before targeting the enemy General.";
  return null;
}

function getCombo(lead, ability, assist, tacticId) {
  if (!assist) return null;
  const assistName = HERO_LIBRARY[assist.name].assist.name;

  if (assistName === "Hunter's Eye" && !ability.area)
    return {
      name: "Marked Volley",
      description: "The marked strike gains 6 damage.",
      bonusDamage: 6,
    };
  if (
    ["Stand Guard", "Iron Cover", "Aegis"].includes(assistName) &&
    tacticId === "intercept"
  )
    return {
      name: "Shieldwall",
      description: "The intercept denies 5 more damage.",
      incomingReduction: 5,
    };
  if (assistName === "Smoke Veil" && tacticId === "disrupt")
    return {
      name: "Vanishing Point",
      description: "The disrupted line takes 6 more damage.",
      bonusDamage: 6,
    };
  if (assistName === "Mend" && tacticId === "scatter")
    return {
      name: "Second Wind",
      description: "Every living champion recovers 4 HP.",
      healAll: 4,
    };
  if (
    assistName === "Expose" &&
    ((ability.pierce ?? 0) > 0 || (ability.expose ?? 0) > 0)
  )
    return {
      name: "Open Crown",
      description: "Exploit the opening for 8 more damage.",
      bonusDamage: 8,
    };
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
  const tactic = TACTICS[plan.tacticId];
  const formation = FORMATIONS[plan.formationId];
  const movement = MOVEMENT_STRATEGIES[plan.movementId];
  const army = ARMY_TYPES[lead.armyId] ?? ARMY_TYPES.guard;
  const generalAbility = GENERAL_ABILITIES[plan.generalAbilityId] ?? null;
  const item = BATTLE_ITEMS[plan.itemId] ?? null;
  const tacticMatched = tactic.id === intent?.counterTactic;
  const combo = getCombo(lead, ability, assist, tactic.id);
  const surgeUsed = Boolean(plan.useSurge && state.momentum >= 3);
  const log = [];
  let heroes = state.heroes.map((hero) => ({ ...hero, shield: 0 }));
  let enemies = state.enemies.map((enemy) => ({ ...enemy, shield: 0 }));
  let incomingReduction = ability.weaken ?? 0;
  let bonusDamage = ability.expose ?? 0;
  let supportDisrupted = false;
  const doctrine = DOCTRINES[state.doctrine] ?? DOCTRINES.scout;

  if (tactic.id === "intercept") incomingReduction += tacticMatched ? 14 : 3;
  if (tactic.id === "scatter") incomingReduction += tacticMatched ? 8 : 1;
  if (tactic.id === "disrupt") {
    bonusDamage += tacticMatched ? 12 : 3;
    supportDisrupted = tacticMatched;
  }
  if (combo?.bonusDamage) bonusDamage += combo.bonusDamage;
  if (combo?.incomingReduction) incomingReduction += combo.incomingReduction;
  if (surgeUsed) bonusDamage += 12;
  if (formation.id === "wedge") {
    bonusDamage += 9;
    incomingReduction -= 4;
  }
  if (formation.id === "bulwark") {
    bonusDamage -= 3;
    incomingReduction += 10;
  }
  if (formation.id === "crescent") {
    if (intent?.area) incomingReduction += 7;
    else bonusDamage += 6;
  }
  if (movement.id === "direct") bonusDamage += 6;
  if (movement.id === "flank") {
    bonusDamage += 10;
    incomingReduction -= 3;
  }
  if (movement.id === "ranged") {
    bonusDamage += 4;
    incomingReduction += 4;
  }
  if (movement.id === "shield") {
    bonusDamage -= 4;
    incomingReduction += 11;
  }
  if (army.id === "guard") incomingReduction += 5;
  if (army.id === "longbows" && movement.id === "ranged") bonusDamage += 6;
  if (army.id === "riders" && movement.id === "flank") bonusDamage += 7;
  if (generalAbility?.id === "rally") bonusDamage += 12;
  if (generalAbility?.id === "aegis") incomingReduction += 14;
  if (generalAbility?.id === "decree") bonusDamage += 20;
  if (item?.id === "smoke") incomingReduction += 9;
  if (item?.id === "spark") bonusDamage += 9;
  log.push(
    tacticMatched
      ? `${tactic.name} hard-counters ${intent.name}.`
      : `${tactic.name} offers only a partial answer to ${intent.name}.`,
  );
  if (combo) log.push(`${combo.name}: ${combo.description}`);
  if (surgeUsed) log.push("Crown Surge adds 12 damage to the lead action.");
  log.push(`${formation.name} sets the army's opening shape.`);
  log.push(`${lead.name}'s ${army.name} execute ${movement.name}.`);
  if (generalAbility)
    log.push(`General ${state.general.name} invokes ${generalAbility.name}.`);
  if (item) log.push(`${item.name} is consumed: ${item.short}.`);

  if (state.round === 1 && doctrine.id === "fortify") {
    incomingReduction += 8;
    log.push("Fortify absorbs 8 damage from the opening attack.");
  }
  if (state.round === 1 && doctrine.id === "ambush") {
    bonusDamage += 8;
    log.push("Ambush adds 8 damage to the opening strike.");
  }

  if (supportDisrupted && intent?.support) {
    log.push(`${tactic.name} cancels ${intent.support.source}'s support.`);
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
  if (!supportDisrupted && intent?.support?.type === "heal") {
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

  if (item?.id === "tonic") {
    heroes = heroes.map((hero) =>
      hero.id === lead.id
        ? { ...hero, hp: Math.min(hero.maxHp, hero.hp + 18) }
        : hero,
    );
  }

  if (combo?.healAll) {
    heroes = heroes.map((hero) =>
      living(hero)
        ? { ...hero, hp: Math.min(hero.maxHp, hero.hp + combo.healAll) }
        : hero,
    );
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
    const openingDoctrineBonus =
      state.round === 1 && doctrine.id === "ambush" ? 8 : 0;
    const raw = ability.area
      ? ability.damage + openingDoctrineBonus + bonusDamage
      : primaryDamage;
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
  const supportLosses = [];
  if (plan.useSupportWeapon) {
    enemies = enemies.map((enemy) => {
      if (!living(enemy)) return enemy;
      const result = applyShieldedDamage(enemy, 8, 4);
      supportLosses.push({
        name: enemy.name,
        hpLoss: result.hpLoss,
        absorbed: result.absorbed,
      });
      return result;
    });
    log.push(
      `${SUPPORT_WEAPON.name} strikes every surviving rival: ${supportLosses.map((loss) => `${loss.hpLoss} to ${loss.name}`).join(", ")}.`,
    );
  }

  const generalDamage = plan.targetGeneral
    ? (generalAbility?.id === "decree" ? 28 : 0) +
      (plan.useSupportWeapon ? 18 : 0) +
      (ability.area ? 8 : 0)
    : 0;
  const enemyGeneral = {
    ...state.enemyGeneral,
    hp: Math.max(0, state.enemyGeneral.hp - generalDamage),
  };
  if (generalDamage > 0) {
    log.push(
      `${state.enemyGeneral.name}'s command guard breaks for ${generalDamage} damage.`,
    );
  }

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

  const damageDealt = [...playerLosses, ...supportLosses].reduce(
    (total, loss) => total + loss.hpLoss,
    0,
  ) + generalDamage;
  const damageTaken = enemyLosses.reduce(
    (total, loss) => total + loss.hpLoss,
    0,
  );
  const damagePrevented =
    enemyLosses.reduce((total, loss) => total + loss.absorbed, 0) +
    (intent
      ? Math.min(intent.damage, incomingReduction) * intent.targetIds.length
      : 0);
  const defeatedRivals = enemies.filter(
    (enemy) =>
      enemy.hp <= 0 &&
      state.enemies.find((entry) => entry.id === enemy.id)?.hp > 0,
  ).length;
  const debrief =
    defeatedRivals > 0
      ? {
          grade: "Decisive read",
          summary: `${damageDealt} dealt · ${damageTaken} taken · ${defeatedRivals} rival removed.`,
        }
      : tacticMatched && combo
        ? {
            grade: `${combo.name} chain`,
            summary: `Hard counter · ${damageDealt} dealt · ${damagePrevented} denied · +2 momentum.`,
          }
        : tacticMatched
          ? {
              grade: "Hard counter",
              summary: `${tactic.name} answered ${intent.name}: ${damagePrevented} denied while dealing ${damageDealt}.`,
            }
          : damagePrevented >= 8
            ? {
                grade: "Counter-read held",
                summary: `${damagePrevented} damage denied while dealing ${damageDealt}.`,
              }
            : damageDealt >= damageTaken + 8
              ? {
                  grade: "Favorable trade",
                  summary: `${damageDealt} dealt for ${damageTaken} taken. Pressure is yours.`,
                }
              : {
                  grade:
                    damageTaken > damageDealt
                      ? "Rival found a gap"
                      : "Even exchange",
                  summary: `${damageDealt} dealt for ${damageTaken} taken. Change the read or the support.`,
                };

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
  const enemiesAlive = enemies.some(living) && enemyGeneral.hp > 0;
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
  const momentumGain = (tacticMatched ? 1 : 0) + (combo ? 1 : 0);
  const momentum = surgeUsed
    ? Math.min(3, momentumGain)
    : Math.min(3, state.momentum + momentumGain);
  const priorStats = state.stats ?? {};
  const stats = {
    rounds: (priorStats.rounds ?? 0) + 1,
    manualRounds:
      (priorStats.manualRounds ?? 0) +
      (plan.controlSource === "manual" ? 1 : 0),
    aiRounds:
      (priorStats.aiRounds ?? 0) + (plan.controlSource === "ai" ? 1 : 0),
    hardCounters: (priorStats.hardCounters ?? 0) + (tacticMatched ? 1 : 0),
    combos: (priorStats.combos ?? 0) + (combo ? 1 : 0),
    surges: (priorStats.surges ?? 0) + (surgeUsed ? 1 : 0),
    damageDealt: (priorStats.damageDealt ?? 0) + damageDealt,
    damageTaken: (priorStats.damageTaken ?? 0) + damageTaken,
    damagePrevented: (priorStats.damagePrevented ?? 0) + damagePrevented,
  };
  const general = generalAbility
    ? {
        ...state.general,
        cooldowns: generalAbility.cooldown
          ? {
              ...state.general.cooldowns,
              [generalAbility.id]: state.round + generalAbility.cooldown,
            }
          : state.general.cooldowns,
        charges: generalAbility.charges
          ? {
              ...state.general.charges,
              [generalAbility.id]: Math.max(
                0,
                (state.general.charges?.[generalAbility.id] ?? 0) - 1,
              ),
            }
          : state.general.charges,
      }
    : state.general;
  const items = item
    ? {
        ...state.items,
        [item.id]: Math.max(0, (state.items[item.id] ?? 0) - 1),
      }
    : state.items;

  return {
    ...state,
    round: outcome ? state.round : nextRound,
    energy,
    momentum,
    heroes,
    enemies,
    log: [...log, ...state.log].slice(0, 8),
    debrief,
    lastClash: {
      formationId: formation.id,
      formationName: formation.name,
      tacticId: tactic.id,
      tacticName: tactic.name,
      tacticMatched,
      combo,
      surgeUsed,
      damageDealt,
      damageTaken,
      damagePrevented,
      playerLosses: [...playerLosses, ...supportLosses],
      enemyLosses,
      generalDamage,
      intentName: intent?.name ?? "No enemy action",
      controlSource: plan.controlSource ?? "manual",
    },
    stats,
    general,
    enemyGeneral,
    items,
    supportWeaponReady: plan.useSupportWeapon
      ? false
      : state.supportWeaponReady,
    outcome,
  };
}

export function previewRound(state, plan) {
  const error = validatePlan(state, plan);
  if (error) return { error };
  const next = resolveRound(state, plan);
  const clash = next.lastClash;
  return {
    error: null,
    grade: clash.tacticMatched ? "Hard counter" : "Partial answer",
    outgoing: clash.damageDealt,
    generalDamage: clash.generalDamage,
    incoming: clash.damageTaken,
    prevented: clash.damagePrevented,
    combo: clash.combo,
    surgeUsed: clash.surgeUsed,
    momentumGain: (clash.tacticMatched ? 1 : 0) + (clash.combo ? 1 : 0),
  };
}

function getLegalPlans(state) {
  const plans = [];
  const surgeOptions = state.momentum >= 3 ? [true, false] : [false];
  const heroes = state.heroes.filter(living);
  const enemies = state.enemies.filter(living);

  for (const lead of heroes) {
    const abilities = HERO_LIBRARY[lead.name].abilities.filter(
      (ability) =>
        ability.cost <= state.energy &&
        abilityIsReady(lead, ability, state.round),
    );
    const assists = [
      "brace",
      ...heroes
        .filter(
          (hero) => hero.id !== lead.id && hero.assistReadyRound <= state.round,
        )
        .map((hero) => hero.id),
    ];

    for (const ability of abilities) {
      for (const assistId of assists) {
        for (const target of enemies) {
          for (const formationId of Object.keys(FORMATIONS)) {
            for (const tacticId of Object.keys(TACTICS)) {
              for (const movementId of Object.keys(MOVEMENT_STRATEGIES)) {
                for (const useSurge of surgeOptions) {
                  plans.push({
                    leadId: lead.id,
                    abilityId: ability.id,
                    assistId,
                    targetId: target.id,
                    formationId,
                    tacticId,
                    movementId,
                    useSurge,
                    generalAbilityId: "",
                    itemId: "",
                    useSupportWeapon: false,
                    controlSource: "ai",
                  });
                }
              }
            }
          }
        }
      }
    }
  }
  return plans;
}

export function chooseCommandPlan(state, styleId = "balanced") {
  const style = COMMAND_STYLES[styleId] ?? COMMAND_STYLES.balanced;
  const forecast = getEnemyForecast(state);
  const candidates = getLegalPlans(state).map((plan, index) => {
    const preview = previewRound(state, plan);
    const target = state.enemies.find((enemy) => enemy.id === plan.targetId);
    const lead = state.heroes.find((hero) => hero.id === plan.leadId);
    const ability = HERO_LIBRARY[lead.name].abilities.find(
      (entry) => entry.id === plan.abilityId,
    );
    const executionBonus =
      !ability.area && preview.outgoing >= target.hp ? 34 : 0;
    const endangeredPenalty = state.heroes
      .filter(living)
      .reduce(
        (total, hero) =>
          total + (hero.hp <= 30 && preview.incoming > 0 ? 14 : 0),
        0,
      );
    const score =
      preview.outgoing * style.weights.damage -
      preview.incoming * style.weights.safety +
      preview.prevented * style.weights.prevention +
      (preview.combo ? style.weights.combo : 0) +
      (preview.grade === "Hard counter" ? 18 : 0) +
      executionBonus -
      endangeredPenalty +
      (plan.useSurge ? 7 : 0) -
      ability.cost * (styleId === "guardian" ? 1.2 : 0.35);
    return { plan, preview, lead, ability, target, score, index };
  });

  candidates.sort((a, b) => b.score - a.score || a.index - b.index);
  const best = candidates[0];
  if (!best) return null;
  const assistant =
    best.plan.assistId === "brace"
      ? null
      : state.heroes.find((hero) => hero.id === best.plan.assistId);
  const reasons = [];
  if (best.plan.tacticId === forecast?.counterTactic)
    reasons.push(
      `${TACTICS[best.plan.tacticId].name} hard-counters ${forecast.headline}`,
    );
  if (best.preview.combo) reasons.push(`${best.preview.combo.name} is ready`);
  if (!best.ability.area && best.preview.outgoing >= best.target.hp)
    reasons.push(`${best.target.name} can be removed now`);
  if (best.plan.useSurge) reasons.push("Crown Surge secures the advantage");
  if (!reasons.length)
    reasons.push(
      `${best.preview.outgoing} projected damage for ${best.preview.incoming} incoming`,
    );

  return {
    plan: best.plan,
    preview: best.preview,
    explanation: `${style.name}: ${FORMATIONS[best.plan.formationId].name} sets the line; ${best.lead.name} uses ${best.ability.name}${assistant ? ` with ${assistant.name}` : " while braced"}. ${reasons.join("; ")}.`,
  };
}

export function autoResolveCombat(
  initialState,
  styleId = "balanced",
  maxRounds = 24,
) {
  let state = initialState;
  const decisions = [];
  while (!state.outcome && decisions.length < maxRounds) {
    const choice = chooseCommandPlan(state, styleId);
    if (!choice) break;
    decisions.push({
      round: state.round,
      explanation: choice.explanation,
      plan: choice.plan,
    });
    state = resolveRound(state, choice.plan);
  }
  return { state, decisions };
}

export function getCommandMastery(state) {
  const stats = state.stats ?? {};
  const objectives = [
    {
      id: "read-field",
      name: "Read the Field",
      description: "Land at least 2 hard counters",
      complete: (stats.hardCounters ?? 0) >= 2,
    },
    {
      id: "heroic-chain",
      name: "Hero Support",
      description: "Trigger at least 1 named hero support combo",
      complete: (stats.combos ?? 0) >= 1,
    },
    {
      id: "unbroken-line",
      name: "Unbroken Line",
      description: "Finish with every champion standing",
      complete:
        Boolean(state.outcome) && state.heroes.every((hero) => hero.hp > 0),
    },
  ];
  const victoryBonus = state.outcome === "victory" ? 5 : 0;
  const objectiveBonus =
    objectives.filter((entry) => entry.complete).length * 5;
  return {
    objectives,
    bonusPercent: Math.min(20, victoryBonus + objectiveBonus),
    title:
      objectiveBonus >= 15
        ? "Master Commander"
        : objectiveBonus >= 10
          ? "Field Captain"
          : objectiveBonus >= 5
            ? "Tactician"
            : "Battle Tested",
  };
}
