# Deployment & Hosting Guide

The site is hosted on Firebase Hosting as a prerendered static Angular application. Static HTML files are generated at build time for defined routes, while client-side routing handles deep links and fallback paths.

## Deployment Target

| Parameter            | Value                          |
| -------------------- | ------------------------------ |
| **Firebase Project** | `serhii-deineko`               |
| **Build Command**    | `yarn build`                   |
| **Output Directory** | `dist/browser`                 |
| **Production URL**   | https://serhii.com.pl          |
| **Firebase Default** | https://serhii-deineko.web.app |

## Deploying to Production

Deployments are executed manually via the Firebase CLI:

```bash
# Verify code quality and test suite
yarn lint && yarn test:ci

# Build and deploy to Firebase Hosting
yarn deploy
```

`yarn deploy` executes `ng build` and uploads the resulting `dist/browser` directory to Firebase Hosting.

## Local Emulation & Preview

To preview the production build with Firebase routing, rewrites, and security headers:

```bash
yarn preview
```

This builds the application and boots the Firebase Hosting emulator on `http://127.0.0.1:5000`.

## Routing & Fallback Architecture

To support both pre-rendered static routes and dynamic SPA navigation without 404 errors:

1. **Static Pre-rendered Pages**: Routes like `/` and `/project/:id` are served directly as pre-generated HTML files (`index.html`, `project/<id>/index.html`) for fast initial delivery and SEO crawling.
2. **Rewrite Fallback (`index.csr.html`)**: Deep links, page refreshes, and unrendered routes rewrite to `index.csr.html` (the client shell) via `firebase.json`. Targeting `index.csr.html` instead of `index.html` prevents hydration conflicts and avoids flashing the home page markup on project subpages.
3. **Client Wildcard Route**: In-app routing redirects any unmapped client paths back to the home view.
4. **Canonical URLs**: `trailingSlash: false` in `firebase.json` ensures consistent URL canonicalization matching `SeoService`.

## Adding a New Project Case Study

To register a new project in the portfolio:

1. Add the project data model to `PROJECTS_DEFINITIONS` in `src/app/shared/data/projects/`.
2. Add the localized copy and project identifiers across `src/assets/i18n/*.json`.
3. Place screenshots and assets into `public/projects/<project-id>/`.
4. Add the new route to `public/sitemap.xml`.
5. Run `yarn build` to confirm static HTML is generated for the new route.

`getPrerenderParams` in `src/app/routes.server.ts` automatically discovers project IDs from `en.json` that match `PROJECTS_DEFINITIONS` during build time.

## CI/CD Workflows (GitHub Actions)

Automated deployment workflows are preserved in `.github/workflows.disabled/`:

- `firebase-hosting-merge.yml`: Automatically deploys to production on push to `main`.
- `firebase-hosting-pull-request.yml`: Runs tests, linting, and deploys PR preview channels.

To activate them:

```bash
git mv .github/workflows.disabled .github/workflows
```

Ensure the repository secret `FIREBASE_SERVICE_ACCOUNT_SERHII_DEINEKO` is configured with the Firebase Hosting Admin role.

## Docker Deployment (Nginx)

The project includes an alternative Nginx container configuration:

```bash
docker build -t portfolio .
docker run -p 8080:80 portfolio
```

`nginx.conf` mirrors Firebase Hosting's caching and routing behavior (`try_files $uri $uri/index.html /index.csr.html`).

## Security & HTTP Headers

HTTP response headers configured in `firebase.json` and `nginx.conf`:

- `Strict-Transport-Security` (HSTS: 1 year, preload)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricting camera, microphone, and geolocation
