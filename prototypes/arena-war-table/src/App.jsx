import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDashed,
  Crosshair,
  Crown,
  Eye,
  Flag,
  Footprints,
  Grid3X3,
  LockKeyhole,
  Shield,
  Sparkles,
  Swords,
  Target,
  Users,
  WandSparkles,
  Zap,
} from "lucide-react";
import {
  ARMY_TYPES,
  BATTLE_ITEMS,
  COMMAND_STYLES,
  DOCTRINES,
  FORMATIONS,
  GENERAL_ABILITIES,
  HERO_LIBRARY,
  MOVEMENT_STRATEGIES,
  SUPPORT_WEAPON,
  TACTICS,
  autoResolveCombat,
  abilityIsReady,
  chooseCommandPlan,
  createCombatState,
  getCommandMastery,
  getEnemyForecast,
  previewRound,
  resolveRound,
  validatePlan,
} from "./combatEngine.js";
import { CinematicBattlefield } from "./CinematicBattlefield.jsx";

const CONTROL_MODES = {
  auto: {
    id: "auto",
    name: "Auto Resolve",
    short: "Instant result",
    description: "Your commander resolves the full battle immediately.",
  },
  watch: {
    id: "watch",
    name: "Watch",
    short: "AI fights visibly",
    description: "Watch every legal move and take command whenever you want.",
  },
  assist: {
    id: "assist",
    name: "Assisted",
    short: "AI suggests, you decide",
    description:
      "Start with a complete recommendation, then edit or commit it.",
  },
  command: {
    id: "command",
    name: "Full Command",
    short: "Control every order",
    description:
      "Choose formation, strategy, movement, tactic, lead, ability, support, target, and surge.",
  },
};

const startingHeroes = [
  { name: "Lyra", level: 58, armyId: "longbows" },
  { name: "Torin", level: 59, armyId: "guard" },
  { name: "Vex", level: 56, armyId: "riders" },
];

const reserveHeroes = [
  { name: "Branna", level: 57, armyId: "guard" },
  { name: "Eldric", level: 55, armyId: "guard" },
  { name: "Mira", level: 58, armyId: "longbows" },
  { name: "Rook", level: 56, armyId: "riders" },
];

const COMMAND_STEPS = [
  { id: "formation", label: "Formation", Icon: Grid3X3, required: true },
  { id: "strategy", label: "Strategy", Icon: BrainCircuit, required: true },
  { id: "movement", label: "Movement", Icon: Footprints, required: true },
  { id: "response", label: "Response", Icon: Shield, required: true },
  { id: "ability", label: "Ability", Icon: WandSparkles, required: true },
  { id: "support", label: "Support", Icon: Users, required: true },
];

const SETUP_HERO_ICONS = [Crosshair, Shield, Zap];
const CONTROL_MODE_ICONS = {
  auto: Sparkles,
  watch: Eye,
  assist: BrainCircuit,
  command: Swords,
};

const RESOLUTION_BEATS = [
  { label: "Formation", detail: "Armies take their ordered positions." },
  { label: "Support", detail: "General powers and hero support fire." },
  { label: "Ability", detail: "The lead hero commits their ability." },
  { label: "Army strike", detail: "Your commanded army hits the target." },
  { label: "Retaliation", detail: "The rival answers the exposed line." },
];

const MOVEMENT_READS = {
  direct: {
    headline: "Break the center",
    payoff: "+6 strike",
    risk: "No extra cover",
  },
  flank: {
    headline: "Turn the exposed side",
    payoff: "+10 strike",
    risk: "+3 retaliation",
  },
  ranged: {
    headline: "Control the approach",
    payoff: "+4 strike · +4 cover",
    risk: "Lower burst",
  },
  shield: {
    headline: "Absorb the answer",
    payoff: "+11 cover",
    risk: "-4 strike",
  },
};

function buildRoundObjective(forecast, preview) {
  if (!forecast) return null;

  if (forecast.exact) {
    const complete = preview?.grade === "Hard counter";
    return {
      id: "counter",
      title: "Break the rival read",
      detail: `Answer ${forecast.headline} with ${forecast.counterLabel}.`,
      target: "Hard counter",
      predicted: complete,
      progress: complete ? "Counter aligned" : "Counter not aligned",
    };
  }

  if ((forecast.targetIds?.length ?? 0) > 1) {
    const complete = (preview?.prevented ?? 0) >= 10;
    return {
      id: "deny",
      title: "Hold the whole line",
      detail: "Deny at least 10 damage from the incoming area attack.",
      target: "10 damage denied",
      predicted: complete,
      progress: `${preview?.prevented ?? 0} projected`,
    };
  }

  const margin = (preview?.outgoing ?? 0) - (preview?.incoming ?? 0);
  return {
    id: "trade",
    title: "Win the exchange",
    detail: "Deal at least 8 more damage than the rival retaliation.",
    target: "+8 damage trade",
    predicted: margin >= 8,
    progress: `${margin >= 0 ? "+" : ""}${margin} projected`,
  };
}

function evaluateObjective(objective, clash) {
  if (!objective || !clash) return false;
  if (objective.id === "counter") return clash.tacticMatched;
  if (objective.id === "deny") return clash.damagePrevented >= 10;
  return clash.damageDealt - clash.damageTaken >= 8;
}

function hpClass(hp, maxHp) {
  const ratio = hp / maxHp;
  return ratio <= 0.3 ? "is-critical" : ratio <= 0.6 ? "is-wounded" : "";
}

function buildDefaultPlan(state) {
  const lead = state.heroes.find((hero) => hero.hp > 0);
  const assist = state.heroes.find(
    (hero) =>
      hero.hp > 0 &&
      hero.id !== lead?.id &&
      hero.assistReadyRound <= state.round,
  );
  const target = state.enemies.find((enemy) => enemy.hp > 0);
  return {
    leadId: lead?.id ?? "",
    abilityId: lead ? HERO_LIBRARY[lead.name].abilities[0].id : "",
    assistId: assist?.id ?? "brace",
    targetId: target?.id ?? "",
    formationId: "line",
    tacticId: "",
    movementId: "direct",
    useSurge: false,
    generalAbilityId: "",
    itemId: "",
    useSupportWeapon: false,
    targetGeneral: false,
  };
}

function HealthBar({ value, max, hostile = false }) {
  const percent = Math.max(0, (value / max) * 100);
  return (
    <span
      className={`health-track ${hostile ? "is-hostile" : ""}`}
      aria-label={`${value} of ${max} health`}
    >
      <span style={{ width: `${percent}%` }} />
    </span>
  );
}

