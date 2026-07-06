import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const FEED_PATH = 'data/news-feed.json';
const MAX_ITEMS = 350;
const PER_SOURCE_LIMIT = 10;

const SOURCES = [
  { category: 'US & Global AI', source: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', strict: false },
  { category: 'US & Global AI', source: 'Ars Technica AI', url: 'https://arstechnica.com/ai/feed/', strict: false },
  { category: 'US & Global AI', source: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', strict: true },
  { category: 'China AI', source: 'Pandaily', url: 'https://pandaily.com/feed/', strict: true },
  { category: 'China AI', source: 'SCMP Tech', url: 'https://www.scmp.com/rss/5/feed', strict: true },
  { category: 'AI Hardware', source: 'Tom\'s Hardware', url: 'https://www.tomshardware.com/feeds/all', strict: true },
  { category: 'AI Hardware', source: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', strict: true },
  { category: 'Other AI Tech', source: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', strict: false },
  { category: 'Other AI Tech', source: 'MIT News AI', url: 'https://news.mit.edu/topic/artificial-intelligence2/feed', strict: false },
  { category: 'Other AI Tech', source: 'arXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI', strict: false },
  { category: 'AI Policy & Safety', source: 'Future of Life Institute', url: 'https://futureoflife.org/feed/', strict: true },
  { category: 'AI Policy & Safety', source: 'TechCrunch Policy', url: 'https://techcrunch.com/category/policy/feed/', strict: true }
];

const INCLUDE_TERMS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning', 'llm', 'large language model',
  'claude', 'chatgpt', 'openai', 'anthropic', 'gemini', 'google deepmind', 'mistral', 'meta ai',
  'deepseek', 'qwen', 'kimi', 'zhipu', 'bytedance', 'baidu', 'alibaba', 'tencent', 'kuaishou',
  'agent', 'agents', 'agentic', 'automation', 'robot', 'robotics', 'embodied', 'autonomous',
  'gpu', 'nvidia', 'amd', 'intel', 'tsmc', 'semiconductor', 'chip', 'chips', 'accelerator', 'hbm',
  'data center', 'datacenter', 'model', 'inference', 'training', 'reasoning', 'alignment', 'safety',
  'regulation', 'policy', 'copyright', 'benchmark', 'codex', 'claude code', 'cursor', 'windsurf'
];

const EXCLUDE_TERMS = [
  'taylor swift', 'travis kelce', 'ebola', 'heatwave', 'earthquake', 'wildfire', 'forest fire',
  'football', 'basketball', 'playstation', 'half-life', 'gaming keyboard', 'keyboard review',
  'mouse review', 'holiday parade', 'celebrity', 'wedding', 'shark species', 'seafood'
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
    .replace(/&#8217;/g, '’')
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

function normalizeTitle(title = '') {
  return stripHtml(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an|to|of|and|or|for|with|in|on|at|from|by|is|are)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stableId(item) {
  return crypto
    .createHash('sha256')
    .update(`${item.link || ''}|${normalizeTitle(item.title)}|${item.source || ''}`)
    .digest('hex')
    .slice(0, 16);
}

function parseDate(value) {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function relevanceScore(item, strict) {
  const text = `${item.title || ''} ${item.snippet || ''}`.toLowerCase();
  if (EXCLUDE_TERMS.some(term => text.includes(term))) return -10;
  let score = 0;
  for (const term of INCLUDE_TERMS) {
    if (text.includes(term)) score += term.length > 8 ? 2 : 1;
  }
  if (/\b(ai|llm|gpu)\b/i.test(text)) score += 2;
  if (item.category === 'AI Hardware' && /(gpu|nvidia|amd|intel|tsmc|chip|semiconductor|hbm|accelerator|ai pc)/i.test(text)) score += 3;
  if (item.category === 'China AI' && /(deepseek|qwen|kimi|zhipu|alibaba|tencent|baidu|bytedance|kuaishou|huawei|china.*ai|ai.*china)/i.test(text)) score += 3;
  return strict ? score : Math.max(score, 1);
}

function parseFeed(xml, feed) {
  return itemBlocks(xml).slice(0, PER_SOURCE_LIMIT).map(block => {
    const title = stripHtml(tag(block, 'title')) || 'Untitled';
    const link = stripHtml(tag(block, 'link')) || atomLink(block) || '#';
    const publishedAt = parseDate(tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated'));
    const rawSnippet = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const snippet = stripHtml(rawSnippet).slice(0, 260);
    const item = {
      id: '',
      title,
      link,
      source: feed.source,
      category: feed.category,
      publishedAt,
      fetchedAt: new Date().toISOString(),
      snippet,
      score: 0
    };
    item.score = relevanceScore(item, feed.strict);
    item.id = stableId(item);
    return item;
  }).filter(item => item.score > 0);
}

async function fetchSource(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'ai-learning-jomnaik-news-bot/1.1 (+https://github.com/shensiongchoo-art/ai-learning-jomnaik)'
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

function keepRelevantExisting(item) {
  const category = item.category || 'Other AI Tech';
  const strict = ['China AI', 'AI Hardware', 'AI Policy & Safety'].includes(category);
  const cleaned = {
    ...item,
    title: stripHtml(item.title || 'Untitled'),
    snippet: stripHtml(item.snippet || '').slice(0, 260),
    category,
    source: item.source || 'Unknown source'
  };
  cleaned.score = relevanceScore(cleaned, strict);
  cleaned.id = item.id || stableId(cleaned);
  return cleaned.score > 0 ? cleaned : null;
}

async function main() {
  await fs.mkdir('data', { recursive: true });
  const existing = (await readExisting()).map(keepRelevantExisting).filter(Boolean);
  const fetched = (await Promise.all(SOURCES.map(fetchSource))).flat();

  const byTitle = new Map();
  for (const item of [...existing, ...fetched]) {
    const key = normalizeTitle(item.title);
    const current = byTitle.get(key);
    if (!current || sortKey(item) > sortKey(current)) byTitle.set(key, item);
  }

  const oldIds = new Set(existing.map(item => item.id));
  const merged = [...byTitle.values()]
    .sort((a, b) => sortKey(b) - sortKey(a))
    .slice(0, MAX_ITEMS)
    .map(({ score, ...item }) => item);

  const newCount = merged.filter(item => !oldIds.has(item.id)).length;
  await fs.writeFile(FEED_PATH, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Fetched ${fetched.length} relevant items, appended ${newCount} new items, stored ${merged.length} total relevant items.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
