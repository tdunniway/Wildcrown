#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

if (args.includes("--help")) {
  console.log(
    'Usage: npm run new:prototype -- --slug expedition-map --name "Expedition Map" [--description "..."] [--port 4175]',
  );
  process.exit(0);
}

const slug = option("slug");
const name = option("name");
const description =
  option("description") ?? "A focused Wildcrown gameplay experiment.";
const registryPath = path.join(root, "prototypes.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const port = Number(option("port") ?? 4174 + registry.prototypes.length);

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error("--slug is required and must use lowercase kebab-case.");
}
if (!name) throw new Error("--name is required.");
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error("--port must be an integer between 1024 and 65535.");
}
if (
  registry.prototypes.some(
    (prototype) => prototype.localUrl === `http://localhost:${port}/`,
  )
) {
  throw new Error(`Port ${port} is already registered to another prototype.`);
}

const target = path.join(root, "prototypes", slug);
if (existsSync(target)) throw new Error(`Prototype already exists: ${target}`);

const template = path.join(root, "tooling", "templates", "react-vite");
cpSync(template, target, { recursive: true });

function replaceTokens(directory) {
  for (const entry of readdirSync(directory)) {
    const file = path.join(directory, entry);
    if (statSync(file).isDirectory()) {
      replaceTokens(file);
      continue;
    }
    const content = readFileSync(file, "utf8")
      .replaceAll("__SLUG__", slug)
      .replaceAll("__TITLE__", name)
      .replaceAll("__DESCRIPTION__", description)
      .replaceAll("__PORT__", String(port));
    writeFileSync(file, content);
  }
}

replaceTokens(target);

registry.prototypes.push({
  id: slug,
  name,
  description,
  status: "concept",
  workspace: `@wildcrown/${slug}`,
  root: `prototypes/${slug}`,
  outputDir: "dist",
  basePath: `/prototypes/${slug}/`,
  localUrl: `http://localhost:${port}/`,
  previewImage: null,
});
writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

console.log(`Created ${name} at prototypes/${slug}`);
console.log(`Local URL: http://localhost:${port}/`);
console.log(
  "Run npm install, then start the new workspace from its package name.",
);
