import {
  ARMY_TYPES,
  BATTLE_ITEMS,
  GENERAL_ABILITIES,
  SUPPORT_WEAPON,
} from "./combatEngine.js";

const asset = (name) => `${import.meta.env.BASE_URL}assets/cinematic/${name}`;

function HealthBar({ value, max, hostile = false }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span className={`health-track ${hostile ? "is-hostile" : ""}`}>
      <span style={{ width: `${percent}%` }} />
    </span>
  );
}

function PortraitButton({ hostile, open, onClick, name, image, health }) {
  return (
    <button
      className={`commander-portrait-button ${hostile ? "is-hostile" : ""}`}
      onClick={onClick}
      aria-expanded={open}
      aria-label={`${open ? "Collapse" : "Expand"} ${name} details`}
    >
      <img src={asset(image)} alt="" />
      <span>
        <small>{hostile ? "Enemy General" : "Your General"}</small>
        <strong>{name}</strong>
        {health && <HealthBar value={health.value} max={health.max} hostile={hostile} />}
      </span>
      <b aria-hidden="true">{open ? "‹" : "›"}</b>
    </button>
  );
}

export function CinematicBattlefield({
  combat,
  plan,
  setPlan,
  phase,
  forecast,
  selectedAbility,
  lastImpact,
  resolutionStep,
  resolutionPaused,
  ordersLocked,
  viewMode,
  setViewMode,
  allyGeneralOpen,
  setAllyGeneralOpen,
  enemyGeneralOpen,
  setEnemyGeneralOpen,
  powerDrawerOpen,
  setPowerDrawerOpen,
  selectLead,
}) {
  const general = combat.enemyGeneral;
  const canTargetGeneral = Boolean(
    plan.generalAbilityId === "decree" ||
      plan.useSupportWeapon ||
      selectedAbility?.area,
  );
  const isResolving = phase === "resolving";
  const alliedStrike = isResolving && resolutionStep >= 1 && resolutionStep <= 3;
  const rivalStrike = isResolving && resolutionStep === 4;
  const generalUnderFire = alliedStrike && plan.targetGeneral;
  const focusedEnemy = plan.targetGeneral
    ? general.name
    : combat.enemies.find((enemy) => enemy.id === plan.targetId)?.name ?? "rival line";
  const activeAllyId = plan.leadId ?? combat.heroes.find((hero) => hero.hp > 0)?.id;
  const activeRivalName = forecast?.actorName;

  function moveLight(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--parallax-x", `${x * 12}px`);
    event.currentTarget.style.setProperty("--parallax-y", `${y * 7}px`);
  }

  return (
    <section
      className={`cinematic-field view-${viewMode} ${isResolving ? `is-clashing beat-${resolutionStep}` : ""} ${resolutionPaused ? "is-paused" : ""} ${plan.targetGeneral ? "is-targeting-general" : ""}`}
      aria-label="Cinematic Crown Arena battlefield"
      onPointerMove={moveLight}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--parallax-x", "0px");
        event.currentTarget.style.setProperty("--parallax-y", "0px");
      }}
    >
      <img className="cinematic-backdrop" src={asset("arena-courtyard.png")} alt="" />
      <div className="arena-atmosphere" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <div className="camera-switch" aria-label="Battle camera">
        {[
          ["plan", "Plan", "Choose orders"],
          ["clash", "Clash", "Watch combat"],
          ["tactical", "Tactical", "Inspect lanes"],
        ].map(([id, label, hint]) => (
          <button
            key={id}
            className={viewMode === id ? "is-selected" : ""}
            onClick={() => setViewMode(id)}
            aria-pressed={viewMode === id}
            title={hint}
          >
            <span>{label}</span>
            <small>{hint}</small>
          </button>
        ))}
      </div>

      <aside className={`commander-sheet ally-commander ${allyGeneralOpen ? "is-open" : "is-collapsed"}`}>
        <PortraitButton
          name={combat.general.name}
          image="general-seraphine.png"
          open={allyGeneralOpen}
          onClick={() => setAllyGeneralOpen((value) => !value)}
        />
        <div className="commander-sheet-body">
          <p className="commander-title">{combat.general.title}</p>
          <div className="commander-stat-row">
            <span><small>Level</small><strong>{combat.general.level}</strong></span>
            <span><small>Command</small><strong>{combat.general.command}</strong></span>
            <span><small>Resolve</small><strong>{combat.general.resolve}</strong></span>
          </div>
          <button
            className="commander-tools-toggle"
            onClick={() => setPowerDrawerOpen((value) => !value)}
            aria-expanded={powerDrawerOpen}
          >
            <span>General powers & field kit</span>
            <strong>{powerDrawerOpen ? "Hide" : "Open"}</strong>
          </button>
          <div className={`commander-tools ${powerDrawerOpen ? "is-open" : ""}`}>
            <small className="tool-label">Command power</small>
            <div className="cinematic-power-grid">
              {Object.values(GENERAL_ABILITIES).map((entry) => {
                const readyRound = combat.general.cooldowns[entry.id] ?? 1;
                const charges = combat.general.charges[entry.id];
                const available = readyRound <= combat.round && (charges === undefined || charges > 0);
                return (
                  <button
                    key={entry.id}
                    className={plan.generalAbilityId === entry.id ? "is-selected" : ""}
                    onClick={() => setPlan((current) => ({
                      ...current,
                      generalAbilityId: current.generalAbilityId === entry.id ? "" : entry.id,
                      targetGeneral: entry.id === "decree" ? current.targetGeneral : false,
                    }))}
                    disabled={!available || ordersLocked}
                  >
                    <b>{entry.name.slice(0, 1)}</b>
                    <span><strong>{entry.name}</strong><small>{entry.short}</small></span>
                  </button>
                );
              })}
            </div>
            <small className="tool-label">Quick items</small>
            <div className="cinematic-item-row">
              {Object.values(BATTLE_ITEMS).map((entry) => (
                <button
                  key={entry.id}
                  className={plan.itemId === entry.id ? "is-selected" : ""}
                  onClick={() => setPlan((current) => ({ ...current, itemId: current.itemId === entry.id ? "" : entry.id }))}
                  disabled={(combat.items[entry.id] ?? 0) <= 0 || ordersLocked}
                  title={entry.short}
                >
                  <strong>{entry.name.slice(0, 1)}</strong><small>×{combat.items[entry.id] ?? 0}</small>
                </button>
              ))}
              <button
                className={plan.useSupportWeapon ? "is-selected" : ""}
                onClick={() => setPlan((current) => ({ ...current, useSupportWeapon: !current.useSupportWeapon }))}
                disabled={!combat.supportWeaponReady || ordersLocked}
                title={SUPPORT_WEAPON.short}
              >
                <strong>W</strong><small>{combat.supportWeaponReady ? "Ready" : "Spent"}</small>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="cinematic-clash-zone">
        <div className={`warband ally-warband ${alliedStrike ? "is-acting" : ""} ${rivalStrike ? "is-hit" : ""}`}>
          <img src={asset("allied-line.png")} alt="Lyra, Torin, and Vex ready for battle" />
          <div className="unit-target-row ally-targets">
            {combat.heroes.map((hero, index) => {
              const threatened = forecast?.targetIds.includes(hero.id);
              return (
                <button
                  key={hero.id}
                  className={`${plan.leadId === hero.id ? "is-selected" : ""} ${threatened ? "is-threatened" : ""} ${alliedStrike && activeAllyId === hero.id ? "is-acting" : ""} ${rivalStrike && threatened ? "is-hit" : ""}`}
                  onClick={() => hero.hp > 0 && selectLead(hero)}
                  disabled={hero.hp <= 0 || ordersLocked}
                >
                  <span><b>{index + 1}</b><strong>{hero.name}</strong></span>
                  <small>{ARMY_TYPES[hero.armyId]?.name}</small>
                  <HealthBar value={hero.hp} max={hero.maxHp} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="clash-focus" aria-live="polite">
          <span className="versus-mark">{isResolving ? `Beat ${resolutionStep + 1} / 5` : "Battle read"}</span>
          <strong>{phase === "resolving" ? ["Lines form", "Support fires", "Ability released", "Armies strike", "Rival answers"][resolutionStep] : forecast?.headline}</strong>
          <small>{isResolving ? (rivalStrike ? `${activeRivalName} retaliates` : `${focusedEnemy} under pressure`) : `${forecast?.actorName} is preparing ${forecast?.kind}`}</small>
        </div>

        <div className={`warband rival-warband ${rivalStrike ? "is-acting" : ""} ${alliedStrike ? "is-hit" : ""}`}>
          <img src={asset("rival-line.png")} alt="The Ash Regent's three rival champions" />
          <div className="unit-target-row rival-targets">
            {combat.enemies.map((enemy, index) => (
              <button
                key={enemy.id}
                className={`${plan.targetId === enemy.id && !plan.targetGeneral ? "is-selected" : ""} ${rivalStrike && forecast?.actorName === enemy.name ? "is-acting" : ""} ${alliedStrike && plan.targetId === enemy.id && !plan.targetGeneral ? "is-hit" : ""}`}
                onClick={() => enemy.hp > 0 && setPlan((current) => ({ ...current, targetId: enemy.id, targetGeneral: false }))}
                disabled={enemy.hp <= 0 || ordersLocked}
              >
                <span><b>{index + 1}</b><strong>{enemy.name}</strong></span>
                <small>{enemy.role}</small>
                <HealthBar value={enemy.hp} max={enemy.maxHp} hostile />
              </button>
            ))}
          </div>
        </div>

        {isResolving && resolutionStep >= 2 && resolutionStep <= 3 && (
          <div className={`cinematic-impact ${plan.targetGeneral ? "is-general-hit" : ""}`} role="status" aria-label={`${focusedEnemy} takes ${plan.targetGeneral ? (lastImpact?.generalDamage ?? 0) : (lastImpact?.outgoing ?? 0)} damage`}>
            <img src={asset("cyan-slash.png")} alt="" />
            <span><small>{plan.targetGeneral ? "Breach" : "Direct hit"}</small><strong>-{plan.targetGeneral ? (lastImpact?.generalDamage ?? 0) : (lastImpact?.outgoing ?? 0)}</strong></span>
          </div>
        )}
        {rivalStrike && (
          <div className="cinematic-impact is-counter" role="status" aria-label={`Your line takes ${lastImpact?.incoming ?? 0} damage`}>
            <img src={asset("cyan-slash.png")} alt="" />
            <span><small>Retaliation</small><strong>-{lastImpact?.incoming ?? 0}</strong></span>
          </div>
        )}
      </div>

      <aside className={`commander-sheet enemy-commander ${enemyGeneralOpen ? "is-open" : "is-collapsed"} ${generalUnderFire ? "is-under-fire" : ""}`}>
        <PortraitButton
          hostile
          name={general.name}
          image="general-malrec.png"
          open={enemyGeneralOpen}
          onClick={() => setEnemyGeneralOpen((value) => !value)}
          health={{ value: general.hp, max: general.maxHp }}
        />
        <div className="commander-sheet-body">
          <p className="commander-title">{general.title}</p>
          <div className="enemy-general-health">
            <span><small>General health</small><strong>{general.hp} / {general.maxHp}</strong></span>
            <HealthBar value={general.hp} max={general.maxHp} hostile />
          </div>
          <div className="commander-stat-row">
            <span><small>Threat</small><strong>{general.threat}</strong></span>
            <span><small>Guard</small><strong>{general.guard}</strong></span>
            <span><small>Will</small><strong>{general.will}</strong></span>
          </div>
          <div className="enemy-intel-card">
            <small>Command tell</small>
            <strong>{forecast?.headline}</strong>
            <p>{forecast?.targetLabel} · counter with {forecast?.counterLabel}</p>
          </div>
          <button
            className={`focus-general-button ${plan.targetGeneral ? "is-selected" : ""}`}
            onClick={() => setPlan((current) => ({ ...current, targetGeneral: !current.targetGeneral }))}
            disabled={!canTargetGeneral || ordersLocked || general.hp <= 0}
            title={canTargetGeneral ? "Redirect qualifying damage to the enemy General" : "Equip Royal Decree, an area ability, or the support weapon to breach his guard"}
          >
            <span>{plan.targetGeneral ? "General targeted" : "Target enemy General"}</span>
            <small>{canTargetGeneral ? "Breach available" : "Requires a breaching attack"}</small>
          </button>
          <div className="enemy-general-traits">
            <span><b>Iron Edict</b><small>Rivals gain guard while he stands.</small></span>
            <span><b>Ash Crown</b><small>Defeating him ends the battle.</small></span>
          </div>
        </div>
      </aside>

      <div className="turn-sequence" aria-label="Turn sequence">
        {combat.heroes.filter((hero) => hero.hp > 0).map((hero, index) => (
          <span
            key={hero.id}
            className={`${hero.id === activeAllyId && !rivalStrike ? "is-current " : ""}is-ally`}
            title={`${hero.name}${hero.id === activeAllyId && !rivalStrike ? " acting" : ""}`}
          >{hero.name.slice(0, 1)}</span>
        ))}
        {combat.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => (
          <span
            key={enemy.id}
            className={`${rivalStrike && enemy.name === activeRivalName ? "is-current " : ""}is-rival`}
            title={`${enemy.name}${rivalStrike && enemy.name === activeRivalName ? " acting" : ""}`}
          >{enemy.name.slice(0, 1)}</span>
        ))}
        <small>{rivalStrike ? "Rival turn" : isResolving ? "Your turn" : "Initiative"}</small>
      </div>
    </section>
  );
}
