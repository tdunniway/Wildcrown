# Initial repository setup log

Date: 2026-10-11

Workspace: `C:\Wildcrown`

Remote: `https://github.com/tdunniway/Wildcrown.git`

## Preflight

```text
git 2.55.0.windows.1
node v24.18.0
npm 11.16.0
GitHub CLI 2.96.0
Vercel CLI 63.1.2
GitHub account: tdunniway
Vercel account: tdunniway-6329
Remote state: repository exists and had no branches
Vercel state: intentionally not linked or deployed
```

## Install

Command: `npm install`

```text
added 45 packages in 12s
```

## Quality gate

Command: `npm run check`

```text
Formatting: passed (all matched files use Prettier code style)
Repository contract tests: 3 passed, 0 failed
Prototype kit tests: 3 passed, 0 failed
Prototype hub build: passed (Vite 8.3.4)
Arena War Table build: passed (Vite 8.3.4)
Sites packaging: passed
Showcase assembly: passed
Assembled build verification: hub + 1 active prototype passed
```

## Decisions

- npm workspaces provide the monorepo foundation without another orchestration dependency.
- Each prototype remains independently runnable and owns its state and experiments.
- Shared UI, prototype helpers, and Vite configuration live in versioned workspace packages.
- One registry drives the hub, local URLs, lifecycle status, and production assembly.
- One static artifact will let Vercel host the hub and all active prototypes together.
- Vercel linkage, cloud build verification, and deployment are deferred until explicitly requested.
