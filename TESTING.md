# CI Pipeline Test Environment

A minimal Vite + React app, deliberately seeded with one real, verified issue
per CI job, so you can push this to a scratch GitHub repo and watch each
check actually catch something — then fix it and watch it turn green.

## Setup

```bash
git init
git add .
git commit -m "initial test env"
gh repo create your-username/ci-test-env --private --source=. --push
```

Push to a branch, open a PR into `main`, and watch the Actions tab.

## What's seeded, and what should happen

| Job | What's seeded | Expected result | How to fix it |
|---|---|---|---|
| `lint` | Nothing — clean | ✅ passes immediately | — |
| `secret-scan` | Fake AWS key in `src/config.sample.ts` (the well-known AWS example dummy key, not a real credential) | ❌ Gitleaks flags it | Delete `config.sample.ts` or replace with `process.env.AWS_ACCESS_KEY` |
| `license-check` | Local dummy package `fake-gpl-dep` declared as `GPL-3.0` in `package.json` | ❌ exits non-zero, "Found license defined by the --failOn flag: GPL-3.0" | `npm uninstall fake-gpl-dep` |
| `dependency-review` | Same GPL dep (PR-only job — only fires when this is opened as a PR, not a push) | ❌ flags disallowed license in the diff | Same as above |
| `security-scan` | Nothing seeded — `npm audit` is non-blocking by design here, CodeQL scans real code patterns | ✅ passes, audit results land as a downloadable artifact | — |
| `build` | Nothing — clean | ✅ passes, produces `dist/` artifact | — |
| `accessibility-audit` | `App.tsx` has 4 intentional WCAG violations (missing alt text, unlabeled icon button, low-contrast text, unlabeled input) | ❌ pa11y lists each violation with DOM node + WCAG criterion | Fix one at a time in `src/App.tsx`, see comment block above the JSX |
| `performance-audit` | Nothing seeded — small app should score well by default | ✅ passes (adjust thresholds in `lighthouserc.json` if you want to test a failure here too) | — |

## Testing locally before pushing (faster feedback)

```bash
# lint
npm run lint

# license-check
npx license-checker --production --failOn "GPL-3.0;AGPL-3.0;LGPL-3.0" --summary

# build
npm run build

# accessibility (after build)
npx serve -s dist -l 5000 &
npx wait-on http://localhost:5000
npx pa11y http://localhost:5000

# performance (after build)
npx lhci autorun --config=./lighthouserc.json
```

Secret scanning needs real git history to run properly (`gitleaks detect
--source .` locally), since it diffs commits — a single working-directory
file isn't enough to fully exercise it outside CI.

## Using `act` to test the workflow file itself without pushing

```bash
brew install act
act push -j lint
act push -j license-check
```

`dependency-review-action` and the CodeQL upload step won't work correctly
under `act` (they need real GitHub API context) — test those by actually
pushing to GitHub.

## Once everything's green

Delete `src/config.sample.ts`, `fake-gpl-dep` (and the sibling
`../fake-gpl-package` folder), and fix the four a11y issues in `App.tsx`.
Re-run — every job should pass. At that point you have a known-good baseline
to diff your real pipeline changes against.
