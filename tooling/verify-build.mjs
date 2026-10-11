#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(
  readFileSync(path.join(root, "prototypes.json"), "utf8"),
);
const hubDist = path.join(root, "apps", "prototype-hub", "dist");
const required = [path.join(hubDist, "index.html")];

for (const prototype of registry.prototypes) {
  if (prototype.status === "archived") continue;
  required.push(path.join(hubDist, "prototypes", prototype.id, "index.html"));
}

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  throw new Error(`Assembled showcase is incomplete:\n${missing.join("\n")}`);
}

console.log(
  `Verified showcase hub and ${required.length - 1} active prototype build(s).`,
);