export function App() {
  const [heroes, setHeroes] = useState(startingHeroes);
  const [doctrine, setDoctrine] = useState("scout");
  const [editingSlot, setEditingSlot] = useState(null);
  const [activeLane, setActiveLane] = useState(null);
  const [toast, setToast] = useState("");
  const [phase, setPhase] = useState("setup");
  const [combat, setCombat] = useState(null);
  const [plan, setPlan] = useState(null);
  const [lastImpact, setLastImpact] = useState(null);
  const [controlMode, setControlMode] = useState("assist");
  const [commandStyle, setCommandStyle] = useState("balanced");
  const [aiInsight, setAiInsight] = useState("");
  const [decisionHistory, setDecisionHistory] = useState([]);
  const [commandStep, setCommandStep] = useState(0);
  const [powerDrawerOpen, setPowerDrawerOpen] = useState(false);
  const [resolutionStep, setResolutionStep] = useState(0);
  const [resolutionDetails, setResolutionDetails] = useState(false);
  const [pendingResolution, setPendingResolution] = useState(null);
  const [resolutionPaused, setResolutionPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [lastObjective, setLastObjective] = useState(null);
  const [viewMode, setViewMode] = useState("plan");

  const available = useMemo(() => {
    const selectedNames = new Set(heroes.map((hero) => hero.name));
    return [...startingHeroes, ...reserveHeroes]
      .filter((hero) => !selectedNames.has(hero.name))
      .map((hero) => ({ ...hero, role: HERO_LIBRARY[hero.name].role }));
  }, [heroes]);

  const forecast = useMemo(
    () => (combat ? getEnemyForecast(combat) : null),
    [combat],
  );
  const lead = combat?.heroes.find((hero) => hero.id === plan?.leadId) ?? null;
  const planError =
    combat && plan ? validatePlan(combat, plan) : "Choose a plan.";
  const preview = useMemo(
    () => (combat && plan ? previewRound(combat, plan) : null),
    [combat, plan],
  );
  const mastery = useMemo(
    () => (combat ? getCommandMastery(combat) : null),
    [combat],
  );
  const tacticalObjective = useMemo(
    () => buildRoundObjective(forecast, preview),
    [forecast, preview],
  );
  const ordersLocked =
    phase === "resolving" ||
    phase === "debrief" ||
    controlMode === "watch" ||
    controlMode === "auto";

  const commandSummaries = [
    FORMATIONS[plan?.formationId]?.name ?? "Choose",
    COMMAND_STYLES[commandStyle]?.name ?? "Choose",
    MOVEMENT_STRATEGIES[plan?.movementId]?.name ?? "Choose",
    TACTICS[plan?.tacticId]?.name ?? "Choose",
    lead
      ? (HERO_LIBRARY[lead.name].abilities.find(
          (entry) => entry.id === plan?.abilityId,
        )?.name ?? "Choose")
      : "Choose lead",
    plan?.assistId === "brace"
      ? "Brace"
      : (combat?.heroes.find((hero) => hero.id === plan?.assistId)?.name ??
        "Choose"),
  ];
  const commandStatuses = [
    Boolean(plan?.formationId),
    Boolean(commandStyle),
    Boolean(plan?.movementId),
    Boolean(plan?.tacticId),
    Boolean(plan?.leadId && plan?.abilityId),
    Boolean(plan?.assistId),
  ];

  const selectedAbility = lead
    ? HERO_LIBRARY[lead.name].abilities.find(
        (entry) => entry.id === plan?.abilityId,
      )
    : null;
  const selectedAssist = combat?.heroes.find(
    (hero) => hero.id === plan?.assistId,
  );
  const movementRead =
    MOVEMENT_READS[plan?.movementId] ?? MOVEMENT_READS.direct;
  const resolutionCallouts = [
    {
      eyebrow: MOVEMENT_STRATEGIES[plan?.movementId]?.name ?? "Formation",
      title: movementRead.headline,
      detail: `${movementRead.payoff} · ${movementRead.risk}`,
    },
    {
      eyebrow: "Support committed",
      title:
        GENERAL_ABILITIES[plan?.generalAbilityId]?.name ??
        selectedAssist?.name ??
        "Defensive brace",
      detail:
        preview?.combo?.name ??
        (plan?.useSupportWeapon
          ? SUPPORT_WEAPON.name
          : "The line reinforces the lead attack."),
    },
    {
      eyebrow: lead?.name ?? "Lead hero",
      title: selectedAbility?.name ?? "Hero ability",
      detail: selectedAbility?.description ?? "The lead hero commits.",
    },
    {
      eyebrow: ARMY_TYPES[lead?.armyId]?.name ?? "Commanded army",
      title: `Strike ${combat?.enemies.find((enemy) => enemy.id === plan?.targetId)?.name ?? "the target"}`,
      detail: `${preview?.outgoing ?? 0} projected total damage`,
    },
    {
      eyebrow: forecast?.actorName ?? "Rival line",
      title: forecast?.headline ?? "Retaliation",
      detail: `${preview?.incoming ?? 0} damage reaches your line · ${preview?.prevented ?? 0} denied`,
    },
  ];

  function chooseHero(hero) {
    if (editingSlot === null) return;
    setHeroes((current) =>
      current.map((entry, index) =>
        index === editingSlot
          ? { name: hero.name, level: hero.level, armyId: entry.armyId }
          : entry,
      ),
    );
    setToast(`${hero.name} joins your three`);
    setEditingSlot(null);
  }

  function chooseDoctrine(id) {
    setDoctrine(id);
    setToast(`${DOCTRINES[id].name} doctrine selected`);
  }

  function assignArmy(index, armyId) {
    setHeroes((current) =>
      current.map((hero, heroIndex) =>
        heroIndex === index ? { ...hero, armyId } : hero,
      ),
    );
    setToast(`${ARMY_TYPES[armyId].name} assigned to ${heroes[index].name}`);
  }

  function getOpeningPlan(state, mode = controlMode) {
    if (mode === "command") return buildDefaultPlan(state);
    return (
      chooseCommandPlan(state, commandStyle)?.plan ?? buildDefaultPlan(state)
    );
  }

  function finishAutoResolve(state) {
    const resolved = autoResolveCombat(state, commandStyle);
    setCombat(resolved.state);
    setDecisionHistory((current) => [...current, ...resolved.decisions]);
    setAiInsight(
      resolved.decisions.at(-1)?.explanation ??
        `${COMMAND_STYLES[commandStyle].name} found no legal order.`,
    );
    setPhase("result");
    setPendingResolution(null);
    setToast(
      `${COMMAND_STYLES[commandStyle].name} resolved ${resolved.decisions.length} clashes`,
    );
  }

  function startCombat() {
    const initial = createCombatState(heroes, doctrine);
    const opening = chooseCommandPlan(initial, commandStyle);
    setCombat(initial);
    setPlan(getOpeningPlan(initial));
    setLastImpact(null);
    setDecisionHistory([]);
    setCommandStep(0);
    setPowerDrawerOpen(false);
    setResolutionStep(0);
    setResolutionDetails(false);
    setPendingResolution(null);
    setResolutionPaused(false);
    setLastObjective(null);
    setViewMode("plan");
    setAiInsight(
      controlMode === "command"
        ? "Full authority is yours. Read the signal and build the answer."
        : (opening?.explanation ?? "The commander is reading the rival line."),
    );
    window.scrollTo({ top: 0, behavior: "auto" });
    if (controlMode === "auto") {
      setPhase("resolving");
      setViewMode("clash");
      setToast("The commander is resolving the battle");
      window.setTimeout(() => finishAutoResolve(initial), 760);
    } else {
      setPhase("battle");
      setToast(
        controlMode === "watch"
          ? "Commander engaged — take control at any time"
          : "Round 1 — read the rival, then answer",
      );
    }
  }

  function selectLead(hero) {
    const firstReady =
      HERO_LIBRARY[hero.name].abilities.find(
        (entry) =>
          abilityIsReady(hero, entry, combat.round) &&
          entry.cost <= combat.energy,
      ) ?? HERO_LIBRARY[hero.name].abilities[0];
    const currentAssist = plan.assistId === hero.id ? "brace" : plan.assistId;
    setPlan((current) => ({
      ...current,
      leadId: hero.id,
      abilityId: firstReady.id,
      assistId: currentAssist,
    }));
  }

  const commitCombat = useCallback(
    (overridePlan = null, source = "manual", explanation = "") => {
      if (!combat || !plan || phase !== "battle") return;
      const proposedPlan = {
        ...(overridePlan ?? plan),
        controlSource: source,
      };
      const error = validatePlan(combat, proposedPlan);
      if (error) {
        setToast(error);
        return;
      }

      setPhase("resolving");
      setViewMode("clash");
      const proposedPreview = previewRound(combat, proposedPlan);
      setLastImpact({
        targetId: proposedPlan.targetId,
        actorId: proposedPlan.leadId,
        tacticId: proposedPlan.tacticId,
        outgoing: proposedPreview?.outgoing ?? 0,
        generalDamage: proposedPreview?.generalDamage ?? 0,
        incoming: proposedPreview?.incoming ?? 0,
      });
      setResolutionStep(0);
      setResolutionDetails(false);
      setResolutionPaused(false);
      setPendingResolution({
        state: combat,
        plan: proposedPlan,
        source,
        explanation,
        objective: tacticalObjective,
      });
      setToast("Plans revealed — clash resolving");
    },
    [combat, phase, plan, tacticalObjective],
  );

  const finishResolution = useCallback(() => {
    if (!pendingResolution) return;
    const {
      state,
      plan: committedPlan,
      source,
      explanation,
      objective,
    } = pendingResolution;
    setPendingResolution(null);
    const next = resolveRound(state, committedPlan);
    setCombat(next);
    setLastObjective({
      ...objective,
      complete: evaluateObjective(objective, next.lastClash),
    });
    if (source === "ai") {
      setDecisionHistory((current) => [
        ...current,
        {
          round: state.round,
          explanation:
            explanation ||
            `${COMMAND_STYLES[commandStyle].name} committed the order.`,
          plan: committedPlan,
        },
      ]);
    }
    if (next.outcome) {
      setPhase("result");
      return;
    }

    const nextChoice = chooseCommandPlan(next, commandStyle);
    setPlan(
      controlMode === "command"
        ? buildDefaultPlan(next)
        : (nextChoice?.plan ?? buildDefaultPlan(next)),
    );
    setAiInsight(
      controlMode === "command"
        ? "Full authority is yours. Build the next answer."
        : (nextChoice?.explanation ?? "No recommendation available."),
    );
    setCommandStep(0);
    setPhase("debrief");
    setViewMode("plan");
    setToast(`${next.debrief.grade} — review the exchange`);
  }, [commandStyle, controlMode, pendingResolution]);

  useEffect(() => {
    if (phase !== "resolving" || !pendingResolution || resolutionPaused)
      return undefined;
    const timer = window.setTimeout(
      () => {
        if (resolutionStep < RESOLUTION_BEATS.length - 1) {
          setResolutionStep((current) => current + 1);
        } else {
          finishResolution();
        }
      },
      (resolutionStep < RESOLUTION_BEATS.length - 1 ? 720 : 920) /
        playbackSpeed,
    );
    return () => window.clearTimeout(timer);
  }, [
    finishResolution,
    pendingResolution,
    phase,
    playbackSpeed,
    resolutionPaused,
    resolutionStep,
  ]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (phase !== "debrief" || controlMode !== "watch") return undefined;
    const timer = window.setTimeout(() => {
      setPhase("battle");
      setToast(`Round ${combat?.round ?? 1} — commander reading the field`);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [combat?.round, controlMode, phase]);

  useEffect(() => {
    if (
      controlMode !== "watch" ||
      phase !== "battle" ||
      !combat ||
      combat.outcome
    )
      return undefined;
    const choice = chooseCommandPlan(combat, commandStyle);
    if (!choice) return undefined;
    const timer = window.setTimeout(
      () => commitCombat(choice.plan, "ai", choice.explanation),
      1100,
    );
    return () => window.clearTimeout(timer);
  }, [combat, commandStyle, commitCombat, controlMode, phase]);

  function changeControlMode(id) {
    setControlMode(id);
    if (!combat || phase === "setup" || phase === "result") return;
    if (id === "auto" && phase === "battle") {
      setPhase("resolving");
      setToast("Commander is resolving the remaining battle");
      window.setTimeout(() => finishAutoResolve(combat), 650);
      return;
    }
    if (id === "command") {
      setPlan(buildDefaultPlan(combat));
      setAiInsight("You took command. Every order is now yours.");
      setToast("Full Command engaged");
      return;
    }
    const choice = chooseCommandPlan(combat, commandStyle);
    if (choice) {
      setPlan(choice.plan);
      setAiInsight(choice.explanation);
    }
    setToast(
      id === "watch"
        ? "Orders delegated — take command at any time"
        : "Assisted Command — review the recommendation",
    );
  }

  function chooseCommandStyle(id) {
    setCommandStyle(id);
    if (combat && phase === "battle" && controlMode !== "command") {
      const choice = chooseCommandPlan(combat, id);
      if (choice) {
        setPlan(choice.plan);
        setAiInsight(choice.explanation);
      }
    }
    setToast(`${COMMAND_STYLES[id].name} commander doctrine selected`);
  }

  function restart() {
    window.scrollTo({ top: 0, behavior: "auto" });
    setPhase("setup");
    setCombat(null);
    setPlan(null);
    setLastImpact(null);
    setAiInsight("");
    setDecisionHistory([]);
    setCommandStep(0);
    setPowerDrawerOpen(false);
    setPendingResolution(null);
    setResolutionPaused(false);
    setLastObjective(null);
    setViewMode("plan");
    setToast("Adjust your three or opening doctrine");
  }

  function continueAfterDebrief() {
    setPhase("battle");
    setViewMode("plan");
    setResolutionStep(0);
    setToast(`Round ${combat.round} — new rival signals detected`);
  }

  function notify(label) {
    setToast(`${label} is outside this Arena prototype`);
  }

  return (
    <main className="prototype-shell">
      <section
        className={`arena-frame phase-${phase}`}
        aria-label="Wildcrown Crown Arena playable prototype"
      >
        <img
          className="arena-reference"
          src={`${import.meta.env.BASE_URL}assets/arena-war-table-reference.png`}
          alt="Wildcrown Crown Arena war table"
        />
        <div className="screen-vignette" />
        <header className="mobile-masthead">
          <span>
            <small>Wildcrown</small>
            <strong>Crown Arena</strong>
          </span>
          <small>
            {phase === "setup"
              ? "Assemble your three"
              : phase === "result"
                ? "Clash complete"
                : `Round ${combat?.round ?? 1} command`}
          </small>
        </header>

        {phase === "setup" ? (
          <section
            className="setup-command-screen"
            aria-label="Battle planning setup"
          >
            <header className="setup-titlebar">
              <span className="setup-crest">
                <Crown aria-hidden="true" />
              </span>
              <span>
                <small>War council</small>
                <h1>Assemble your strike force</h1>
                <p>
                  Choose three heroes, assign their armies, then set how much
                  control you want.
                </p>
              </span>
              <span className="setup-readiness">
                <BadgeCheck aria-hidden="true" />
                <b>3 / 3 ready</b>
              </span>
            </header>

            <div
              className="setup-hero-grid"
              aria-label="Selected champions and armies"
            >
              {heroes.map((hero, index) => {
                const HeroIcon = SETUP_HERO_ICONS[index] ?? Swords;
                return (
                  <article
                    className={`setup-hero-card ${editingSlot === index ? "is-editing" : ""}`}
                    key={`${hero.name}-${index}`}
                  >
                    <div className="setup-hero-card-head">
                      <span className="setup-slot">{index + 1}</span>
                      <span className="setup-hero-medallion">
                        <HeroIcon aria-hidden="true" />
                      </span>
                      <span className="setup-hero-copy">
                        <small>{HERO_LIBRARY[hero.name].role}</small>
                        <strong>{hero.name}</strong>
                        <span>Level {hero.level}</span>
                      </span>
                      <button
                        className="setup-change-hero"
                        onClick={() => setEditingSlot(index)}
                        aria-label={`Change ${hero.name}, slot ${index + 1}`}
                      >
                        Change
                      </button>
                    </div>
                    <label className="setup-army-select">
                      <span>
                        <Flag aria-hidden="true" /> Army command
                      </span>
                      <span className="setup-select-wrap">
                        <select
                          value={hero.armyId}
                          onChange={(event) =>
                            assignArmy(index, event.target.value)
                          }
                          aria-label={`Army commanded by ${hero.name}`}
                        >
                          {Object.values(ARMY_TYPES).map((army) => (
                            <option value={army.id} key={army.id}>
                              {army.name} · {army.short}
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" />
                      </span>
                    </label>
                  </article>
                );
              })}
            </div>

            <div className="setup-options-grid">
              <section
                className="setup-panel setup-doctrine-panel"
                aria-label="Choose an opening doctrine"
              >
                <div className="setup-panel-heading">
                  <Target aria-hidden="true" />
                  <span>
                    <small>Opening doctrine</small>
                    <strong>How do we enter?</strong>
                  </span>
                </div>
                <div className="setup-doctrine-grid">
                  {Object.values(DOCTRINES).map((entry, index) => (
                    <button
                      className={`setup-option-button ${doctrine === entry.id ? "is-selected" : ""}`}
                      key={entry.id}
                      onClick={() => chooseDoctrine(entry.id)}
                      aria-pressed={doctrine === entry.id}
                      title={entry.description}
                    >
                      <span>{index + 1}</span>
                      <span>
                        <strong>{entry.name}</strong>
                        <small>{entry.short}</small>
                      </span>
                      {doctrine === entry.id ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <CircleDashed aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section
                className="setup-panel setup-authority-panel"
                aria-label="Choose battle control"
              >
                <div className="setup-panel-heading">
                  <BrainCircuit aria-hidden="true" />
                  <span>
                    <small>Command authority</small>
                    <strong>{CONTROL_MODES[controlMode].name}</strong>
                  </span>
                </div>
                <p>{CONTROL_MODES[controlMode].description}</p>
                <div className="setup-authority-grid">
                  {Object.values(CONTROL_MODES).map((entry) => {
                    const ModeIcon = CONTROL_MODE_ICONS[entry.id];
                    return (
                      <button
                        key={entry.id}
                        className={
                          controlMode === entry.id ? "is-selected" : ""
                        }
                        onClick={() => changeControlMode(entry.id)}
                        aria-pressed={controlMode === entry.id}
                      >
                        <ModeIcon aria-hidden="true" />
                        <span>
                          <strong>{entry.name}</strong>
                          <small>{entry.short}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <footer className="setup-actionbar">
              <span>
                <LockKeyhole aria-hidden="true" />
                <small>Setup locks after entry</small>
              </span>
              <span className="setup-loadout-summary">
                <b>{DOCTRINES[doctrine].name}</b>
                <i />
                {CONTROL_MODES[controlMode].name}
              </span>
              <button className="commit-button" onClick={startCombat}>
                <span>
                  {controlMode === "auto" ? "Resolve battle" : "Enter arena"}
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
            </footer>
          </section>
        ) : combat && plan ? (
          <>
            <header className="combat-header">
              <div className="round-chip">
                <Flag aria-hidden="true" />
                <span>
                  <small>Round</small>
                  <strong>{combat.round}</strong>
                </span>
              </div>
              <div
                className={`intent-card ${forecast?.exact ? "is-exact" : "is-uncertain"}`}
              >
                <span className="intent-icon">
                  <Eye aria-hidden="true" />
                </span>
                <span>
                  <small>Rival {forecast?.kind} detected</small>
                  <strong>
                    {forecast?.actorName} · {forecast?.headline}
                  </strong>
                </span>
                <span className="intent-target">
                  <Target aria-hidden="true" /> {forecast?.targetLabel}
                </span>
              </div>
              {tacticalObjective && (
                <div
                  className={`header-objective ${tacticalObjective.predicted ? "is-secured" : "is-risk"}`}
                  title={tacticalObjective.detail}
                >
                  <span className="objective-icon">
                    <Crosshair aria-hidden="true" />
                  </span>
                  <span>
                    <small>Round objective</small>
                    <strong>{tacticalObjective.title}</strong>
                    <em>{tacticalObjective.progress}</em>
                  </span>
                </div>
              )}
              <div className="resource-cluster">
                <div className="momentum-chip">
                  <Crown aria-hidden="true" />
                  <span>
                    <small>Crown</small>
                    <strong>{combat.momentum}/3</strong>
                  </span>
                </div>
                <div className="energy-chip">
                  <Sparkles aria-hidden="true" />
                  <span>
                    <small>Wildlight</small>
                    <strong>{combat.energy}/5</strong>
                  </span>
                </div>
              </div>
              <div className="battle-status-actions">
                <label className="authority-select">
                  <span>
                    <BrainCircuit aria-hidden="true" /> Authority
                  </span>
                  <select
                    value={controlMode}
                    onChange={(event) => changeControlMode(event.target.value)}
                    disabled={phase === "resolving"}
                    aria-label="Command authority"
                  >
                    {Object.values(CONTROL_MODES).map((entry) => (
                      <option value={entry.id} key={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <button
                  className={`header-surge ${plan.useSurge ? "is-selected" : ""}`}
                  onClick={() =>
                    setPlan((current) => ({
                      ...current,
                      useSurge: !current.useSurge,
                    }))
                  }
                  disabled={combat.momentum < 3 || ordersLocked}
                  title="Spend 3 Crown Momentum for +12 damage"
                >
                  <span className="surge-orb">
                    <Zap aria-hidden="true" />
                  </span>
                  <span>
                    <small>Power attack</small>
                    <strong>Surge</strong>
                  </span>
                  <b>{combat.momentum}/3</b>
                </button>
                <button
                  className="header-commit"
                  onClick={() => commitCombat()}
                  disabled={Boolean(planError) || ordersLocked}
                >
                  <Swords aria-hidden="true" />
                  <strong>
                    {phase === "resolving" ? "Resolving…" : "Commit"}
                  </strong>
                </button>
              </div>
            </header>

            {false && (
              <section
                className={`battlefield-board movement-${plan.movementId} ${phase === "resolving" ? `is-clashing resolution-beat-${resolutionStep}` : ""} ${resolutionPaused ? "is-paused" : ""}`}
                aria-label="Arena battlefield"
              >
                {phase === "resolving" && (
                  <div className="combat-vfx" aria-hidden="true">
                    <span className="combat-vfx-wash" />
                    <span className="combat-vfx-line" />
                    <span className="combat-vfx-impact" />
                    <strong>{RESOLUTION_BEATS[resolutionStep].label}</strong>
                  </div>
                )}
                <aside
                  className={`general-panel ${powerDrawerOpen ? "is-open" : ""}`}
                  aria-label="Player General and battle support"
                >
                  <div className="general-identity">
                    <span className="general-portrait" aria-hidden="true">
                      S
                    </span>
                    <span>
                      <small>Your General</small>
                      <strong>{combat.general.name}</strong>
                      <em>{combat.general.title}</em>
                    </span>
                  </div>
                  <div
                    className="general-stats"
                    aria-label="General statistics"
                  >
                    <span>
                      <small>Level</small>
                      <strong>{combat.general.level}</strong>
                    </span>
                    <span>
                      <small>Command</small>
                      <strong>{combat.general.command}</strong>
                    </span>
                    <span>
                      <small>Resolve</small>
                      <strong>{combat.general.resolve}</strong>
                    </span>
                  </div>
                  <div className="general-advice">
                    <small>General's advice</small>
                    <strong>
                      {combat.debrief?.grade ?? forecast?.counterLabel}
                    </strong>
                    <p>
                      {combat.debrief?.summary ?? aiInsight ?? combat.log[0]}
                    </p>
                  </div>
                  <button
                    className="general-tools-toggle"
                    onClick={() => setPowerDrawerOpen((current) => !current)}
                    aria-expanded={powerDrawerOpen}
                  >
                    <span>General powers & items</span>
                    <strong>{powerDrawerOpen ? "Close" : "Open"}</strong>
                  </button>
                  <div className="general-tool-group">
                    <small>Command powers · choose one</small>
                    <div className="general-power-grid">
                      {Object.values(GENERAL_ABILITIES).map((entry) => {
                        const readyRound =
                          combat.general.cooldowns[entry.id] ?? 1;
                        const charges = combat.general.charges[entry.id];
                        const available =
                          readyRound <= combat.round &&
                          (charges === undefined || charges > 0);
                        const status =
                          charges !== undefined
                            ? `${charges} use left`
                            : available
                              ? `Ready · ${entry.cooldown} round cooldown`
                              : `Ready round ${readyRound}`;
                        return (
                          <button
                            key={entry.id}
                            className={`general-power ${plan.generalAbilityId === entry.id ? "is-selected" : ""}`}
                            onClick={() =>
                              setPlan((current) => ({
                                ...current,
                                generalAbilityId:
                                  current.generalAbilityId === entry.id
                                    ? ""
                                    : entry.id,
                              }))
                            }
                            disabled={!available || ordersLocked}
                            aria-pressed={plan.generalAbilityId === entry.id}
                            title={entry.description}
                          >
                            <span aria-hidden="true">{entry.icon}</span>
                            <strong>{entry.name}</strong>
                            <small>{entry.short}</small>
                            <em>{status}</em>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="general-tool-group">
                    <small>Quick items · one per clash</small>
                    <div className="battle-item-grid">
                      {Object.values(BATTLE_ITEMS).map((entry) => (
                        <button
                          key={entry.id}
                          className={`battle-item ${plan.itemId === entry.id ? "is-selected" : ""}`}
                          onClick={() =>
                            setPlan((current) => ({
                              ...current,
                              itemId:
                                current.itemId === entry.id ? "" : entry.id,
                            }))
                          }
                          disabled={
                            (combat.items[entry.id] ?? 0) <= 0 || ordersLocked
                          }
                          aria-pressed={plan.itemId === entry.id}
                          title={`${entry.name}: ${entry.short}`}
                        >
                          <span aria-hidden="true">{entry.icon}</span>
                          <strong>{entry.name}</strong>
                          <small>{entry.short}</small>
                          <b>×{combat.items[entry.id] ?? 0}</b>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    className={`support-weapon ${plan.useSupportWeapon ? "is-selected" : ""}`}
                    onClick={() =>
                      setPlan((current) => ({
                        ...current,
                        useSupportWeapon: !current.useSupportWeapon,
                      }))
                    }
                    disabled={!combat.supportWeaponReady || ordersLocked}
                    aria-pressed={plan.useSupportWeapon}
                  >
                    <span aria-hidden="true">{SUPPORT_WEAPON.icon}</span>
                    <span>
                      <small>
                        Support weapon ·{" "}
                        {combat.supportWeaponReady ? "Ready" : "Spent"}
                      </small>
                      <strong>{SUPPORT_WEAPON.name}</strong>
                      <em>{SUPPORT_WEAPON.short}</em>
                    </span>
                  </button>
                </aside>

                <div className="battle-side allied-line">
                  <p className="combat-kicker">Your line · choose lead</p>
                  {combat.heroes.map((hero, index) => {
                    const threatened = forecast?.targetIds.includes(hero.id);
                    const isSupporting = plan.assistId === hero.id;
                    return (
                      <button
                        key={hero.id}
                        className={`battle-unit is-ally ${plan.leadId === hero.id ? "is-selected" : ""} ${threatened ? "is-threatened" : ""} ${lastImpact?.actorId === hero.id && phase === "resolving" && resolutionStep >= 2 && resolutionStep <= 3 ? "is-striking" : ""} ${isSupporting && phase === "resolving" && resolutionStep === 1 ? "is-supporting" : ""} ${threatened && phase === "resolving" && resolutionStep === 4 ? "is-taking-hit" : ""} ${hpClass(hero.hp, hero.maxHp)}`}
                        onClick={() => hero.hp > 0 && selectLead(hero)}
                        disabled={hero.hp <= 0 || ordersLocked}
                      >
                        <span className="lane-number">{index + 1}</span>
                        <span className="unit-sigil">
                          {hero.name.slice(0, 1)}
                        </span>
                        <span className="unit-copy">
                          <strong>{hero.name}</strong>
                          <small>
                            {hero.role}
                            {threatened ? " · threatened" : ""}
                          </small>
                          <span className="army-badge">
                            {ARMY_TYPES[hero.armyId]?.icon}{" "}
                            {ARMY_TYPES[hero.armyId]?.name}
                          </span>
                          <HealthBar value={hero.hp} max={hero.maxHp} />
                        </span>
                        <span className="hp-copy">{hero.hp}</span>
                        {plan.leadId === hero.id && (
                          <span className="unit-tag">Lead {index + 1}</span>
                        )}
                        {phase === "resolving" &&
                          resolutionStep === 1 &&
                          isSupporting && (
                            <span className="floating-number is-support">
                              Support
                            </span>
                          )}
                        {phase === "resolving" &&
                          resolutionStep === 4 &&
                          threatened && (
                            <span className="floating-number is-damage">
                              -{lastImpact?.incoming}
                            </span>
                          )}
                      </button>
                    );
                  })}
                </div>

                <div className="battle-side rival-line">
                  <p className="combat-kicker">Rival line · choose target</p>
                  {combat.enemies.map((enemy, index) => (
                    <button
                      key={enemy.id}
                      className={`battle-unit is-rival ${plan.targetId === enemy.id ? "is-selected" : ""} ${forecast?.actorName === enemy.name ? "is-acting" : ""} ${lastImpact?.targetId === enemy.id && phase === "resolving" && resolutionStep >= 2 && resolutionStep <= 3 ? "is-hit" : ""} ${forecast?.actorName === enemy.name && phase === "resolving" && resolutionStep === 4 ? "is-retaliating" : ""} ${hpClass(enemy.hp, enemy.maxHp)}`}
                      onClick={() =>
                        enemy.hp > 0 &&
                        setPlan((current) => ({
                          ...current,
                          targetId: enemy.id,
                        }))
                      }
                      disabled={enemy.hp <= 0 || ordersLocked}
                    >
                      <span className="lane-number">{index + 1}</span>
                      <span className="unit-sigil">
                        {enemy.name.slice(0, 1)}
                      </span>
                      <span className="unit-copy">
                        <strong>{enemy.name}</strong>
                        <small>
                          {enemy.role}
                          {forecast?.actorName === enemy.name
                            ? " · acting"
                            : ""}
                        </small>
                        <HealthBar value={enemy.hp} max={enemy.maxHp} hostile />
                      </span>
                      <span className="hp-copy">{enemy.hp}</span>
                      {plan.targetId === enemy.id && (
                        <span className="unit-tag">Target</span>
                      )}
                      {lastImpact?.targetId === enemy.id &&
                        phase === "resolving" &&
                        resolutionStep === 2 && (
                          <span className="floating-number is-ability">
                            Ability
                          </span>
                        )}
                      {lastImpact?.targetId === enemy.id &&
                        phase === "resolving" &&
                        resolutionStep === 3 && (
                          <span className="floating-number is-strike">
                            -{lastImpact?.outgoing}
                          </span>
                        )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <CinematicBattlefield
              combat={combat}
              plan={plan}
              setPlan={setPlan}
              phase={phase}
              forecast={forecast}
              lead={lead}
              selectedAbility={selectedAbility}
              lastImpact={lastImpact}
              resolutionStep={resolutionStep}
              resolutionPaused={resolutionPaused}
              ordersLocked={ordersLocked}
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectLead={selectLead}
            />

            <section
              className={`command-deck ${phase === "resolving" ? "is-resolving" : ""}`}
              aria-label="Combat plan controls"
            >
              <div className="command-progress" aria-label="Command sequence">
                {COMMAND_STEPS.map((step, index) => {
                  const StepIcon = step.Icon;
                  const complete = commandStatuses[index];
                  return (
                    <button
                      key={step.id}
                      className={`${commandStep === index ? "is-current" : ""} ${complete ? "is-complete" : "is-incomplete"}`}
                      onClick={() => setCommandStep(index)}
                      disabled={ordersLocked}
                      aria-current={commandStep === index ? "step" : undefined}
                      aria-label={`${index + 1}. ${step.label}, ${step.required ? "required, " : ""}${complete ? "complete" : "incomplete"}: ${commandSummaries[index]}`}
                    >
                      <span className="command-step-icon">
                        <StepIcon aria-hidden="true" />
                      </span>
                      <span className="command-step-copy">
                        <small>
                          {index + 1}. {step.label}
                        </small>
                        <strong>{commandSummaries[index]}</strong>
                      </span>
                      <span className="command-step-status">
                        {complete ? (
                          <Check aria-hidden="true" />
                        ) : (
                          <CircleDashed aria-hidden="true" />
                        )}
                        <small>{complete ? "Complete" : "Required"}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className={`command-column formation-column ${commandStep === 0 ? "is-command-active" : ""}`}
              >
                <p className="combat-kicker">
                  <span>1</span> Army formation
                </p>
                <div className="formation-grid">
                  {Object.values(FORMATIONS).map((entry) => (
                    <button
                      key={entry.id}
                      className={`formation-card ${plan.formationId === entry.id ? "is-selected" : ""}`}
                      onClick={() =>
                        setPlan((current) => ({
                          ...current,
                          formationId: entry.id,
                        }))
                      }
                      disabled={ordersLocked}
                      aria-pressed={plan.formationId === entry.id}
                      title={entry.description}
                    >
                      <span className="formation-code">{entry.code}</span>
                      <span>
                        <strong>{entry.name}</strong>
                        <small>{entry.short}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`command-column strategy-column ${commandStep === 1 ? "is-command-active" : ""}`}
              >
                <p className="combat-kicker">
                  <span>2</span> Commander strategy
                </p>
                <div className="strategy-grid">
                  {Object.values(COMMAND_STYLES).map((entry) => (
                    <button
                      key={entry.id}
                      className={`strategy-card ${commandStyle === entry.id ? "is-selected" : ""}`}
                      onClick={() => chooseCommandStyle(entry.id)}
                      disabled={ordersLocked}
                      aria-pressed={commandStyle === entry.id}
                      title={entry.description}
                    >
                      <strong>{entry.name}</strong>
                      <small>{entry.short}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`command-column movement-column ${commandStep === 2 ? "is-command-active" : ""}`}
              >
                <p className="combat-kicker">
                  <span>3</span> Movement strategy
                </p>
                <div className="movement-grid">
                  {Object.values(MOVEMENT_STRATEGIES).map((entry) => (
                    <button
                      key={entry.id}
                      className={`movement-card ${plan.movementId === entry.id ? "is-selected" : ""} ${ARMY_TYPES[lead?.armyId]?.id === "longbows" && entry.id === "ranged" ? "is-synergy" : ""} ${ARMY_TYPES[lead?.armyId]?.id === "riders" && entry.id === "flank" ? "is-synergy" : ""}`}
                      onClick={() =>
                        setPlan((current) => ({
                          ...current,
                          movementId: entry.id,
                        }))
                      }
                      disabled={ordersLocked}
                      aria-pressed={plan.movementId === entry.id}
                      title={entry.description}
                    >
                      <span className="movement-code">{entry.code}</span>
                      <span>
                        <strong>{entry.name}</strong>
                        <small>{entry.short}</small>
                      </span>
                    </button>
                  ))}
                </div>
                {lead && (
                  <small className="army-synergy-note">
                    {ARMY_TYPES[lead.armyId].icon} {lead.name}'s{" "}
                    {ARMY_TYPES[lead.armyId].name}:{" "}
                    {ARMY_TYPES[lead.armyId].short}
                  </small>
                )}
              </div>

              <div
                className={`command-column tactic-column ${commandStep === 3 ? "is-command-active" : ""}`}
              >
                <p className="combat-kicker">
                  <span>4</span> Tactical response
                </p>
                <div className="tactic-grid">
                  {Object.values(TACTICS).map((entry) => (
                    <button
                      key={entry.id}
                      className={`tactic-card ${plan.tacticId === entry.id ? "is-selected" : ""} ${forecast?.counterTactic === entry.id ? "is-recommended" : ""}`}
                      onClick={() =>
                        setPlan((current) => ({
                          ...current,
                          tacticId: entry.id,
                        }))
                      }
                      disabled={ordersLocked}
                    >
                      <span className="tactic-code">{entry.code}</span>
                      <span>
                        <strong>{entry.name}</strong>
                        <small>{entry.short}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`command-column ability-column ${commandStep === 4 ? "is-command-active" : ""}`}
              >
                <p className="combat-kicker">
                  <span>5</span> Lead ability · {lead?.name}
                </p>
                <div className="ability-grid">
                  {lead &&
                    HERO_LIBRARY[lead.name].abilities.map((entry) => {
                      const ready = abilityIsReady(lead, entry, combat.round);
                      const affordable = entry.cost <= combat.energy;
                      return (
                        <button
                          key={entry.id}
                          className={`ability-card ${plan.abilityId === entry.id ? "is-selected" : ""}`}
                          onClick={() =>
                            setPlan((current) => ({
                              ...current,
                              abilityId: entry.id,
                            }))
                          }
                          disabled={!ready || !affordable || ordersLocked}
                        >
                          <span className="ability-cost">
                            {entry.cost || "—"} ◆
                          </span>
                          <strong>{entry.name}</strong>
                          <small>
                            {ready
                              ? entry.description
                              : `Ready round ${lead.cooldowns[entry.id]}`}
                          </small>
                        </button>
                      );
                    })}
                </div>
              </div>

              <div
                className={`command-column assist-column ${commandStep === 5 ? "is-command-active" : ""}`}
              >
                <p className="combat-kicker">
                  <span>6</span> Hero support
                </p>
                <div className="assist-grid">
                  {combat.heroes
                    .filter((hero) => hero.id !== lead?.id && hero.hp > 0)
                    .map((hero) => {
                      const ready = hero.assistReadyRound <= combat.round;
                      return (
                        <button
                          key={hero.id}
                          className={`assist-card ${plan.assistId === hero.id ? "is-selected" : ""}`}
                          onClick={() =>
                            setPlan((current) => ({
                              ...current,
                              assistId: hero.id,
                            }))
                          }
                          disabled={!ready || ordersLocked}
                        >
                          <strong>{hero.name}</strong>
                          <small>
                            {ready
                              ? `${HERO_LIBRARY[hero.name].assist.name} · ${HERO_LIBRARY[hero.name].assist.description}`
                              : `Ready round ${hero.assistReadyRound}`}
                          </small>
                        </button>
                      );
                    })}
                  <button
                    className={`assist-card ${plan.assistId === "brace" ? "is-selected" : ""}`}
                    onClick={() =>
                      setPlan((current) => ({ ...current, assistId: "brace" }))
                    }
                    disabled={ordersLocked}
                  >
                    <strong>Brace</strong>
                    <small>8 shield · always ready</small>
                  </button>
                </div>
              </div>

              <div className="command-dock-actions">
                <button
                  className="command-back"
                  onClick={() =>
                    setCommandStep((current) => Math.max(0, current - 1))
                  }
                  disabled={commandStep === 0 || ordersLocked}
                >
                  <ArrowLeft aria-hidden="true" /> Back
                </button>
                <span>
                  <small>
                    Step {commandStep + 1} of {COMMAND_STEPS.length}
                  </small>
                  <strong>{COMMAND_STEPS[commandStep].label}</strong>
                </span>
                {commandStep < COMMAND_STEPS.length - 1 ? (
                  <button
                    className="command-next"
                    onClick={() =>
                      setCommandStep((current) =>
                        Math.min(COMMAND_STEPS.length - 1, current + 1),
                      )
                    }
                    disabled={ordersLocked}
                  >
                    Next <ArrowRight aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    className="command-dock-commit"
                    onClick={() => commitCombat()}
                    disabled={Boolean(planError) || ordersLocked}
                  >
                    <Swords aria-hidden="true" /> Commit attack
                  </button>
                )}
              </div>
            </section>

            {phase === "resolving" && pendingResolution && (
              <section
                className={`resolution-stage beat-${resolutionStep}`}
                aria-live="assertive"
              >
                <div className="resolution-heading">
                  <span>
                    <small>Clash sequence</small>
                    <strong>{RESOLUTION_BEATS[resolutionStep].label}</strong>
                  </span>
                  <p>{RESOLUTION_BEATS[resolutionStep].detail}</p>
                </div>
                <div className="resolution-callout">
                  <small>{resolutionCallouts[resolutionStep].eyebrow}</small>
                  <strong>{resolutionCallouts[resolutionStep].title}</strong>
                  <p>{resolutionCallouts[resolutionStep].detail}</p>
                </div>
                <div className="resolution-timeline" aria-hidden="true">
                  {RESOLUTION_BEATS.map((beat, index) => (
                    <span
                      key={beat.label}
                      className={
                        index < resolutionStep
                          ? "is-complete"
                          : index === resolutionStep
                            ? "is-current"
                            : ""
                      }
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
                {resolutionDetails && preview && !preview.error && (
                  <div className="resolution-inspect">
                    <span>
                      <small>Strike</small>
                      <strong>{preview.outgoing}</strong>
                    </span>
                    <span>
                      <small>Retaliation</small>
                      <strong>{preview.incoming}</strong>
                    </span>
                    <span>
                      <small>Denied</small>
                      <strong>{preview.prevented}</strong>
                    </span>
                  </div>
                )}
                <div className="resolution-actions">
                  <button
                    onClick={() => setResolutionPaused((current) => !current)}
                    aria-pressed={resolutionPaused}
                  >
                    {resolutionPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    onClick={() =>
                      setPlaybackSpeed((current) => (current === 1 ? 2 : 1))
                    }
                    aria-label={`Playback speed ${playbackSpeed} times`}
                  >
                    {playbackSpeed}× speed
                  </button>
                  <button
                    onClick={() => setResolutionDetails((current) => !current)}
                  >
                    {resolutionDetails ? "Hide detail" : "Inspect"}
                  </button>
                  <button onClick={finishResolution}>Skip animation</button>
                </div>
              </section>
            )}

            {phase === "debrief" && (
              <section className="round-debrief" aria-live="polite">
                <div className="debrief-grade">
                  <small>Round {combat.round - 1} tactical debrief</small>
                  <h2>{combat.debrief?.grade}</h2>
                  <p>{combat.debrief?.summary}</p>
                </div>
                <div className="debrief-metrics">
                  <span>
                    <small>Damage dealt</small>
                    <strong>{combat.lastClash?.damageDealt ?? 0}</strong>
                  </span>
                  <span>
                    <small>Damage taken</small>
                    <strong>{combat.lastClash?.damageTaken ?? 0}</strong>
                  </span>
                  <span>
                    <small>Damage denied</small>
                    <strong>{combat.lastClash?.damagePrevented ?? 0}</strong>
                  </span>
                </div>
                <div className="debrief-learning">
                  <small>What changed</small>
                  <strong>
                    {combat.lastClash?.tacticMatched
                      ? `${combat.lastClash.tacticName} correctly answered ${combat.lastClash.intentName}.`
                      : `${combat.lastClash?.intentName} slipped past ${combat.lastClash?.tacticName}.`}
                  </strong>
                  <p>
                    {combat.lastClash?.combo
                      ? `${combat.lastClash.combo.name} activated through your Hero Support choice.`
                      : "Try matching the recommended response or changing your support to build a chain."}
                  </p>
                </div>
                {lastObjective && (
                  <div
                    className={`objective-result ${lastObjective.complete ? "is-complete" : "is-missed"}`}
                  >
                    <span>
                      <small>Round objective</small>
                      <strong>
                        {lastObjective.complete ? "Secured" : "Missed"}
                      </strong>
                    </span>
                    <p>{lastObjective.title}</p>
                    <em>
                      {lastObjective.complete
                        ? "Objective completed through deliberate command."
                        : `Next read: ${lastObjective.target}.`}
                    </em>
                  </div>
                )}
                <button
                  className="continue-command"
                  onClick={continueAfterDebrief}
                >
                  Read round {combat.round} intent
                </button>
              </section>
            )}
          </>
        ) : null}

        <nav className="bottom-nav" aria-label="Primary game navigation">
          {["Home", "Heroes", "War Table", "Arena", "Alliance"].map((item) => (
            <button
              key={item}
              className={item === "War Table" ? "is-current" : ""}
              onClick={() => item !== "War Table" && notify(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        {editingSlot !== null && phase === "setup" && (
          <div className="drawer-backdrop" onClick={() => setEditingSlot(null)}>
            <aside
              className="roster-drawer"
              aria-label={`Choose a replacement for ${heroes[editingSlot].name}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="drawer-heading">
                <div>
                  <p className="panel-kicker">Your champions</p>
                  <h2>Replace {heroes[editingSlot].name}</h2>
                </div>
                <button
                  className="close-button"
                  onClick={() => setEditingSlot(null)}
                >
                  Close
                </button>
              </div>
              <div className="roster-list">
                {available.map((hero) => (
                  <button
                    className="roster-option"
                    key={hero.name}
                    onClick={() => chooseHero(hero)}
                  >
                    <span className="roster-monogram">
                      {hero.name.slice(0, 1)}
                    </span>
                    <span>
                      <strong>{hero.name}</strong>
                      <small>
                        Level {hero.level} · {hero.role}
                      </small>
                    </span>
                    <span className="select-copy">Select</span>
                  </button>
                ))}
              </div>
              <p className="drawer-note">
                Changing a champion keeps their current lane and selected
                doctrine.
              </p>
            </aside>
          </div>
        )}

        {phase === "result" && combat && (
          <div className="result-backdrop">
            <section className={`result-card is-${combat.outcome}`}>
              <p className="panel-kicker">Crown Arena complete</p>
              <h1>
                {combat.outcome === "victory"
                  ? "The rival line breaks"
                  : combat.outcome === "defeat"
                    ? "Your crown falls"
                    : "Mutual ruin"}
              </h1>
              <p>
                {combat.debrief?.summary ??
                  "Adjust the doctrine, lead, and support to change the exchange."}
              </p>
              {mastery && (
                <>
                  <div className="mastery-heading">
                    <span>
                      <small>Command mastery</small>
                      <strong>{mastery.title}</strong>
                    </span>
                    <b>+{mastery.bonusPercent}% rewards</b>
                  </div>
                  <div className="mastery-objectives">
                    {mastery.objectives.map((objective) => (
                      <div
                        key={objective.id}
                        className={objective.complete ? "is-complete" : ""}
                      >
                        <span>{objective.complete ? "✓" : "○"}</span>
                        <p>
                          <strong>{objective.name}</strong>
                          <small>{objective.description}</small>
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="battle-ledger">
                    <span>
                      <small>Control</small>
                      <strong>
                        {combat.stats.manualRounds} manual ·{" "}
                        {combat.stats.aiRounds} AI
                      </strong>
                    </span>
                    <span>
                      <small>Damage</small>
                      <strong>{combat.stats.damageDealt} dealt</strong>
                    </span>
                    <span>
                      <small>Defense</small>
                      <strong>{combat.stats.damagePrevented} denied</strong>
                    </span>
                  </div>
                  {decisionHistory.length > 0 && (
                    <p className="last-ai-call">
                      <small>Last commander decision</small>
                      {decisionHistory.at(-1).explanation}
                    </p>
                  )}
                </>
              )}
              <div className="result-actions">
                <button onClick={restart}>Adjust doctrine</button>
                <button onClick={startCombat}>Replay rival</button>
              </div>
            </section>
          </div>
        )}

        {toast && (
          <button
            className="toast"
            onClick={() => setToast("")}
            aria-label="Dismiss message"
          >
            {toast}
          </button>
        )}
      </section>
    </main>
  );
}
