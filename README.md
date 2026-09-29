# AimReboot public dashboard

Public dashboard: https://itay123458.github.io/aimreboot-dashboard/

A responsive black-and-gold public preview. Feature cards open detail panels and visitors can copy `/help`. Bot commands and dashboard configuration remain paused during development. This dashboard uses no credentials or private guild data.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

## GitHub Pages

The Dashboard Pages workflow builds and publishes changes to this repository on `main`. It can also be run manually. The Pages source must be set to GitHub Actions.

To reproduce the static build in a shell supporting environment prefixes:

```sh
AIMREBOOT_PAGES_BUILD=true npm run build
node scripts/prepare-pages.mjs
```

The output is `out/`. The preparation script places assets under the repository URL and checks that referenced assets exist. Only static public files are published; bot source, credentials, and server build output are excluded.

`npm run lint` checks dashboard-owned code; generated shadcn components retain their upstream defaults. `npx tsc --noEmit` checks the entire project.

The original Sites configuration remains available in `.openai/hosting.json`. Building without `AIMREBOOT_PAGES_BUILD` retains its existing server deployment format. GitHub Pages is now the primary public address.
