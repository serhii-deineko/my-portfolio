<div align="center">

# Serhii Deineko — Portfolio

Source code for my personal portfolio and case studies at **[serhii.com.pl](https://serhii.com.pl)**.

[![Website](https://img.shields.io/badge/Website-serhii.com.pl-10b981?style=flat-square&logo=googlechrome&logoColor=white)](https://serhii.com.pl)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)

</div>

---

## Overview

This repository contains the source code for my personal website and project portfolio. It showcases commercial web applications, interactive configurators, and case studies I have engineered.

The application is built on Angular 22 using zoneless change detection and standalone architecture, prerendered to static HTML at build time for fast initial delivery and SEO, and hosted on Firebase.

## Key Highlights

- **Zoneless Angular 22** — Standalone components with state driven by Angular Signals (`provideExperimentalZonelessChangeDetection`), without zone.js overhead.
- **Static Prerendering (SSG)** — Pre-rendered at build time with `@angular/ssr` for fast first paint and social sharing previews, followed by client hydration.
- **Multilingual** — Full localization across 5 languages (English, Ukrainian, German, French, Polish) via `@ngx-translate`.
- **Theming** — Dark and light modes with system preference detection (`prefers-color-scheme`) and local storage persistence.
- **Custom SCSS Architecture** — Clean design system built with CSS custom properties, fluid typography, and modular stylesheets without third-party UI frameworks.
- **Privacy First** — Cookieless analytics with Umami, zero tracking cookies or external ad scripts.

## Tech Stack

| Category                   | Tools & Libraries                                               |
| -------------------------- | --------------------------------------------------------------- |
| **Frontend**               | Angular 22, TypeScript 6, Signals, RxJS 7                       |
| **Components & Styling**   | Angular Material 22, Angular CDK, SCSS (CSS variables & mixins) |
| **Localization**           | `@ngx-translate/core` (EN, UA, DE, FR, PL)                      |
| **Build & SSR**            | `@angular/ssr`, Vite, Angular CLI                               |
| **Testing**                | Vitest 4 via `@angular/build:unit-test`                         |
| **Code Quality**           | ESLint 9, `angular-eslint`, SonarJS, Prettier 3                 |
| **Deployment & Analytics** | Firebase Hosting, Umami Analytics                               |

## Project Structure

```
src/
├── app/
│   ├── core/         # Core services (i18n, theming, SEO, routing)
│   ├── features/     # Feature views (home, project case studies)
│   ├── layout/       # Shell components (header, footer, nav)
│   └── shared/       # Shared UI primitives, custom directives, data models
├── assets/i18n/      # Localization dictionaries
├── styles/           # Global SCSS (tokens, typography, reset)
└── public/           # Static assets (images, icons, CV documents, sitemap)
```

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn 1.x

### Installation

```bash
yarn install
```

### Development

```bash
yarn start
```

Runs the development server on `http://localhost:4200`.

### Building

```bash
yarn build
```

Prerenders static routes into `dist/browser` for production deployment.

### Testing & Linting

```bash
# Run unit tests
yarn test

# Single run for CI
yarn test:ci

# Run linting
yarn lint

# Check code formatting
yarn format:check
```

## Deployment

The application deploys to Firebase Hosting:

```bash
# Preview production build locally in the Firebase emulator
yarn preview

# Deploy to Firebase Hosting
yarn deploy
```

For configuration details, routing fallbacks (`index.csr.html`), and instructions for adding project case studies, refer to [DEPLOY.md](DEPLOY.md).

## Author

**Serhii Deineko** — Frontend Developer

- Website: [serhii.com.pl](https://serhii.com.pl)
- LinkedIn: [linkedin.com/in/serhii-deineko](https://www.linkedin.com/in/serhii-deineko/)
- GitHub: [@serhii-deineko](https://github.com/serhii-deineko)
- Telegram: [@serhiideineko](https://t.me/serhiideineko)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
