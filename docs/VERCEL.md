# Vercel deployment plan

The repository is prepared for a single static Vercel project, but it is intentionally not linked or deployed yet.

## Recommended project settings

- Root directory: repository root
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `apps/prototype-hub/dist`
- Framework preset: Other

The checked-in `vercel.json` supplies the build and output settings. `.vercel/` remains local and ignored.

## Link later

```powershell
vercel link
vercel build
vercel deploy
```

Run these only when the repository is ready to become a shared preview. No database, authentication, or secret environment variables are required for the current static prototypes.
