# Wildcrown Prototypes

One repository for building, comparing, and shipping Wildcrown gameplay prototypes.

## Start locally

```powershell
npm install
npm run dev
```

- Prototype hub: `http://localhost:4174`
- Crown Arena: `http://localhost:4173`

## Repository map

```text
apps/prototype-hub/       Browse every registered prototype
packages/ui/              Shared Wildcrown tokens and React primitives
packages/prototype-kit/   Shared prototype/runtime utilities
packages/vite-config/     Shared React + Vite configuration
prototypes/<slug>/        One isolated playable prototype per folder
tooling/                  Build assembly and prototype creation tools
```

## Add a prototype

```powershell
npm run new:prototype -- --slug expedition-map --name "Expedition Map"
npm install
npm run dev --workspace @wildcrown/expedition-map
```

The generator creates a Vite/React workspace, applies the shared theme and configuration, and adds it to `prototypes.json`.

## Verify everything

```powershell
npm run check
```

The root production build assembles the hub and every prototype into one static output at `apps/prototype-hub/dist`. Vercel publishes that artifact at [wildcrown.vercel.app](https://wildcrown.vercel.app).

See [Architecture](docs/ARCHITECTURE.md) and [Vercel setup](docs/VERCEL.md).
