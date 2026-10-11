#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(
  readFileSync(path.join(root, "prototypes.json"), "utf8"),
);
const hubDist = path.join(root, "apps", "prototype-hub", "dist");

if (!existsSync(path.join(hubDist, "index.html"))) {
  throw new Error("Prototype hub must be built before assembly.");
}

const destinationRoot = path.join(hubDist, "prototypes");
rmSync(destinationRoot, { force: true, recursive: true });
mkdirSync(destinationRoot, { recursive: true });

for (const prototype of registry.prototypes) {
  if (prototype.status === "archived") continue;
  const source = path.join(root, prototype.root, prototype.outputDir);
  if (!existsSync(path.join(source, "index.html"))) {
    throw new Error(`Missing build output for ${prototype.id}: ${source}`);
  }
  cpSync(source, path.join(destinationRoot, prototype.id), { recursive: true });
  console.log(`Assembled ${prototype.id} at ${prototype.basePath}`);
}

console.log(`Prototype showcase ready: ${hubDist}`);
