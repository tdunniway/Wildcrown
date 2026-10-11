import { formatPrototypeStatus } from "@wildcrown/prototype-kit";
import { PrototypeCard } from "@wildcrown/ui";
import registry from "../../../prototypes.json";

function prototypeHref(prototype) {
  return import.meta.env.DEV ? prototype.localUrl : prototype.basePath;
}

export function App() {
  const active = registry.prototypes.filter(
    (prototype) => prototype.status !== "archived",
  );

  return (
    <main className="forge-shell">
      <header className="forge-hero">
        <div>
          <p className="forge-eyebrow">Wildcrown · Prototype Forge</p>
          <h1>Build the risky ideas first.</h1>
          <p className="forge-intro">
            One shared foundation for testing combat, progression, social play,
            and world systems before they become expensive production
            commitments.
          </p>
        </div>
        <dl className="forge-stats" aria-label="Prototype repository status">
          <div>
            <dt>Active</dt>
            <dd>{active.length}</dd>
          </div>
          <div>
            <dt>Core</dt>
            <dd>3 packages</dd>
          </div>
          <div>
            <dt>Build</dt>
            <dd>Live</dd>
          </div>
        </dl>
      </header>

      <section className="forge-section" aria-labelledby="active-prototypes">
        <div className="forge-section__heading">
          <div>
            <p className="forge-eyebrow">Current experiments</p>
            <h2 id="active-prototypes">Playable prototypes</h2>
          </div>
          <p>
            {active
              .map((prototype) => formatPrototypeStatus(prototype.status))
              .join(" · ")}
          </p>
        </div>

        <div className="prototype-grid">
          {active.map((prototype) => (
            <PrototypeCard
              href={prototypeHref(prototype)}
              key={prototype.id}
              prototype={prototype}
            />
          ))}
        </div>
      </section>

      <section className="foundation" aria-labelledby="shared-foundation">
        <div>
          <p className="forge-eyebrow">Reusable by default</p>
          <h2 id="shared-foundation">Shared foundation</h2>
        </div>
        <ul>
          <li>
            <strong>UI</strong>
            <span>Wildcrown tokens and interface primitives</span>
          </li>
          <li>
            <strong>Prototype kit</strong>
            <span>Deterministic helpers and registry contracts</span>
          </li>
          <li>
            <strong>Vite config</strong>
            <span>One build and local-development baseline</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
