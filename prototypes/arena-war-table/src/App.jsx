import { useCallback, useEffect, useMemo, useState } from "react";
import { clamp } from "@wildcrown/prototype-kit";
import {
  DOCTRINE_LIBRARY,
  HERO_LIBRARY,
  MAX_MOMENTUM,
  abilityIsReady,
  createCombatState,
  getEnemyIntent,
  getPlanForecast,
  resolveRound,
  scoreCombat,
  validatePlan,
} from "./combatEngine.js";

const startingHeroes = [
  { name: "Lyra", level: 58 },
  { name: "Torin", level: 59 },
  { name: "Vex", level: 56 },
];

const reserveHeroes = [
  { name: "Branna", level: 57 },
  { name: "Eldric", level: 55 },
  { name: "Mira", level: 58 },
  { name: "Rook", level: 56 },
];

const orderOptions = ["Flank", "Press", "Hold"];

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
    crownBreak: false,
  };
}

function HealthBar({ value, max, hostile = false }) {
  const percent = clamp((value / max) * 100, 0, 100);
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
  const [orders, setOrders] = useState(["Flank", "Press", "Hold"]);
  const [changedOrders, setChangedOrders] = useState([false, false, false]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [activeLane, setActiveLane] = useState(null);
  const [toast, setToast] = useState("");
  const [phase, setPhase] = useState("setup");
  const [combat, setCombat] = useState(null);
  const [plan, setPlan] = useState(null);
  const [seconds, setSeconds] = useState(12);
  const [lastImpact, setLastImpact] = useState(null);
  const [tier, setTier] = useState(1);

  const available = useMemo(() => {
    const selectedNames = new Set(heroes.map((hero) => hero.name));
    return [...startingHeroes, ...reserveHeroes]
      .filter((hero) => !selectedNames.has(hero.name))
      .map((hero) => ({ ...hero, role: HERO_LIBRARY[hero.name].role }));
  }, [heroes]);

  const intent = useMemo(
    () => (combat ? getEnemyIntent(combat) : null),
    [combat],
  );
  const lead = combat?.heroes.find((hero) => hero.id === plan?.leadId) ?? null;
  const ability = lead
    ? HERO_LIBRARY[lead.name].abilities.find(
        (entry) => entry.id === plan?.abilityId,
      )
    : null;
  const planError =
    combat && plan ? validatePlan(combat, plan) : "Choose a plan.";
  const forecast = useMemo(
    () => (combat && plan && !planError ? getPlanForecast(combat, plan) : null),
    [combat, plan, planError],
  );
  const resultScore = useMemo(
    () => (combat?.outcome ? scoreCombat(combat) : null),
    [combat],
  );

  function chooseHero(hero) {
    if (editingSlot === null) return;
    setHeroes((current) =>
      current.map((entry, index) =>
        index === editingSlot ? { name: hero.name, level: hero.level } : entry,
      ),
    );
    setChangedOrders((current) =>
      current.map((changed, index) => (index === editingSlot ? true : changed)),
    );
    setToast(`${hero.name} joins your three`);
    setEditingSlot(null);
  }

  function cycleOrder(index) {
    setOrders((current) =>
      current.map((order, orderIndex) =>
        orderIndex === index
          ? orderOptions[
              (orderOptions.indexOf(order) + 1) % orderOptions.length
            ]
          : order,
      ),
    );
    setChangedOrders((current) =>
      current.map((changed, orderIndex) =>
        orderIndex === index ? true : changed,
      ),
    );
    setActiveLane(index);
  }

  function startCombat(nextTier = tier) {
    const initial = createCombatState(
      heroes.map((hero) => hero.name),
      { orders, tier: nextTier },
    );
    setTier(nextTier);
    setCombat(initial);
    setPlan(buildDefaultPlan(initial));
    setSeconds(12);
    setLastImpact(null);
    setPhase("battle");
    setToast("Round 1 — read the rival, then answer");
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
    (fallback = false) => {
      if (!combat || !plan || phase !== "battle") return;
      const proposedPlan = fallback ? buildDefaultPlan(combat) : plan;
      const error = validatePlan(combat, proposedPlan);
      if (error) {
        setToast(error);
        return;
      }

      setPhase("resolving");
      setLastImpact({
        targetId: proposedPlan.targetId,
        actorId: proposedPlan.leadId,
      });
      setToast(
        fallback
          ? "Deadline — safe fallback committed"
          : "Plans revealed — clash resolving",
      );

      window.setTimeout(() => {
        const next = resolveRound(combat, proposedPlan);
        setCombat(next);
        if (next.outcome) {
          setPhase("result");
        } else {
          setPlan(buildDefaultPlan(next));
          setSeconds(12);
          setPhase("battle");
          setToast(`Round ${next.round} — enemy intent updated`);
        }
      }, 720);
    },
    [combat, phase, plan],
  );

  useEffect(() => {
    if (phase !== "battle") return undefined;
    const interval = window.setInterval(
      () => setSeconds((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [phase, combat?.round]);

  useEffect(() => {
    if (phase === "battle" && seconds === 0) commitCombat(true);
  }, [commitCombat, phase, seconds]);

  function restart() {
    setTier(1);
    setPhase("setup");
    setCombat(null);
    setPlan(null);
    setSeconds(12);
    setLastImpact(null);
    setToast("Adjust your three or opening orders");
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
          src="/assets/arena-war-table-reference.png"
          alt="Wildcrown Crown Arena war table"
        />
        <div className="screen-vignette" />

        {phase === "setup" ? (
          <>
            <div className="hero-hitboxes" aria-label="Selected champions">
              {heroes.map((hero, index) => (
                <button
                  className={`hero-hitbox ${editingSlot === index ? "is-editing" : ""}`}
                  key={`${hero.name}-${index}`}
                  onClick={() => setEditingSlot(index)}
                  aria-label={`Change ${hero.name}, slot ${index + 1}`}
                >
                  <span className="interaction-label">Change {hero.name}</span>
                  {hero.name !== startingHeroes[index].name && (
                    <span className="selection-badge">
                      {hero.name} selected
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="lane-hitboxes" aria-label="Arena lanes">
              {orders.map((order, index) => (
                <button
                  key={`lane-${index}`}
                  className={`lane-hitbox lane-${index + 1} ${activeLane === index ? "is-active" : ""}`}
                  onClick={() => setActiveLane(index)}
                  aria-label={`Inspect lane ${index + 1}: ${heroes[index].name} will ${order}`}
                >
                  <span>{heroes[index].name}</span>
                  <strong>{order}</strong>
                </button>
              ))}
            </div>

            <div className="orders-panel" aria-label="Opening orders">
              <p className="panel-kicker">Opening orders</p>
              {orders.map((order, index) => (
                <button
                  className={`order-row ${activeLane === index ? "is-active" : ""} ${changedOrders[index] ? "has-change" : ""}`}
                  key={`${heroes[index].name}-${index}`}
                  onClick={() => cycleOrder(index)}
                  aria-label={`Cycle opening order for ${heroes[index].name}. Current order: ${order}`}
                >
                  <span className="order-number">{index + 1}</span>
                  <span className="order-copy">
                    <small>{heroes[index].name}</small>
                    <strong>{order}</strong>
                  </span>
                </button>
              ))}
            </div>

            <button className="commit-button" onClick={() => startCombat(1)}>
              Enter arena
            </button>
          </>
        ) : combat && plan ? (
          <>
            <header className="combat-header">
              <div className="round-chip">
                <small>Tier {combat.tier} · Round</small>
                <strong>{combat.round}</strong>
              </div>
              <div className="intent-card">
                <span className="intent-icon">!</span>
                <span>
                  <small>Revealed rival intent</small>
                  <strong>
                    {intent?.actorName} · {intent?.name}
                  </strong>
                </span>
                <span className="intent-target">
                  Target: {intent?.targetLabel}
                  <small>{intent?.description}</small>
                  {intent?.support ? (
                    <em>Support: {intent.support.label}</em>
                  ) : null}
                </span>
              </div>
              <div className={`timer-chip ${seconds <= 4 ? "is-urgent" : ""}`}>
                <small>Lock in</small>
                <strong>{seconds}</strong>
              </div>
              <div className="energy-chip">
                <small>Wildlight · Momentum</small>
                <strong>
                  {"◆".repeat(combat.energy)}
                  <span>{"◇".repeat(5 - combat.energy)}</span>
                </strong>
                <em>
                  {"●".repeat(combat.momentum)}
                  {"○".repeat(MAX_MOMENTUM - combat.momentum)}
                </em>
              </div>
            </header>

            <aside className="squad-status" aria-label="Your squad status">
              <p className="combat-kicker">Choose your lead</p>
              {combat.heroes.map((hero, index) => {
                const threatened = intent?.targetIds.includes(hero.id);
                return (
                  <button
                    key={hero.id}
                    className={`unit-status ${plan.leadId === hero.id ? "is-selected" : ""} ${threatened ? "is-threatened" : ""} ${hpClass(hero.hp, hero.maxHp)}`}
                    onClick={() => hero.hp > 0 && selectLead(hero)}
                    disabled={hero.hp <= 0 || phase === "resolving"}
                  >
                    <span className="unit-index">{index + 1}</span>
                    <span className="unit-copy">
                      <strong>{hero.name}</strong>
                      <small>
                        {hero.role} · {hero.order}
                        {threatened ? ` · ${intent.name}` : ""}
                      </small>
                      <HealthBar value={hero.hp} max={hero.maxHp} />
                    </span>
                    <span className="hp-copy">{hero.hp}</span>
                  </button>
                );
              })}
            </aside>

            <aside className="rival-status" aria-label="Choose a rival target">
              <p className="combat-kicker">Choose target</p>
              {combat.enemies.map((enemy) => (
                <button
                  key={enemy.id}
                  className={`unit-status is-rival ${plan.targetId === enemy.id ? "is-selected" : ""} ${lastImpact?.targetId === enemy.id && phase === "resolving" ? "is-hit" : ""} ${hpClass(enemy.hp, enemy.maxHp)}`}
                  onClick={() =>
                    enemy.hp > 0 &&
                    setPlan((current) => ({ ...current, targetId: enemy.id }))
                  }
                  disabled={enemy.hp <= 0 || phase === "resolving"}
                >
                  <span className="target-reticle">◎</span>
                  <span className="unit-copy">
                    <strong>{enemy.name}</strong>
                    <small>{enemy.role}</small>
                    <HealthBar value={enemy.hp} max={enemy.maxHp} hostile />
                  </span>
                  <span className="hp-copy">{enemy.hp}</span>
                </button>
              ))}
            </aside>

            <section
              className={`command-deck ${phase === "resolving" ? "is-resolving" : ""}`}
              aria-label="Combat plan controls"
            >
              <div className="command-column ability-column">
                <p className="combat-kicker">
                  <span>1</span> Lead ability · {lead?.name}
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
                          disabled={
                            !ready || !affordable || phase === "resolving"
                          }
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

              <div className="command-column assist-column">
                <p className="combat-kicker">
                  <span>2</span> Support
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
                          disabled={!ready || phase === "resolving"}
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
                    disabled={phase === "resolving"}
                  >
                    <strong>Brace</strong>
                    <small>8 shield · always ready</small>
                  </button>
                </div>
              </div>

              <div className="lock-column">
                <p className="combat-kicker">
                  <span>3</span> Commit
                </p>
                <div className="forecast-panel" aria-live="polite">
                  <span>
                    <strong>{forecast?.damageDealt ?? "—"}</strong> dealt
                  </span>
                  <span>
                    <strong>{forecast?.damageTaken ?? "—"}</strong> taken
                  </span>
                  <small>
                    {forecast?.doctrineTrigger
                      ? `${forecast.doctrineTrigger} · +1 momentum`
                      : (DOCTRINE_LIBRARY[lead?.order]?.short ??
                        "Read the intent")}
                  </small>
                </div>
                <button
                  className={`crown-break ${plan.crownBreak ? "is-selected" : ""}`}
                  onClick={() =>
                    setPlan((current) => ({
                      ...current,
                      crownBreak: !current.crownBreak,
                    }))
                  }
                  disabled={
                    combat.momentum < MAX_MOMENTUM || phase === "resolving"
                  }
                >
                  Crown Break
                  <small>
                    {combat.momentum < MAX_MOMENTUM
                      ? `${MAX_MOMENTUM - combat.momentum} momentum needed`
                      : "+18 · deny support"}
                  </small>
                </button>
                <button
                  className="lock-plan"
                  onClick={() => commitCombat(false)}
                  disabled={Boolean(planError) || phase === "resolving"}
                >
                  {phase === "resolving" ? "Resolving clash…" : "Lock plan"}
                  <small>
                    {planError ||
                      `${ability?.name} → ${combat.enemies.find((enemy) => enemy.id === plan.targetId)?.name}`}
                  </small>
                </button>
              </div>
            </section>

            <section className="combat-log" aria-label="Combat recap">
              <p className="combat-kicker">Last clash</p>
              <p>{combat.log[0]}</p>
              <p>{combat.log[1]}</p>
            </section>
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
                Changing a champion keeps their current lane and opening order.
              </p>
            </aside>
          </div>
        )}

        {phase === "result" && combat && (
          <div className="result-backdrop">
            <section className={`result-card is-${combat.outcome}`}>
              <p className="panel-kicker">
                Tier {combat.tier} complete · {resultScore?.rank} rank
              </p>
              <h1>
                {combat.outcome === "victory"
                  ? "The rival line breaks"
                  : combat.outcome === "defeat"
                    ? "Your crown falls"
                    : "Mutual ruin"}
              </h1>
              <p>
                {combat.outcome === "victory"
                  ? `Victory in ${combat.round} rounds. Your read became the result.`
                  : "Adjust the lead, reserve energy, and answer the revealed threat."}
              </p>
              <div className="result-stats">
                <span>
                  <small>Score</small>
                  <strong>{resultScore?.score}</strong>
                </span>
                <span>
                  <small>Damage</small>
                  <strong>{combat.stats.damageDealt}</strong>
                </span>
                <span>
                  <small>Reads</small>
                  <strong>{combat.stats.doctrineTriggers}</strong>
                </span>
                <span>
                  <small>Breaks</small>
                  <strong>{combat.stats.crownBreaks}</strong>
                </span>
              </div>
              <div className="result-actions">
                <button onClick={restart}>Adjust doctrine</button>
                <button onClick={() => startCombat(combat.tier)}>
                  Replay rival
                </button>
                {combat.outcome === "victory" ? (
                  <button onClick={() => startCombat(combat.tier + 1)}>
                    Challenge tier {combat.tier + 1}
                  </button>
                ) : null}
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
      <section
        className="portrait-notice"
        aria-label="Landscape orientation required"
      >
        <p className="panel-kicker">Crown Arena</p>
        <h1>Rotate to command the war table</h1>
        <p>The combat plan needs the width of a landscape screen.</p>
      </section>
    </main>
  );
}
