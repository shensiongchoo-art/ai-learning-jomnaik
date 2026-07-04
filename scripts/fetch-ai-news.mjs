import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const FEED_PATH = 'data/news-feed.json';
const MAX_ITEMS = 500;
const PER_SOURCE_LIMIT = 8;

const SOURCES = [
  { category: 'US & Global AI', source: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { category: 'US & Global AI', source: 'Ars Technica AI', url: 'https://arstechnica.com/ai/feed/' },
  { category: 'US & Global AI', source: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/' },
  { category: 'China AI', source: 'SCMP Tech', url: 'https://www.scmp.com/rss/5/feed' },
  { category: 'China AI', source: 'Pandaily', url: 'https://pandaily.com/feed/' },
  { category: 'China AI', source: 'Reuters Technology', url: 'https://feeds.reuters.com/reuters/technologyNews' },
  { category: 'AI Hardware', source: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml' },
  { category: 'AI Hardware', source: "Tom's Hardware", url: 'https://www.tomshardware.com/feeds/all' },
  { category: 'AI Hardware', source: 'Ars Technica Gadgets', url: 'https://arstechnica.com/gadgets/feed/' },
  { category: 'Other AI Tech', source: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
  { category: 'Other AI Tech', source: 'MIT News AI', url: 'https://news.mit.edu/topic/artificial-intelligence2/feed' },
  { category: 'Other AI Tech', source: 'arXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI' },
  { category: 'AI Policy & Safety', source: 'Future of Life Institute', url: 'https://futureoflife.org/feed/' },
  { category: 'AI Policy & Safety', source: 'TechCrunch Policy', url: 'https://techcrunch.com/category/policy/feed/' },
  { category: 'AI Policy & Safety', source: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/' }
];

function decodeEntities(text = '') {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .trim();
}

function stripHtml(text = '') {
  return decodeEntities(text)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function atomLink(block) {
  const href = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1];
  return href ? decodeEntities(href) : '';
}

function itemBlocks(xml) {
  const rssItems = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map(m => m[0]);
  if (rssItems.length) return rssItems;
  return [...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)].map(m => m[0]);
}

function stableId(item) {
  return crypto
    .createHash('sha256')
    .update(`${item.link || ''}|${item.title || ''}|${item.source || ''}`)
    .digest('hex')
    .slice(0, 16);
}

function parseDate(value) {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function parseFeed(xml, feed) {
  return itemBlocks(xml).slice(0, PER_SOURCE_LIMIT).map(block => {
    const title = stripHtml(tag(block, 'title')) || 'Untitled';
    const link = stripHtml(tag(block, 'link')) || atomLink(block) || '#';
    const publishedAt = parseDate(tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated'));
    const rawSnippet = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const snippet = stripHtml(rawSnippet).slice(0, 220);
    const item = {
      id: '',
      title,
      link,
      source: feed.source,
      category: feed.category,
      publishedAt,
      fetchedAt: new Date().toISOString(),
      snippet
    };
    item.id = stableId(item);
    return item;
  });
}

async function fetchSource(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'ai-learning-jomnaik-news-bot/1.0 (+https://github.com/shensiongchoo-art/ai-learning-jomnaik)'
      }
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const xml = await res.text();
    return parseFeed(xml, feed);
  } catch (err) {
    console.warn(`Feed failed: ${feed.source} — ${err.message}`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function readExisting() {
  try {
    const raw = await fs.readFile(FEED_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sortKey(item) {
  return new Date(item.publishedAt || item.fetchedAt || 0).getTime();
}

async function main() {
  await fs.mkdir('data', { recursive: true });
  const existing = await readExisting();
  const fetched = (await Promise.all(SOURCES.map(fetchSource))).flat();

  const byId = new Map();
  for (const item of existing) byId.set(item.id || stableId(item), item);
  let newCount = 0;
  for (const item of fetched) {
    if (!byId.has(item.id)) newCount += 1;
    byId.set(item.id, { ...byId.get(item.id), ...item });
  }

  const merged = [...byId.values()]
    .sort((a, b) => sortKey(b) - sortKey(a))
    .slice(0, MAX_ITEMS);

  await fs.writeFile(FEED_PATH, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Fetched ${fetched.length} items, appended ${newCount} new items, stored ${merged.length} total items.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
