export const PROTOTYPE_STATUSES = Object.freeze([
  "concept",
  "testing",
  "playable",
  "archived",
]);

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function definePrototype(prototype) {
  if (!prototype?.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(prototype.id)) {
    throw new Error("Prototype id must be a lowercase kebab-case slug.");
  }
  if (!prototype.name) throw new Error("Prototype name is required.");
  if (!PROTOTYPE_STATUSES.includes(prototype.status)) {
    throw new Error(`Unknown prototype status: ${prototype.status}`);
  }
  return Object.freeze({ ...prototype });
}

export function formatPrototypeStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function createSeededRandom(seed = 1) {
  let state = Math.trunc(seed) || 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
