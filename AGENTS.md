# Wildcrown prototype repository

## Architecture rules

- Put every playable experiment in `prototypes/<prototype-slug>` as an independent npm workspace.
- Put reusable visual primitives and tokens in `packages/ui`, reusable runtime utilities in `packages/prototype-kit`, and shared Vite behavior in `packages/vite-config`.
- Do not copy shared utilities into individual prototypes. Improve the shared package and add a test when multiple prototypes need the behavior.
- Register every prototype in `prototypes.json`; use `npm run new:prototype -- --slug <slug> --name "<name>"` for new work.
- Preserve prototype-specific `AGENTS.md` instructions.

## Completion checks

- Run `npm run check` after structural or shared-package changes.
- Run the affected prototype in the browser and verify the primary interaction manually.
- Keep generated build output, local environment files, and Vercel linkage out of git.
- Do not deploy or link a Vercel project unless the user explicitly requests it.
