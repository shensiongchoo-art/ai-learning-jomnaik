import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lessonFiles = [
  'index.html',
  ...Array.from({ length: 14 }, (_, i) => `module_${String(i + 1).padStart(2, '0')}_${[
    'what_is_llm',
    'tokens',
    'context_window',
    'temperature',
    'hallucination',
    'who_is_claude',
    'prompting_claude',
    'projects_memory',
    'system_prompts',
    'claude_code',
    'what_is_chatgpt',
    'chatgpt_features',
    'codex_api',
    'chatgpt_vs_claude',
  ][i]}.html`),
];

const locales = [
  { code: 'en', dir: '', lang: 'en', scriptPath: 'assets/language-switcher.js' },
  { code: 'zh-CN', dir: 'zh-CN', lang: 'zh-CN', scriptPath: '../assets/language-switcher.js' },
  { code: 'ms-MY', dir: 'ms-MY', lang: 'ms-MY', scriptPath: '../assets/language-switcher.js' },
];

const failures = [];

function relFor(locale, file) {
  return locale.dir ? `${locale.dir}/${file}` : file;
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function fail(relPath, message) {
  failures.push(`${relPath}: ${message}`);
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function checkLocalRefs(relPath, html) {
  const dir = path.dirname(relPath);
  const attrRe = /\b(?:href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrRe)) {
    const raw = decodeHtml(match[1]).trim();
    if (
      !raw ||
      raw.startsWith('#') ||
      raw.startsWith('http://') ||
      raw.startsWith('https://') ||
      raw.startsWith('mailto:') ||
      raw.startsWith('tel:') ||
      raw.startsWith('data:') ||
      raw.startsWith('javascript:')
    ) {
      continue;
    }

    const [withoutHash] = raw.split('#');
    const [target] = withoutHash.split('?');
    if (!target) continue;

    const normalized = path.normalize(path.join(dir, target));
    if (normalized.startsWith('..')) {
      fail(relPath, `local reference escapes repo: ${raw}`);
      continue;
    }
    if (!exists(normalized)) {
      fail(relPath, `missing local reference: ${raw}`);
    }
  }
}

function checkScriptSyntax(relPath, html) {
  const inlineScriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  const htmlWithoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  let scriptIndex = 0;
  for (const match of html.matchAll(inlineScriptRe)) {
    scriptIndex += 1;
    try {
      new Function(match[1]);
    } catch (error) {
      fail(relPath, `inline script ${scriptIndex} syntax error: ${error.message}`);
    }
  }

  const handlerRe = /\bon[a-z]+=(["'])([\s\S]*?)\1/gi;
  let handlerIndex = 0;
  for (const match of htmlWithoutScripts.matchAll(handlerRe)) {
    handlerIndex += 1;
    try {
      new Function(decodeHtml(match[2]));
    } catch (error) {
      fail(relPath, `inline event handler ${handlerIndex} syntax error: ${error.message}`);
    }
  }
}

function hasScript(html, src, localeCode) {
  const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}["'][^>]*data-locale=["']${localeCode}["']`).test(html);
}

for (const file of lessonFiles) {
  for (const locale of locales) {
    const relPath = relFor(locale, file);
    if (!exists(relPath)) {
      fail(relPath, `missing ${locale.code} lesson file`);
      continue;
    }

    const html = read(relPath);
    if (!new RegExp(`<html\\s+lang=["']${locale.lang}["']`).test(html)) {
      fail(relPath, `expected html lang="${locale.lang}"`);
    }
    if (!hasScript(html, locale.scriptPath, locale.code)) {
      fail(relPath, `missing ${locale.code} language switcher script`);
    }
    checkLocalRefs(relPath, html);
    checkScriptSyntax(relPath, html);
  }
}

for (const asset of ['assets/language-switcher.js']) {
  if (!exists(asset)) fail(asset, 'missing shared asset');
}

if (failures.length) {
  console.error('Locale validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Locale validation passed for ${lessonFiles.length} pages across ${locales.length} locales.`);
