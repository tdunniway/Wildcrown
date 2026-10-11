import assert from "node:assert/strict";
import test from "node:test";

import {
  clamp,
  createSeededRandom,
  definePrototype,
  formatPrototypeStatus,
} from "../src/index.js";

test("clamp keeps values within inclusive bounds", () => {
  assert.equal(clamp(-2, 0, 5), 0);
  assert.equal(clamp(7, 0, 5), 5);
  assert.equal(clamp(3, 0, 5), 3);
});

test("prototype definitions reject invalid registry entries", () => {
  assert.throws(() =>
    definePrototype({ id: "Bad Slug", name: "Bad", status: "concept" }),
  );
  assert.throws(() =>
    definePrototype({ id: "good-slug", name: "Good", status: "unknown" }),
  );
  assert.equal(
    definePrototype({ id: "good-slug", name: "Good", status: "playable" }).name,
    "Good",
  );
});

test("seeded random streams are repeatable", () => {
  const first = createSeededRandom(42);
  const second = createSeededRandom(42);
  assert.deepEqual([first(), first(), first()], [second(), second(), second()]);
  assert.equal(formatPrototypeStatus("testing"), "Testing");
});
