import { useEffect, useState } from "react";
import {
  Bomb,
  Check,
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
const views = [
  { id: "plan", label: "Plan", Icon: Map },
  { id: "clash", label: "Clash", Icon: Swords },
  { id: "tactical", label: "Tactical", Icon: Grid3X3 },
];
const roleIcons = {
  Ranged: Crosshair,
  Melee: Swords,
  Assassin: Zap,
  Vanguard: Shield,
  Warden: Shield,
  Mage: Sparkles,
  Skirmisher: Crosshair,
  Duelist: Swords,
  Invoker: Sparkles,
};
const powerIcons = [Flag, Shield, Sparkles];
const itemIcons = [HeartPulse, Package, Zap];
const lanes = ["North", "Center", "South"];
const compactFieldQuery = "(max-width: 1280px), (max-height: 780px)";

function useFieldQuery(query) {
  const [compact, setCompact] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return compact;
}

function Meter({ value, max, hostile = false, label = "Health" }) {
  return (
    <span
      className={`wc-meter ${hostile ? "hostile" : ""}`}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <i
        style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
      />
    </span>
  );
}

function General({
  hostile,
  combat,
  plan,
  setPlan,
  open,
  onToggle,
  locked,
  canBreach,
  underFire,
}) {
  const general = hostile ? combat.enemyGeneral : combat.general;
  const value = hostile ? general.hp : general.resolve;
  const max = hostile ? general.maxHp : 100;
  return (
    <aside
      className={`wc-general ${hostile ? "enemy" : "ally"} ${open ? "expanded" : "collapsed"} ${underFire ? "under-fire" : ""}`}
      aria-label={`${hostile ? "Enemy" : "Your"} General, ${general.name}`}
    >
      <button
        className="wc-general-face"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${general.name}'s command panel`}
        title="Click portrait to open or close command panel"
      >
        <img
          src={asset(hostile ? "general-malrec.png" : "general-seraphine.png")}
          alt=""
        />
        <Crown className="face-rank" aria-hidden="true" />
        <Meter
          value={value}
          max={max}
          hostile={hostile}
          label={hostile ? "Health" : "Resolve"}
        />
      </button>
      {open && (
        <div className="wc-general-panel">
          <div className="wc-general-heading">
            <span>
              <small>{hostile ? "Enemy general" : "Your general"}</small>
              <strong>{general.name}</strong>
            </span>
            <span className="general-vital">
              <HeartPulse aria-hidden="true" />
              {value}
              <small>/{max}</small>
            </span>
          </div>
          {hostile ? (
            <>
              <div className="wc-enemy-stats">
                <span>
                  <Swords />
                  Threat <b>{general.threat}</b>
                </span>
                <span>
                  <Shield />
                  Guard <b>{general.guard}</b>
                </span>
                <span>
                  <Sparkles />
                  Will <b>{general.will}</b>
                </span>
              </div>
              <button
                className={`wc-breach ${plan.targetGeneral ? "selected" : ""}`}
                onClick={() =>
                  setPlan((p) => ({ ...p, targetGeneral: !p.targetGeneral }))
                }
                disabled={!canBreach || locked || general.hp <= 0}
                aria-pressed={plan.targetGeneral}
                title={
                  canBreach
                    ? "Redirect qualifying damage to the General"
                    : "Select Final Decree, an area ability, or the catapult first"
                }
              >
                <Crosshair aria-hidden="true" />
                {plan.targetGeneral ? "General targeted" : "Target general"}
                {plan.targetGeneral && <Check aria-hidden="true" />}
              </button>
            </>
          ) : (
            <>
              <div className="wc-powers" aria-label="General abilities">
                {Object.values(GENERAL_ABILITIES).map((power, i) => {
                  const Icon = powerIcons[i];
                  const ready = combat.general.cooldowns[power.id] ?? 1;
                  const charges = combat.general.charges[power.id];
                  const available =
                    ready <= combat.round &&
                    (charges === undefined || charges > 0);
                  const status =
                    charges === 0
                      ? "Spent"
                      : ready > combat.round
                        ? `Round ${ready}`
                        : charges === undefined
                          ? "Ready"
                          : `${charges} use`;
                  return (
                    <button
                      key={power.id}
                      className={
                        plan.generalAbilityId === power.id ? "selected" : ""
                      }
                      disabled={!available || locked}
                      aria-pressed={plan.generalAbilityId === power.id}
                      aria-label={`${power.name}, ${status}: ${power.short}`}
                      title={power.short}
                      onClick={() =>
                        setPlan((p) => ({
                          ...p,
                          generalAbilityId:
                            p.generalAbilityId === power.id ? "" : power.id,
                          targetGeneral:
                            power.id === "decree" ? p.targetGeneral : false,
                        }))
                      }
                    >
                      <Icon aria-hidden="true" />
                      <span>
                        {["Rally", "Aegis", "Decree"][i]}
                        <small>{status}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div
                className="wc-kit"
                aria-label="Battle items and support weapon"
              >
                <span>Field kit</span>
                {Object.values(BATTLE_ITEMS).map((item, i) => {
                  const Icon = itemIcons[i];
                  const quantity = combat.items[item.id] ?? 0;
                  return (
                    <button
                      key={item.id}
                      className={plan.itemId === item.id ? "selected" : ""}
                      disabled={quantity <= 0 || locked}
                      aria-pressed={plan.itemId === item.id}
                      aria-label={`${item.name}, ${quantity} remaining`}
                      title={`${item.name}: ${item.short}`}
                      onClick={() =>
                        setPlan((p) => ({
                          ...p,
                          itemId: p.itemId === item.id ? "" : item.id,
                        }))
                      }
                    >
                      <Icon aria-hidden="true" />
                      <b>{quantity}</b>
                    </button>
                  );
                })}
                <button
                  className={`wc-catapult ${plan.useSupportWeapon ? "selected" : ""}`}
                  disabled={!combat.supportWeaponReady || locked}
                  aria-pressed={plan.useSupportWeapon}
                  aria-label={`${SUPPORT_WEAPON.name}, ${combat.supportWeaponReady ? "ready" : "spent"}`}
                  title={SUPPORT_WEAPON.short}
                  onClick={() =>
                    setPlan((p) => ({
                      ...p,
                      useSupportWeapon: !p.useSupportWeapon,
                    }))
                  }
                >
                  <Bomb aria-hidden="true" />
                  <span>Catapult</span>
                  <b>{combat.supportWeaponReady ? 1 : 0}</b>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}

function Unit({
  unit,
  index,
  hostile,
  selected,
  threatened,
  acting,
  hit,
  disabled,
  onSelect,
  figure = false,
}) {
  const Icon = roleIcons[unit.role] ?? Users;
  const spriteIndex = hostile
    ? index
    : ["Lyra", "Torin", "Vex"].indexOf(unit.name);
  const hasArt = spriteIndex >= 0;
  return (
    <button
      className={`${figure ? "wc-fighter" : "wc-unit-card"} ${hostile ? "enemy" : "ally"} ${hasArt ? "" : "reserve-crest"} slot-${index} ${selected ? "selected" : ""} ${threatened ? "threatened" : ""} ${acting ? "acting" : ""} ${hit ? "hit" : ""} ${unit.hp <= 0 ? "defeated" : ""}`}
      style={{
        "--sprite-position": `${Math.max(0, spriteIndex) * 50}%`,
        "--idle-delay": `${index * -1.3}s`,
      }}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${figure ? "On battlefield: " : ""}${hostile ? "Target" : "Lead"} ${unit.name}, ${unit.hp} of ${unit.maxHp} health`}
      title={`${unit.name} · ${hostile ? unit.role : ARMY_TYPES[unit.armyId]?.name}`}
    >
      {figure ? (
        <>
          <span className="wc-ground-ring" />
          {hasArt ? (
            <span className="wc-sprite" />
          ) : (
            <span className="wc-reserve-emblem">
              <Icon aria-hidden="true" />
              <small>{unit.role}</small>
            </span>
          )}
          <span className="wc-fighter-label">
            <strong>{unit.name}</strong>
            <Meter value={unit.hp} max={unit.maxHp} hostile={hostile} />
            <small>
              {unit.hp}/{unit.maxHp}
            </small>
          </span>
        </>
      ) : (
        <>
          <span className="wc-unit-icon">
            {hasArt && <span className="wc-portrait-crop" />}
            <Icon aria-hidden="true" />
          </span>
          <span className="wc-unit-copy">
            <strong>
              {unit.name}
              {selected && <Check aria-hidden="true" />}
            </strong>
            <small>{hostile ? unit.role : ARMY_TYPES[unit.armyId]?.name}</small>
            <Meter value={unit.hp} max={unit.maxHp} hostile={hostile} />
          </span>
          <span className="wc-unit-hp">
            {unit.hp}
            <small>HP</small>
          </span>
        </>
      )}
    </button>
  );
}

export function CinematicBattlefield({
  combat,
  plan,
  setPlan,
  phase,
  animatedResolution,
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
  const compactField = useFieldQuery(compactFieldQuery);
  const mobileField = useFieldQuery("(max-width: 680px)");
  const resolving = phase === "resolving" && animatedResolution;
  const simulating = phase === "resolving" && !animatedResolution;
  const allyAttack = resolving && resolutionStep >= 1 && resolutionStep <= 3;
  const enemyAttack = resolving && resolutionStep === 4;
  const canBreach =
    plan.generalAbilityId === "decree" ||
    plan.useSupportWeapon ||
    Boolean(selectedAbility?.area);
  const focusedName = plan.targetGeneral
    ? combat.enemyGeneral.name
    : combat.enemies.find((u) => u.id === plan.targetId)?.name;
  const heroProps = (hero, index) => ({
    unit: hero,
    index,
    selected: plan.leadId === hero.id,
    threatened: forecast?.targetIds.includes(hero.id),
    acting:
      resolving &&
      ((resolutionStep === 1 && plan.assistId === hero.id) ||
        (resolutionStep >= 2 &&
          resolutionStep <= 3 &&
          plan.leadId === hero.id)),
    hit: enemyAttack && forecast?.targetIds.includes(hero.id),
    disabled: hero.hp <= 0 || ordersLocked,
    onSelect: () => selectLead(hero),
  });
  const enemyProps = (enemy, index) => ({
    unit: enemy,
    index,
    hostile: true,
    selected: plan.targetId === enemy.id && !plan.targetGeneral,
    acting: enemyAttack && forecast?.actorName === enemy.name,
    hit: allyAttack && plan.targetId === enemy.id && !plan.targetGeneral,
    disabled: enemy.hp <= 0 || ordersLocked,
    onSelect: () =>
      setPlan((p) => ({ ...p, targetId: enemy.id, targetGeneral: false })),
  });
  const leadIndex = Math.max(
    0,
    combat.heroes.findIndex((u) => u.id === plan.leadId),
  );
  const targetIndex = Math.max(
    0,
    combat.enemies.findIndex((u) => u.id === plan.targetId),
  );
  // Routes follow the selected lead and target; they are not a decorative, fixed arrow.
  const routePoints =
    viewMode === "plan"
      ? [
          [mobileField ? 12 : 24, 68],
          [mobileField ? 31 : 40, 79],
          [mobileField ? 50 : 56, 88],
        ]
      : viewMode === "clash"
        ? [
            [mobileField ? 7 : 12.5, 60],
            [mobileField ? 24 : 25.5, 60],
            [mobileField ? 41 : 38.5, 60],
          ]
        : [
            [22, 22],
            [compactField ? 32 : 22, 50],
            [22, 78],
          ];
  const rivalPoints =
    viewMode === "plan"
      ? [
          [mobileField ? 50 : 56, 30],
          [69, 45],
          [mobileField ? 88 : 83, 59],
        ]
      : viewMode === "clash"
        ? [
            [mobileField ? 58 : 61.5, 60],
            [mobileField ? 75 : 74.5, 60],
            [mobileField ? 92 : 87.5, 60],
          ]
        : [
            [78, 22],
            [compactField ? 68 : 78, 50],
            [78, 78],
          ];
  const [sx, sy] = routePoints[leadIndex];
  const [tx, ty] = rivalPoints[targetIndex];
  const path =
    plan.movementId === "flank"
      ? `M ${sx} ${sy} Q 50 3 ${tx} ${ty}`
      : `M ${sx} ${sy} L ${tx} ${ty}`;
  const rivalIndex = Math.max(
    0,
    combat.enemies.findIndex((u) => u.name === forecast?.actorName),
  );
  const threatenedIndex = Math.max(
    0,
    combat.heroes.findIndex((u) => forecast?.targetIds.includes(u.id)),
  );
  const impactPoint = enemyAttack
    ? routePoints[threatenedIndex]
    : rivalPoints[targetIndex];
  const beats = [
    "Lines form",
    "Support",
    "Lead ability",
    "Armies strike",
    "Rival answers",
  ];
  return (
    <section
      className={`wc-battlefield mode-${viewMode} ${resolving ? "resolving" : ""} ${resolutionPaused ? "is-paused" : ""}`}
      aria-label={`${views.find((v) => v.id === viewMode)?.label} battlefield`}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--parallax-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 6}px`,
        );
      }}
      onPointerLeave={(event) =>
        event.currentTarget.style.setProperty("--parallax-x", "0px")
      }
    >
      <div className="wc-scene-backdrop" aria-hidden="true" />
      <div className="wc-atmosphere" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <nav className="wc-view-switch" aria-label="Battlefield view">
        {views.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={viewMode === id ? "selected" : ""}
            onClick={() => setViewMode(id)}
            aria-pressed={viewMode === id}
          >
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
      <General
        combat={combat}
        plan={plan}
        setPlan={setPlan}
        open={generalPanels.ally}
        onToggle={() => toggleGeneral("ally")}
        locked={ordersLocked}
      />
      <General
        hostile
        combat={combat}
        plan={plan}
        setPlan={setPlan}
        open={generalPanels.enemy}
        onToggle={() => toggleGeneral("enemy")}
        locked={ordersLocked}
        canBreach={canBreach}
        underFire={allyAttack && plan.targetGeneral}
      />
      <div className="wc-scene-area">
        <div className="wc-arena-ground" aria-hidden="true">
          <span className="wc-ground-crown">
            <Crown />
          </span>
          {lanes.map((lane, i) => (
            <span key={lane} className={`wc-lane lane-${i}`}>
              <b>{lane}</b>
              <i />
            </span>
          ))}
        </div>
        {viewMode !== "clash" && (
          <svg
            className={`wc-order-path ${plan.movementId === "shield" ? "defensive" : ""}`}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-label={`${plan.movementId} route from ${combat.heroes[leadIndex].name} to ${focusedName}`}
          >
            <defs>
              <marker
                id="wc-route-arrow"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5" />
              </marker>
            </defs>
            {!plan.targetGeneral && (
              <>
                <path d={path} markerEnd="url(#wc-route-arrow)" />
                <circle cx={tx} cy={ty} r="3" />
              </>
            )}
            {viewMode === "tactical" &&
              forecast?.targetIds.map((id) => {
                const index = combat.heroes.findIndex((hero) => hero.id === id);
                if (index < 0) return null;
                const start = rivalPoints[rivalIndex];
                const end = routePoints[index];
                return (
                  <path
                    key={id}
                    className="wc-threat-path"
                    d={`M ${start.join(" ")} Q 50 ${Math.min(start[1], end[1]) - 12} ${end.join(" ")}`}
                  />
                );
              })}
          </svg>
        )}
        {combat.heroes.map((hero, i) => (
          <Unit key={hero.id} {...heroProps(hero, i)} figure />
        ))}
        {combat.enemies.map((enemy, i) => (
          <Unit key={enemy.id} {...enemyProps(enemy, i)} figure />
        ))}
        <div className="wc-battle-read" aria-live="polite">
          <span>
            {simulating
              ? "Resolving battle"
              : resolving
                ? `Beat ${resolutionStep + 1} / 5`
                : viewMode === "plan"
                  ? "Orders preview"
                  : viewMode === "tactical"
                    ? "Lane control"
                    : "Clash ready"}
          </span>
          <strong>
            {simulating
              ? "Commander simulating remaining clashes"
              : resolving
                ? [
                    "Lines form",
                    "Support fires",
                    "Ability released",
                    "Armies strike",
                    "Rival answers",
                  ][resolutionStep]
                : viewMode === "clash"
                  ? "Choose your moment"
                  : plan.movementId === "shield"
                    ? "Hold the line"
                    : `${combat.heroes[leadIndex].name} → ${focusedName}`}
          </strong>
        </div>
        {resolving && resolutionStep >= 2 && (
          <div
            key={resolutionStep}
            style={{ left: `${impactPoint[0]}%`, top: `${impactPoint[1]}%` }}
            className={`wc-impact ${enemyAttack ? "counter" : ""} ${plan.targetGeneral && !enemyAttack ? "general-impact" : ""}`}
            role="status"
          >
            <img src={asset("cyan-slash.png")} alt="" />
            <span>
              {enemyAttack
                ? "Retaliation"
                : plan.targetGeneral
                  ? "General breach"
                  : resolutionStep === 2
                    ? selectedAbility?.name
                    : "Clash damage"}
              {(enemyAttack || resolutionStep === 3) && (
                <strong>
                  −
                  {enemyAttack
                    ? (lastImpact?.incoming ?? 0)
                    : plan.targetGeneral
                      ? (lastImpact?.generalDamage ?? 0)
                      : (lastImpact?.outgoing ?? 0)}
                </strong>
              )}
            </span>
          </div>
        )}
      </div>
      <div className="wc-selectors">
        <div className="wc-unit-group" aria-label="Your hero selectors">
          {combat.heroes.map((hero, i) => (
            <Unit key={hero.id} {...heroProps(hero, i)} />
          ))}
        </div>
        <span className="wc-versus">
          <Swords aria-hidden="true" />
        </span>
        <div className="wc-unit-group" aria-label="Enemy selectors">
          {combat.enemies.map((enemy, i) => (
            <Unit key={enemy.id} {...enemyProps(enemy, i)} />
          ))}
        </div>
      </div>
      <div className="wc-initiative" aria-label="Combat resolution sequence">
        <span>
          <RadioTower aria-hidden="true" />
          Clash sequence
        </span>
        {beats.map((beat, i) => (
          <span
            key={beat}
            className={`${i === 4 ? "enemy" : "ally"} ${resolving && resolutionStep === i ? "current" : ""}`}
          >
            {i + 1}. {beat}
          </span>
        ))}
      </div>
    </section>
  );
}
