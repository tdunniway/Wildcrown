# Architecture

## Goals

1. Every prototype stays independently runnable and disposable.
2. Shared code improves once and reaches every prototype through workspace packages.
3. One production build creates a browsable portfolio without coupling prototype state.
4. A new prototype starts from the same tested foundation in under a minute.

## Dependency direction

```text
apps/prototype-hub ─────┐
                       ├──> packages/ui
prototypes/* ──────────┤
                       ├──> packages/prototype-kit
                       └──> packages/vite-config (build-time)
```

Prototypes must not import from another prototype. Shared behavior moves into `packages/`.

## Production assembly

Each prototype builds into its own `dist` directory. `tooling/assemble-showcase.mjs` copies registered outputs beneath the hub's final `dist/prototypes/<id>` folder. This gives Vercel one static deployment artifact while keeping each prototype independently deployable later.

## Prototype lifecycle

- `concept`: interaction skeleton or disposable spike.
- `testing`: complete enough for structured playtesting.
- `playable`: primary loop works from start to result.
- `archived`: retained for decisions and history but no longer active.
