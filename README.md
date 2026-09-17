# Portfolio Website

A personal portfolio site built with React, TypeScript, Vite, and Tailwind CSS. The homepage is a single scrolling page (Hero → Skills → Experience → Projects → X feed → Contact); React Router is used only for individual project detail pages at `/projects/:slug`.

## Running it locally

```bash
npm install
npm run dev       # starts the dev server (usually http://localhost:5173)
npm run build     # type-checks and produces a production build in dist/
npm run lint      # runs oxlint
npm run preview   # serves the production build locally
```

Requires Node.js 20+.

## Which files to edit with your real content

Everything content-related lives in four data files under `src/data/`. Each one is fully typed (see `src/types/index.ts`) and already filled with clearly-fake placeholder content so the site looks complete — replace the values, don't change the shape.

| File | What it controls |
|---|---|
| `src/data/profile.ts` | Your name, role, bio, stats row, resume link, and social links (GitHub/LinkedIn/X/email) — this also feeds the Hero, Footer, and X feed handle |
| `src/data/skills.ts` | Skill categories and the tag chips inside each one |
| `src/data/experience.ts` | Your job history (most recent first) |
| `src/data/projects.ts` | Your projects: summary, description, tech tags, highlights, links, status (`live` / `in-progress` / `archived`), and media gallery |

Other assets to replace:

- **Resume:** swap `public/resume.pdf` for your real resume (keep the same filename, or update `resumeUrl` in `profile.ts`).
- **Profile photo:** the Hero currently shows a generated initials avatar (`src/components/placeholders/AvatarPlaceholder.tsx`). To use a real photo, add an image under `src/assets/` or `public/` and swap it into `src/components/sections/Hero.tsx`.
- **Project media:** each project's `gallery` array in `projects.ts` points at placeholder SVG covers under `public/projects/<slug>/` and placeholder video/YouTube/Vimeo entries. Add your real images/videos under `public/projects/<slug>/` and update the `gallery` entries (or the `youtube`/`vimeo` `id` fields) to match.
- **Favicon / social preview:** `public/favicon.svg` and `public/og-image.svg` are simple generated placeholders — replace with your own branding if you'd like.

## Connecting to Netlify

`netlify.toml` already sets the build command (`npm run build`), publish directory (`dist`), and the SPA redirect rule needed so direct links like `/projects/pulseboard` work instead of 404ing. Pick **one** of the two methods below — don't enable both, or you'll get duplicate deploys.

### Method A — Netlify's Git integration (simplest)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the Netlify dashboard: **Add new site → Import an existing project**, pick the repo.
3. Netlify reads `netlify.toml` automatically for the build command and publish directory.
4. Every push to your default branch triggers a Netlify build/deploy automatically. Leave the `deploy` job in `.github/workflows/ci.yml` unused (it simply won't run unless the two secrets below are set).

### Method B — GitHub Actions-driven deploy

Use this if you'd rather control deploys entirely from GitHub Actions instead of Netlify's own git integration.

1. In Netlify: **Add new site → Deploy manually** (or via the Netlify CLI), and **do not** connect it to your Git repo for continuous deployment.
2. Get your credentials:
   - `NETLIFY_AUTH_TOKEN`: Netlify **User settings → Applications → Personal access tokens → New access token**.
   - `NETLIFY_SITE_ID`: Netlify **Site settings → General → Site details → Site ID**.
3. In your GitHub repo: **Settings → Secrets and variables → Actions**, add both as repository secrets.
4. Push to `master` — the `deploy` job in `.github/workflows/ci.yml` builds the site and deploys it to Netlify using those secrets. The `build-and-lint` job runs lint + build on every push and pull request regardless of which method you choose.

## Notes on runtime network dependencies

Two things load from the network at runtime on the deployed site (unrelated to the placeholder-asset generation, which is fully local):

- **Google Fonts** (Fraunces, Sora, JetBrains Mono) via `<link>` tags in `index.html`.
- **X's `widgets.js`** embed script in the "Latest on X" section, which reads the handle from `profile.social.twitterHandle`. With the placeholder handle this will render an empty/broken embed — it'll work once you put in a real X handle.

## Stretch goals (not implemented yet)

These are intentionally left for later:

- **GitHub repos widget:** a Netlify serverless function that calls GitHub's public API to list your repos near the Projects section.
- **Real contact form backend:** `src/components/sections/Contact.tsx` has a `// TODO` comment marking exactly where to add a real API call (e.g. to a Netlify Function that sends an email) once you have an email-sending API key. Right now the form validates client-side and shows a "message sent" confirmation, but doesn't send anywhere.
