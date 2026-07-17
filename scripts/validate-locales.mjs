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

const failures = [];

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

for (const file of lessonFiles) {
  const zhFile = `zh-CN/${file}`;
  if (!exists(file)) fail(file, 'missing English lesson file');
  if (!exists(zhFile)) fail(zhFile, 'missing Chinese lesson file');
  if (!exists(file) || !exists(zhFile)) continue;

  const en = read(file);
  const zh = read(zhFile);

  if (!/<html\s+lang=["']en["']/.test(en)) fail(file, 'expected html lang="en"');
  if (!/<html\s+lang=["']zh-CN["']/.test(zh)) fail(zhFile, 'expected html lang="zh-CN"');

  if (!/assets\/language-switcher\.js["'][^>]*data-locale=["']en["']/.test(en)) {
    fail(file, 'missing English language switcher script');
  }
  if (!/\.\.\/assets\/language-switcher\.js["'][^>]*data-locale=["']zh-CN["']/.test(zh)) {
    fail(zhFile, 'missing Chinese language switcher script');
  }

  checkLocalRefs(file, en);
  checkLocalRefs(zhFile, zh);
  checkScriptSyntax(file, en);
  checkScriptSyntax(zhFile, zh);
}

if (!exists('assets/language-switcher.js')) {
  fail('assets/language-switcher.js', 'missing shared language switcher');
}

if (failures.length) {
  console.error('Locale validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Locale validation passed for ${lessonFiles.length} English pages and ${lessonFiles.length} Chinese pages.`);
