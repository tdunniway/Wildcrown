import { useCallback, useMemo, useState } from "react";
import {
  DOCTRINES,
  HERO_LIBRARY,
  TACTICS,
  abilityIsReady,
  createCombatState,
  getEnemyForecast,
  previewRound,
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
    tacticId: "",
    useSurge: false,
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
  const tactic = TACTICS[plan?.tacticId] ?? null;
  const planError =
    combat && plan ? validatePlan(combat, plan) : "Choose a plan.";
  const preview = useMemo(
    () => (combat && plan ? previewRound(combat, plan) : null),
    [combat, plan],
  );

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
    () => {
      if (!combat || !plan || phase !== "battle") return;
      const proposedPlan = plan;
      const error = validatePlan(combat, proposedPlan);
      if (error) {
        setToast(error);
        return;
      }

      setPhase("resolving");
      setLastImpact({
        targetId: proposedPlan.targetId,
        actorId: proposedPlan.leadId,
        tacticId: proposedPlan.tacticId,
        outgoing: preview?.outgoing ?? 0,
        incoming: preview?.incoming ?? 0,
      });
      setToast("Plans revealed — clash resolving");

      window.setTimeout(() => {
        const next = resolveRound(combat, proposedPlan);
        setCombat(next);
        if (next.outcome) {
          setPhase("result");
        } else {
          setPlan(buildDefaultPlan(next));
          setPhase("battle");
          setToast(`Round ${next.round} — new rival signals detected`);
        }
      }, 720);
    },
    [combat, phase, plan, preview],
  );

  function restart() {
    setPhase("setup");
    setCombat(null);
    setPlan(null);
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
                <span className="intent-icon">!</span>
                <span>
                  <small>{forecast?.kind} intent detected</small>
                  <strong>
                    {forecast?.actorName} · {forecast?.headline}
                  </strong>
                </span>
                <span className="intent-target">
                  {forecast?.targetLabel}
                  <small>{forecast?.description}</small>
                </span>
              </div>
              <div className="momentum-chip">
                <small>Crown</small>
                <strong>{combat.momentum}/3</strong>
              </div>
              <div className="energy-chip">
                <small>Wildlight</small>
                <strong>
                  {"◆".repeat(combat.energy)}
                  <span>{"◇".repeat(5 - combat.energy)}</span>
                </strong>
              </div>
            </header>

            <section
              className={`battlefield-board ${phase === "resolving" ? "is-clashing" : ""}`}
              aria-label="Arena battlefield"
            >
              <div className="battle-side allied-line">
                <p className="combat-kicker">Your line · choose lead</p>
                {combat.heroes.map((hero, index) => {
                  const threatened = forecast?.targetIds.includes(hero.id);
                  return (
                    <button
                      key={hero.id}
                      className={`battle-unit is-ally ${plan.leadId === hero.id ? "is-selected" : ""} ${threatened ? "is-threatened" : ""} ${lastImpact?.actorId === hero.id && phase === "resolving" ? "is-striking" : ""} ${hpClass(hero.hp, hero.maxHp)}`}
                      onClick={() => hero.hp > 0 && selectLead(hero)}
                      disabled={hero.hp <= 0 || phase === "resolving"}
                    >
                      <span className="unit-sigil">{hero.name.slice(0, 1)}</span>
                      <span className="unit-copy">
                        <strong>{hero.name}</strong>
                        <small>
                          {hero.role}
                          {threatened ? " · threatened" : ""}
                        </small>
                        <HealthBar value={hero.hp} max={hero.maxHp} />
                      </span>
                      <span className="hp-copy">{hero.hp}</span>
                      {plan.leadId === hero.id && (
                        <span className="unit-tag">Lead {index + 1}</span>
                      )}
                      {phase === "resolving" && threatened && (
                        <span className="floating-number is-damage">
                          -{lastImpact?.incoming}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="clash-core" aria-live="polite">
                <div className="intent-rune">
                  <small>Rival move</small>
                  <strong>{forecast?.headline}</strong>
                  <span>{forecast?.description}</span>
                </div>
                <div className="counter-callout">
                  <small>Best response</small>
                  <strong>{forecast?.counterLabel}</strong>
                  <span>
                    {tactic
                      ? tactic.id === forecast?.counterTactic
                        ? "Counter aligned"
                        : "Line remains exposed"
                      : "Choose your tactic"}
                  </span>
                </div>
                {preview && !preview.error && (
                  <div
                    className={`clash-preview ${preview.grade === "Hard counter" ? "is-counter" : "is-partial"}`}
                  >
                    <strong>{preview.grade}</strong>
                    <span>{preview.outgoing} outgoing</span>
                    <span>{preview.incoming} incoming</span>
                    <span>{preview.prevented} denied</span>
                    {preview.combo && <b>{preview.combo.name} chain</b>}
                  </div>
                )}
                {phase === "resolving" && (
                  <div className={`clash-fx is-${lastImpact?.tacticId}`}>
                    <span />
                    <strong>
                      {preview?.combo?.name ?? tactic?.name ?? "Clash"}
                    </strong>
                  </div>
                )}
              </div>

              <div className="battle-side rival-line">
                <p className="combat-kicker">Rival line · choose target</p>
                {combat.enemies.map((enemy) => (
                  <button
                    key={enemy.id}
                    className={`battle-unit is-rival ${plan.targetId === enemy.id ? "is-selected" : ""} ${forecast?.actorName === enemy.name ? "is-acting" : ""} ${lastImpact?.targetId === enemy.id && phase === "resolving" ? "is-hit" : ""} ${hpClass(enemy.hp, enemy.maxHp)}`}
                    onClick={() =>
                      enemy.hp > 0 &&
                      setPlan((current) => ({ ...current, targetId: enemy.id }))
                    }
                    disabled={enemy.hp <= 0 || phase === "resolving"}
                  >
                    <span className="unit-sigil">{enemy.name.slice(0, 1)}</span>
                    <span className="unit-copy">
                      <strong>{enemy.name}</strong>
                      <small>
                        {enemy.role}
                        {forecast?.actorName === enemy.name ? " · acting" : ""}
                      </small>
                      <HealthBar value={enemy.hp} max={enemy.maxHp} hostile />
                    </span>
                    <span className="hp-copy">{enemy.hp}</span>
                    {plan.targetId === enemy.id && (
                      <span className="unit-tag">Target</span>
                    )}
                    {lastImpact?.targetId === enemy.id &&
                      phase === "resolving" && (
                        <span className="floating-number is-strike">
                          -{lastImpact?.outgoing}
                        </span>
                      )}
                  </button>
                ))}
              </div>
            </section>

            <section
              className={`command-deck ${phase === "resolving" ? "is-resolving" : ""}`}
              aria-label="Combat plan controls"
            >
              <div className="command-column tactic-column">
                <p className="combat-kicker">
                  <span>1</span> Tactical response
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
                      disabled={phase === "resolving"}
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

              <div className="command-column ability-column">
                <p className="combat-kicker">
                  <span>2</span> Lead ability · {lead?.name}
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
                  <span>3</span> Hero chain
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
                  <span>4</span> Commit
                </p>
                <button
                  className={`surge-toggle ${plan.useSurge ? "is-selected" : ""}`}
                  onClick={() =>
                    setPlan((current) => ({
                      ...current,
                      useSurge: !current.useSurge,
                    }))
                  }
                  disabled={combat.momentum < 3 || phase === "resolving"}
                >
                  <strong>Crown Surge</strong>
                  <small>
                    {combat.momentum < 3
                      ? `${combat.momentum}/3 momentum`
                      : "+12 damage · spend momentum"}
                  </small>
                </button>
                <button
                  className="lock-plan"
                  onClick={commitCombat}
                  disabled={Boolean(planError) || phase === "resolving"}
                >
                  {phase === "resolving" ? "Resolving clash…" : "Lock plan"}
                  <small>
                    {planError ||
                      `${tactic?.name} · ${ability?.name} → ${combat.enemies.find((enemy) => enemy.id === plan.targetId)?.name}`}
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
