# Angular Portfolio — Serhii Deineko

Personal portfolio of a frontend developer, built with Angular 22 and prerendered
to static HTML. Live at **[serhii.com.pl](https://serhii.com.pl)**.

## Features

- **Angular 22** — standalone components, signals, zoneless change detection
- **Prerendered** — the home page and every project page are written to static
  HTML at build time, so crawlers and social scrapers get full markup
- **Client hydration** with event replay
- **i18n** — five languages (EN, UA, DE, FR, PL) via `@ngx-translate`
- **Dark / light theme** with no flash on first paint
- **Responsive** — desktop, tablet and phone layouts
- **SCSS design tokens** — CSS custom properties for colour, type scale and motion
- **Firebase Hosting** — deployed manually with a single command

## Tech stack

| Area          | Tool                                                |
| ------------- | --------------------------------------------------- |
| Framework     | Angular 22                                          |
| Language      | TypeScript 6                                        |
| Styling       | SCSS (no CSS framework)                             |
| UI components | Angular Material 22, Angular CDK                    |
| i18n          | `@ngx-translate/core` 18                            |
| Reactivity    | Angular signals, RxJS 7                             |
| Prerendering  | `@angular/ssr` with `outputMode: static`            |
| Testing       | Vitest 4 via `@angular/build:unit-test`             |
| Linting       | ESLint 9, `angular-eslint`, `eslint-plugin-sonarjs` |
| Formatting    | Prettier 3                                          |
| Analytics     | Umami (cookieless)                                  |
| Hosting       | Firebase Hosting                                    |

## Project structure

```
src/
├── app/
│   ├── core/                # App-wide services
│   │   ├── i18n/            # Translate loaders
│   │   ├── language.ts      # Locale state and switching
│   │   ├── theme.ts         # Dark/light theme
│   │   ├── seo.ts           # Title, meta, canonical, JSON-LD
│   │   ├── scroll.ts        # Section scrolling
│   │   ├── sections.ts      # Section registry and route aliases
│   │   ├── storage.ts       # Safe localStorage wrapper
│   │   ├── page-loading.ts  # First-paint loading state
│   │   └── redirect.guard.ts
│   ├── features/
│   │   ├── home/            # Home page
│   │   │   ├── hero/
│   │   │   ├── projects/    # Project list
│   │   │   └── experience/
│   │   └── project/         # Project detail page (/project/:id)
│   ├── layout/
│   │   ├── app-header/      # Nav + language and theme switchers
│   │   ├── app-contact/
│   │   └── app-footer/
│   ├── shared/
│   │   ├── data/projects/   # Project definitions, model and store
│   │   ├── directives/      # External link, hero image, pause offscreen
│   │   └── ui/              # CTA button, social icon, sub-header
│   ├── app.routes.ts        # Client routes
│   └── app.routes.server.ts # Prerender params
├── assets/
│   └── i18n/                # en, ua, de, fr, pl
├── styles/                  # Tokens, layout, typography, breakpoints, reset
├── testing/                 # Test helpers
└── index.html
```

Static files that ship as-is — images, icons, the CV PDFs and `sitemap.xml` —
live in `public/`.

## Getting started

### Prerequisites

- Node.js 22 (the CI pipeline runs on 22)
- Yarn 1.x

### Install

```bash
yarn install
```

### Development server

```bash
yarn start
```

Available at `http://localhost:4200`.

### Production build

```bash
yarn build
```

Prerenders the home page and every project page to static HTML into
`dist/browser` — this is exactly what gets deployed.

### Tests

```bash
yarn test       # watch mode
yarn test:ci    # single run
```

### Lint and format

```bash
yarn lint
yarn format:check
yarn format       # write
```

## Deployment

Deployment is manual — there is no active CI pipeline, so pushing to `main`
does not ship anything.

```bash
yarn global add firebase-tools
firebase login
yarn deploy
```

`yarn deploy` builds and uploads, but runs no checks of its own. Run the gates
first:

```bash
yarn lint && yarn test:ci
```

To preview the exact production output locally on http://127.0.0.1:5000:

```bash
yarn preview
```

See [DEPLOY.md](DEPLOY.md) for the full guide, including how direct links are
protected from 404s and how to add a new project page.

## Privacy

No backend of its own and no cookies for tracking. Outbound requests are limited
to Google Fonts and the cookieless Umami analytics script. The only values kept in
`localStorage` are the chosen theme and language.

## License

MIT — see [LICENSE](LICENSE).

## Author

**Serhii Deineko** — Angular Frontend Developer

- Site: [serhii.com.pl](https://serhii.com.pl)
- GitHub: [@serhii-deineko](https://github.com/serhii-deineko)
- LinkedIn: [serhii-deineko](https://www.linkedin.com/in/serhii-deineko/)
