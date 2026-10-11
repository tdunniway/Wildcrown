import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DOCTRINES,
  HERO_LIBRARY,
  abilityIsReady,
  createCombatState,
  getEnemyForecast,
  resolveRound,
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
  const [seconds, setSeconds] = useState(12);
  const [lastImpact, setLastImpact] = useState(null);

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
  const ability = lead
    ? HERO_LIBRARY[lead.name].abilities.find(
        (entry) => entry.id === plan?.abilityId,
      )
    : null;
  const planError =
    combat && plan ? validatePlan(combat, plan) : "Choose a plan.";

  function chooseHero(hero) {
    if (editingSlot === null) return;
    setHeroes((current) =>
      current.map((entry, index) =>
        index === editingSlot ? { name: hero.name, level: hero.level } : entry,
      ),
    );
    setToast(`${hero.name} joins your three`);
    setEditingSlot(null);
  }

  function chooseDoctrine(id) {
    setDoctrine(id);
    setToast(`${DOCTRINES[id].name} doctrine selected`);
  }

  function startCombat() {
    const initial = createCombatState(
      heroes.map((hero) => hero.name),
      doctrine,
    );
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
          setToast(`Round ${next.round} — new rival signals detected`);
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
    setPhase("setup");
    setCombat(null);
    setPlan(null);
    setSeconds(12);
    setLastImpact(null);
    setToast("Adjust your three or opening doctrine");
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
              {heroes.map((hero, index) => (
                <button
                  key={`lane-${index}`}
                  className={`lane-hitbox lane-${index + 1} ${activeLane === index ? "is-active" : ""}`}
                  onClick={() => setActiveLane(index)}
                  aria-label={`Inspect lane ${index + 1}: ${hero.name}, ${HERO_LIBRARY[hero.name].role}`}
                >
                  <span>{hero.name}</span>
                  <strong>{HERO_LIBRARY[hero.name].role}</strong>
                </button>
              ))}
            </div>

            <div
              className="orders-panel doctrine-panel"
              aria-label="Choose an opening doctrine"
            >
              <p className="panel-kicker">Opening doctrine</p>
              {Object.values(DOCTRINES).map((entry, index) => (
                <button
                  className={`order-row ${doctrine === entry.id ? "is-selected" : ""}`}
                  key={entry.id}
                  onClick={() => chooseDoctrine(entry.id)}
                  aria-pressed={doctrine === entry.id}
                  aria-label={`${entry.name}: ${entry.description}`}
                >
                  <span className="order-number">{index + 1}</span>
                  <span className="order-copy">
                    <small>{entry.short}</small>
                    <strong>{entry.name}</strong>
                  </span>
                </button>
              ))}
            </div>

            <button className="commit-button" onClick={startCombat}>
              Enter arena
            </button>
          </>
        ) : combat && plan ? (
          <>
            <header className="combat-header">
              <div className="round-chip">
                <small>Round</small>
                <strong>{combat.round}</strong>
              </div>
              <div
                className={`intent-card ${forecast?.exact ? "is-exact" : "is-uncertain"}`}
              >
                <span className="intent-icon">◉</span>
                <span>
                  <small>
                    {forecast?.exact
                      ? "Scouted rival intent"
                      : `Rival forecast · ${forecast?.confidence}%`}
                  </small>
                  <strong>
                    {forecast?.actorName} · {forecast?.headline}
                  </strong>
                </span>
                <span className="intent-target">
                  {forecast?.targetLabel}
                  <small>{forecast?.description}</small>
                </span>
              </div>
              <div className={`timer-chip ${seconds <= 4 ? "is-urgent" : ""}`}>
                <small>Lock in</small>
                <strong>{seconds}</strong>
              </div>
              <div className="energy-chip">
                <small>Wildlight</small>
                <strong>
                  {"◆".repeat(combat.energy)}
                  <span>{"◇".repeat(5 - combat.energy)}</span>
                </strong>
              </div>
            </header>

            <aside className="squad-status" aria-label="Your squad status">
              <p className="combat-kicker">Choose your lead</p>
              {combat.heroes.map((hero, index) => {
                const threatened = forecast?.targetIds.includes(hero.id);
                return (
                  <button
                    key={hero.id}
                    className={`unit-status ${plan.leadId === hero.id ? "is-selected" : ""} ${threatened ? "is-threatened" : ""} ${hpClass(hero.hp, hero.maxHp)}`}
                    data-risk={forecast?.exact ? "Target" : "At risk"}
                    onClick={() => hero.hp > 0 && selectLead(hero)}
                    disabled={hero.hp <= 0 || phase === "resolving"}
                  >
                    <span className="unit-index">{index + 1}</span>
                    <span className="unit-copy">
                      <strong>{hero.name}</strong>
                      <small>
                        {hero.role}
                        {threatened ? " · under pressure" : ""}
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
                              ? HERO_LIBRARY[hero.name].assist.name
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
              <p className="combat-kicker">Clash read</p>
              {combat.debrief ? (
                <>
                  <strong>{combat.debrief.grade}</strong>
                  <p>{combat.debrief.summary}</p>
                </>
              ) : (
                <>
                  <strong>Signals incomplete</strong>
                  <p>{combat.log[0]}</p>
                </>
              )}
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
