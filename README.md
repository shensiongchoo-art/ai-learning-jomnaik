# AI Learning JomNaik

Static AI literacy learning hub with an AI News Hub.

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
