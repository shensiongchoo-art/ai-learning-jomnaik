# AI Learning JomNaik

Static AI literacy learning hub with an AI News Hub.

## Translations

The English lessons remain the source pages at the repository root. Translated versions live under locale folders with matching filenames:

- `index.html` ↔ `zh-CN/index.html`
- `index.html` ↔ `ms-MY/index.html`
- `module_10_claude_code.html` ↔ `zh-CN/module_10_claude_code.html`
- `module_10_claude_code.html` ↔ `ms-MY/module_10_claude_code.html`

Each lesson loads `assets/language-switcher.js`, which adds an English / 简体中文 / Bahasa Melayu selector pointing to the matching page. Translation style guidance lives in `docs/TRANSLATION_GUIDE.md`.

The shared switcher also includes a light color mode toggle while preserving the original page styling as the default.

The Malaysian Malay pages are currently marked as DBP-referenced AI-assisted draft translations pending local language review. The review workflow is documented in `docs/MALAY_TRANSLATION_REVIEW.md`; the working glossary is in `docs/MALAY_AI_GLOSSARY.md`.

Run the locale check before publishing translation changes:

```bash
node scripts/validate-locales.mjs
```

## Curriculum freshness model

The AI News Hub is the current-events layer. Core lessons should stay focused on mandatory fundamentals: LLMs, tokens, context, hallucination, prompting, system prompts, RAG, memory, APIs, agents, safety, and comparison literacy.

Use news as a signal for review, not as an automatic lesson rewrite. The detailed update policy is in `docs/CONTENT_UPDATE_PLAN.md`.

## AI News Hub scheduled feed

The news page now reads from `data/news-feed.json` instead of relying on browser-side CORS proxies for the main feed.

A GitHub Actions workflow runs twice daily and can also be started manually:

- Workflow: `.github/workflows/update-ai-news.yml`
- Fetcher: `scripts/fetch-ai-news.mjs`
- Saved feed: `data/news-feed.json`
- Frontend: `news.html`

Each workflow run fetches configured public RSS sources, appends newly discovered items, sorts the feed newest-first, keeps the latest 500 items, and commits the updated JSON back to the repository.

## Manual refresh

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Select **Update AI News Feed**.
4. Click **Run workflow**.

If new items are found, the workflow commits `data/news-feed.json` automatically.

## Notes

- The static page renders saved JSON using DOM APIs and does not inject raw RSS HTML into the page.
- The scheduled feed is intended for lightweight public news aggregation, not full article scraping.
- To add or remove sources, edit the `SOURCES` array in `scripts/fetch-ai-news.mjs`.
