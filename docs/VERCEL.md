# Vercel deployment

The repository is connected to the `auxerion-projects/wildcrown` Vercel project and deploys from the `main` branch of `tdunniway/Wildcrown`.

- Production: [wildcrown.vercel.app](https://wildcrown.vercel.app)
- Prototype hub: `/`
- Crown Arena: `/prototypes/arena-war-table/`

## Recommended project settings

- Root directory: repository root
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `apps/prototype-hub/dist`
- Framework preset: Other

The checked-in `vercel.json` supplies the build and output settings. Local project linkage in `.vercel/` remains ignored by Git.

## Local workflow

```powershell
vercel link --project wildcrown --scope auxerion-projects
vercel build
vercel deploy              # preview
vercel deploy --prod       # production, only when explicitly requested
```

Pushes to `main` also create production deployments through the connected GitHub repository. No database, authentication, or application secrets are required for the current static prototypes.

## Verified production state

On 2026-10-11, the hub and Arena route loaded successfully, a complete combat round resolved correctly, and the browser console contained no warnings or errors.
