import {
  Bomb,
  Check,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Crown,
  Flag,
  Grid3X3,
  HeartPulse,
  Map,
  Package,
  RadioTower,
  Shield,
  Sparkles,
  Swords,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  ARMY_TYPES,
  BATTLE_ITEMS,
  GENERAL_ABILITIES,
  SUPPORT_WEAPON,
} from "./combatEngine.js";

const asset = (name) => `${import.meta.env.BASE_URL}assets/cinematic/${name}`;

const viewOptions = [
  { id: "plan", label: "Plan", hint: "Wide command map", Icon: Map },
  { id: "clash", label: "Clash", hint: "Cinematic combat", Icon: Swords },
  { id: "tactical", label: "Tactical", hint: "Lane analysis", Icon: Grid3X3 },
];

const heroIcons = [Crosshair, Shield, Zap];
const enemyIcons = [Shield, Swords, Crosshair];
const powerIcons = [Flag, Shield, Sparkles];
const itemIcons = [HeartPulse, Package, Zap];

function HealthBar({ value, max, hostile = false }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span
      className={`health-track ${hostile ? "is-hostile" : ""}`}
      aria-label={`${value} of ${max} health`}
    >
      <span style={{ width: `${percent}%` }} />
    </span>
  );
}

function GeneralCard({
  hostile = false,
  combat,
  plan,
  setPlan,
  forecast,
  ordersLocked,
  canTargetGeneral,
  generalUnderFire,
  open,
  onToggle,
}) {
  const general = hostile ? combat.enemyGeneral : combat.general;
  const image = hostile ? "general-malrec.png" : "general-seraphine.png";
  const meterValue = hostile ? general.hp : general.resolve;
  const meterMax = hostile ? general.maxHp : 100;
  const CollapseIcon = hostile ? ChevronRight : ChevronLeft;
  const ExpandIcon = hostile ? ChevronLeft : ChevronRight;

  return (
    <aside
      className={`commander-sheet ${hostile ? "enemy-commander" : "ally-commander"} ${open ? "is-open" : "is-collapsed"} ${generalUnderFire ? "is-under-fire" : ""}`}
      aria-label={`${hostile ? "Enemy" : "Your"} General, ${general.name}`}
    >
      <button
        type="button"
        className={`commander-portrait-button ${hostile ? "is-hostile" : ""}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${general.name}'s command panel`}
        title={`${open ? "Collapse" : "Expand"} ${general.name}'s command panel`}
      >
        <img src={asset(image)} alt="" />
        <span className="commander-rank">
          <Crown aria-hidden="true" />
        </span>
        <span className="commander-portrait-meter" aria-hidden="true">
          <i
            style={{
              width: `${Math.max(0, Math.min(100, (meterValue / meterMax) * 100))}%`,
            }}
          />
        </span>
        <span className="commander-portrait-value" aria-hidden="true">
          {meterValue}
        </span>
        {!open && (
          <span className="commander-expand-cue" aria-hidden="true">
            <ExpandIcon />
          </span>
        )}
      </button>

      {open && (
        <div className="commander-sheet-body">
          <div className="commander-identity-copy">
            <span>
              <small>{hostile ? "Enemy General" : "Your General"}</small>
              <strong>{general.name}</strong>
              <em>{general.title}</em>
            </span>
            <button
              type="button"
              className="commander-collapse-button"
              onClick={onToggle}
              aria-label={`Collapse ${general.name}'s command panel`}
              title="Collapse panel"
            >
              <CollapseIcon aria-hidden="true" />
            </button>
          </div>

          {hostile ? (
            <>
              <div className="general-health-line">
                <HealthBar value={general.hp} max={general.maxHp} hostile />
                <b>
                  {general.hp}/{general.maxHp}
                </b>
              </div>
              <div className="commander-stat-row">
                <span>
                  <small>Threat</small>
                  <strong>{general.threat}</strong>
                </span>
                <span>
                  <small>Guard</small>
                  <strong>{general.guard}</strong>
                </span>
                <span>
                  <small>Will</small>
                  <strong>{general.will}</strong>
                </span>
              </div>
              <div className="enemy-intel-card">
                <Target aria-hidden="true" />
                <span>
                  <small>Command tell</small>
                  <strong>{forecast?.headline}</strong>
                </span>
              </div>
              <button
                className={`focus-general-button ${plan.targetGeneral ? "is-selected" : ""}`}
                onClick={() =>
                  setPlan((current) => ({
                    ...current,
                    targetGeneral: !current.targetGeneral,
                  }))
                }
                disabled={!canTargetGeneral || ordersLocked || general.hp <= 0}
                title={
                  canTargetGeneral
                    ? "Redirect qualifying damage to the enemy General"
                    : "Equip a breaching power, area ability, or support weapon"
                }
              >
                <Crosshair aria-hidden="true" />
                <span>
                  {plan.targetGeneral ? "General targeted" : "Target General"}
                </span>
                {plan.targetGeneral && <Check aria-hidden="true" />}
              </button>
            </>
          ) : (
            <>
              <div className="commander-stat-row">
                <span>
                  <small>Level</small>
                  <strong>{general.level}</strong>
                </span>
                <span>
                  <small>Command</small>
                  <strong>{general.command}</strong>
                </span>
                <span>
                  <small>Resolve</small>
                  <strong>{general.resolve}</strong>
                </span>
              </div>
              <div className="general-tool-section">
                <small className="tool-label">Command powers</small>
                <div className="cinematic-power-grid">
                  {Object.values(GENERAL_ABILITIES).map((entry, index) => {
                    const PowerIcon = powerIcons[index] ?? Sparkles;
                    const readyRound = combat.general.cooldowns[entry.id] ?? 1;
                    const charges = combat.general.charges[entry.id];
                    const available =
                      readyRound <= combat.round &&
                      (charges === undefined || charges > 0);
                    return (
                      <button
                        key={entry.id}
                        className={
                          plan.generalAbilityId === entry.id
                            ? "is-selected"
                            : ""
                        }
                        onClick={() =>
                          setPlan((current) => ({
                            ...current,
                            generalAbilityId:
                              current.generalAbilityId === entry.id
                                ? ""
                                : entry.id,
                            targetGeneral:
                              entry.id === "decree"
                                ? current.targetGeneral
                                : false,
                          }))
                        }
                        disabled={!available || ordersLocked}
                        title={`${entry.name}: ${entry.short}`}
                        aria-label={`${entry.name}: ${entry.short}`}
                      >
                        <PowerIcon aria-hidden="true" />
                        <span>{entry.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="general-tool-section">
                <small className="tool-label">Field kit</small>
                <div className="cinematic-item-row">
                  {Object.values(BATTLE_ITEMS).map((entry, index) => {
                    const ItemIcon = itemIcons[index] ?? Package;
                    return (
                      <button
                        key={entry.id}
                        className={
                          plan.itemId === entry.id ? "is-selected" : ""
                        }
                        onClick={() =>
                          setPlan((current) => ({
                            ...current,
                            itemId: current.itemId === entry.id ? "" : entry.id,
                          }))
                        }
                        disabled={
                          (combat.items[entry.id] ?? 0) <= 0 || ordersLocked
                        }
                        title={`${entry.name}: ${entry.short}`}
                        aria-label={`${entry.name}, ${combat.items[entry.id] ?? 0} remaining`}
                      >
                        <ItemIcon aria-hidden="true" />
                        <small>×{combat.items[entry.id] ?? 0}</small>
                      </button>
                    );
                  })}
                  <button
                    className={plan.useSupportWeapon ? "is-selected" : ""}
                    onClick={() =>
                      setPlan((current) => ({
                        ...current,
                        useSupportWeapon: !current.useSupportWeapon,
                      }))
                    }
                    disabled={!combat.supportWeaponReady || ordersLocked}
                    title={`${SUPPORT_WEAPON.name}: ${SUPPORT_WEAPON.short}`}
                    aria-label={`${SUPPORT_WEAPON.name}, ${combat.supportWeaponReady ? "ready" : "spent"}`}
                  >
                    <Bomb aria-hidden="true" />
                    <small>{combat.supportWeaponReady ? "1" : "0"}</small>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}

function CombatantButton({
  unit,
  index,
  hostile = false,
  selected,
  threatened,
  acting,
  hit,
  onClick,
  disabled,
}) {
  const Icon = (hostile ? enemyIcons : heroIcons)[index] ?? Swords;
  const subtitle = hostile ? unit.role : ARMY_TYPES[unit.armyId]?.name;
  return (
    <button
      className={`battle-actor actor-${index + 1} ${hostile ? "is-rival" : "is-ally"} ${selected ? "is-selected" : ""} ${threatened ? "is-threatened" : ""} ${acting ? "is-acting" : ""} ${hit ? "is-hit" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={`${unit.name}, ${subtitle}`}
    >
      <span className="actor-sigil">
        <Icon aria-hidden="true" />
      </span>
      <span className="actor-copy">
        <strong>{unit.name}</strong>
        <small>{subtitle}</small>
        <HealthBar value={unit.hp} max={unit.maxHp} hostile={hostile} />
      </span>
      <span className="actor-number">{index + 1}</span>
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
  selectLead,
  generalPanels,
  toggleGeneral,
}) {
  const general = combat.enemyGeneral;
  const canTargetGeneral = Boolean(
    plan.generalAbilityId === "decree" ||
    plan.useSupportWeapon ||
    selectedAbility?.area,
  );
  const isResolving = phase === "resolving";
  const alliedStrike =
    isResolving && resolutionStep >= 1 && resolutionStep <= 3;
  const rivalStrike = isResolving && resolutionStep === 4;
  const generalUnderFire = alliedStrike && plan.targetGeneral;
  const focusedEnemy = plan.targetGeneral
    ? general.name
    : (combat.enemies.find((enemy) => enemy.id === plan.targetId)?.name ??
      "rival line");
  const activeAllyId =
    plan.leadId ?? combat.heroes.find((hero) => hero.hp > 0)?.id;
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
      aria-label={`${viewOptions.find((view) => view.id === viewMode)?.label} view of the Crown Arena battlefield`}
      onPointerMove={moveLight}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--parallax-x", "0px");
        event.currentTarget.style.setProperty("--parallax-y", "0px");
      }}
    >
      <img
        className="cinematic-backdrop"
        src={asset("arena-courtyard.png")}
        alt=""
      />
      <div className="arena-atmosphere" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="planning-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="camera-switch" aria-label="Battle view">
        {viewOptions.map(({ id, label, hint, Icon }) => (
          <button
            key={id}
            className={viewMode === id ? "is-selected" : ""}
            onClick={() => setViewMode(id)}
            aria-pressed={viewMode === id}
            title={hint}
          >
            <Icon aria-hidden="true" />
            <span>
              <strong>{label}</strong>
              <small>{hint}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="view-mode-label" aria-hidden="true">
        {viewMode === "plan" && (
          <>
            <Map />
            <span>
              <strong>Command map</strong>
              <small>Read the whole field</small>
            </span>
          </>
        )}
        {viewMode === "clash" && (
          <>
            <Swords />
            <span>
              <strong>Clash camera</strong>
              <small>Follow the strike</small>
            </span>
          </>
        )}
        {viewMode === "tactical" && (
          <>
            <Grid3X3 />
            <span>
              <strong>Tactical overlay</strong>
              <small>Inspect lanes and threats</small>
            </span>
          </>
        )}
      </div>

      <GeneralCard
        combat={combat}
        plan={plan}
        setPlan={setPlan}
        forecast={forecast}
        ordersLocked={ordersLocked}
        canTargetGeneral={canTargetGeneral}
        open={generalPanels.ally}
        onToggle={() => toggleGeneral("ally")}
      />

      <div className="cinematic-clash-zone">
        <div
          className="battle-composition battle-composition-plan"
          aria-hidden="true"
        >
          <span className="plan-lane plan-lane-flank">
            <i />
            Flank
          </span>
          <span className="plan-lane plan-lane-press">
            <i />
            Press
          </span>
          <span className="plan-lane plan-lane-hold">
            <i />
            Hold
          </span>
        </div>
        <div
          className="battle-composition battle-composition-clash"
          aria-hidden="true"
        >
          <span>Impact focus</span>
        </div>
        <div
          className="battle-composition battle-composition-tactical"
          aria-hidden="true"
        >
          <span>
            <b>Lane I</b>
            <i />
          </span>
          <span>
            <b>Lane II</b>
            <i />
          </span>
          <span>
            <b>Lane III</b>
            <i />
          </span>
        </div>
        <div
          className={`warband ally-warband ${alliedStrike ? "is-acting" : ""} ${rivalStrike ? "is-hit" : ""}`}
        >
          <img src={asset("allied-line.png")} alt="" />
        </div>

        <div className="battle-actors ally-actors" aria-label="Your heroes">
          {combat.heroes.map((hero, index) => {
            const threatened = forecast?.targetIds.includes(hero.id);
            return (
              <CombatantButton
                key={hero.id}
                unit={hero}
                index={index}
                selected={plan.leadId === hero.id}
                threatened={threatened}
                acting={alliedStrike && activeAllyId === hero.id}
                hit={rivalStrike && threatened}
                onClick={() => hero.hp > 0 && selectLead(hero)}
                disabled={hero.hp <= 0 || ordersLocked}
              />
            );
          })}
        </div>

        <div className="clash-focus" aria-live="polite">
          <span className="versus-mark">
            {isResolving ? `Beat ${resolutionStep + 1} / 5` : "Battle read"}
          </span>
          <strong>
            {phase === "resolving"
              ? [
                  "Lines form",
                  "Support fires",
                  "Ability released",
                  "Armies strike",
                  "Rival answers",
                ][resolutionStep]
              : forecast?.headline}
          </strong>
          <small>
            {isResolving
              ? rivalStrike
                ? `${activeRivalName} retaliates`
                : `${focusedEnemy} under pressure`
              : `${forecast?.actorName} is preparing ${forecast?.kind}`}
          </small>
        </div>

        <div
          className={`warband rival-warband ${rivalStrike ? "is-acting" : ""} ${alliedStrike ? "is-hit" : ""}`}
        >
          <img src={asset("rival-line.png")} alt="" />
        </div>

        <div
          className="battle-actors rival-actors"
          aria-label="Enemy champions"
        >
          {combat.enemies.map((enemy, index) => (
            <CombatantButton
              key={enemy.id}
              unit={enemy}
              index={index}
              hostile
              selected={plan.targetId === enemy.id && !plan.targetGeneral}
              acting={rivalStrike && forecast?.actorName === enemy.name}
              hit={
                alliedStrike &&
                plan.targetId === enemy.id &&
                !plan.targetGeneral
              }
              onClick={() =>
                enemy.hp > 0 &&
                setPlan((current) => ({
                  ...current,
                  targetId: enemy.id,
                  targetGeneral: false,
                }))
              }
              disabled={enemy.hp <= 0 || ordersLocked}
            />
          ))}
        </div>

        <div className="tactical-route" aria-hidden="true">
          <span className="route-origin" />
          <span className="route-line" />
          <span className="route-target" />
        </div>

        {isResolving && resolutionStep >= 2 && resolutionStep <= 3 && (
          <div
            className={`cinematic-impact ${plan.targetGeneral ? "is-general-hit" : ""}`}
            role="status"
            aria-label={`${focusedEnemy} takes ${plan.targetGeneral ? (lastImpact?.generalDamage ?? 0) : (lastImpact?.outgoing ?? 0)} damage`}
          >
            <img src={asset("cyan-slash.png")} alt="" />
            <span>
              <small>{plan.targetGeneral ? "Breach" : "Direct hit"}</small>
              <strong>
                -
                {plan.targetGeneral
                  ? (lastImpact?.generalDamage ?? 0)
                  : (lastImpact?.outgoing ?? 0)}
              </strong>
            </span>
          </div>
        )}
        {rivalStrike && (
          <div
            className="cinematic-impact is-counter"
            role="status"
            aria-label={`Your line takes ${lastImpact?.incoming ?? 0} damage`}
          >
            <img src={asset("cyan-slash.png")} alt="" />
            <span>
              <small>Retaliation</small>
              <strong>-{lastImpact?.incoming ?? 0}</strong>
            </span>
          </div>
        )}
      </div>

      <GeneralCard
        hostile
        combat={combat}
        plan={plan}
        setPlan={setPlan}
        forecast={forecast}
        ordersLocked={ordersLocked}
        canTargetGeneral={canTargetGeneral}
        generalUnderFire={generalUnderFire}
        open={generalPanels.enemy}
        onToggle={() => toggleGeneral("enemy")}
      />

      <div className="turn-sequence" aria-label="Turn sequence">
        <span className="sequence-label">
          <RadioTower aria-hidden="true" /> Initiative
        </span>
        {combat.heroes
          .filter((hero) => hero.hp > 0)
          .map((hero, index) => {
            const Icon = heroIcons[index] ?? Users;
            return (
              <span
                key={hero.id}
                className={`${hero.id === activeAllyId && !rivalStrike ? "is-current " : ""}is-ally`}
                title={`${hero.name}${hero.id === activeAllyId && !rivalStrike ? " acting" : ""}`}
              >
                <Icon aria-hidden="true" />
                <small>{hero.name}</small>
              </span>
            );
          })}
        <i aria-hidden="true" />
        {combat.enemies
          .filter((enemy) => enemy.hp > 0)
          .map((enemy, index) => {
            const Icon = enemyIcons[index] ?? Swords;
            return (
              <span
                key={enemy.id}
                className={`${rivalStrike && enemy.name === activeRivalName ? "is-current " : ""}is-rival`}
                title={`${enemy.name}${rivalStrike && enemy.name === activeRivalName ? " acting" : ""}`}
              >
                <Icon aria-hidden="true" />
                <small>{enemy.name}</small>
              </span>
            );
          })}
      </div>
    </section>
  );
}
