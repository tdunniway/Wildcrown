import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const registry = JSON.parse(
  readFileSync(path.join(root, "prototypes.json"), "utf8"),
);

test("prototype registry entries have unique identities and routes", () => {
  const unique = (values) => new Set(values).size === values.length;
  assert.ok(
    unique(registry.prototypes.map(({ id }) => id)),
    "prototype ids must be unique",
  );
  assert.ok(
    unique(registry.prototypes.map(({ workspace }) => workspace)),
    "workspace names must be unique",
  );
  assert.ok(
    unique(registry.prototypes.map(({ basePath }) => basePath)),
    "production routes must be unique",
  );
  assert.ok(
    unique(registry.prototypes.map(({ localUrl }) => localUrl)),
    "local development URLs must be unique",
  );
});

test("every registered prototype points to a workspace", () => {
  for (const prototype of registry.prototypes) {
    const prototypeRoot = path.join(root, prototype.root);
    assert.ok(existsSync(prototypeRoot), `${prototype.id} root does not exist`);

    const manifest = JSON.parse(
      readFileSync(path.join(prototypeRoot, "package.json"), "utf8"),
    );
    assert.equal(manifest.name, prototype.workspace);
  }
});

test("new prototype template includes the shared foundations", () => {
  const templateRoot = path.join(root, "tooling", "templates", "react-vite");
  const manifest = JSON.parse(
    readFileSync(path.join(templateRoot, "package.json"), "utf8"),
  );
  assert.equal(manifest.dependencies["@wildcrown/prototype-kit"], "*");
  assert.equal(manifest.dependencies["@wildcrown/ui"], "*");
  assert.equal(manifest.devDependencies["@wildcrown/vite-config"], "*");
});
