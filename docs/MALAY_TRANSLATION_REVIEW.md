# Malaysian Malay translation review workflow

The current `ms-MY/` pages should be treated as AI-assisted draft copy until reviewed by a Malaysian Malay speaker or professional translator.

## Why this matters

AI can produce usable first drafts, but Bahasa Melayu education material needs natural Malaysian phrasing, consistent terminology, and a local reviewer. This is especially important for AI terms where English product language, Malay computing terms, and classroom-friendly wording overlap.

## Recommended source hierarchy

1. Dewan Bahasa dan Pustaka (DBP) references for Malay wording and terminology.
2. Official product documentation for exact product names and feature labels.
3. A professional translator or Malaysian Malay reviewer for fluency, tone, and pedagogy.
4. AI translation only as a first draft, not the final authority.

Useful references:

- Kamus Dewan Perdana / Kamus DBP: https://kamus.dbp.gov.my/
- PRPM DBP search: https://prpm.dbp.gov.my/
- DBP Sistem Bahasa Melayu Bersepadu: https://sbmb.dbp.gov.my/
- Project glossary: `docs/MALAY_AI_GLOSSARY.md`

## Glossary policy

Keep product names unchanged: ChatGPT, Claude, Claude Code, Codex, OpenAI, Anthropic, MCP, API.

Use Malay plus the English term on first mention:

| English | Draft Malay | Review note |
| --- | --- | --- |
| artificial intelligence | kecerdasan buatan | DBP-recognised term. |
| Large Language Model (LLM) | model bahasa besar (large language model, LLM) | Needs reviewer confirmation for beginner material. |
| token | token / cebisan teks | Keep `token`; explain as text chunk. |
| context window | tetingkap konteks (context window) | Needs consistency check. |
| prompt | gesaan (prompt) | Confirm whether `prompt` should remain primary for learners. |
| hallucination | halusinasi (hallucination) | Explain as unsupported but plausible AI output. |
| reasoning | penaakulan / analisis berstruktur | Prefer the phrase that sounds natural in context. |
| agent | ejen AI / agent | Use product-category wording carefully. |

## Review checklist

- Sounds natural to a Malaysian Malay learner, not word-for-word English.
- Uses DBP-compatible terms where available.
- Keeps global AI product labels unchanged.
- Avoids brittle model names, prices, context sizes, and plan-specific claims.
- Preserves safety nuance: AI can be useful but must be verified.
- Quiz answers remain correct after translation.
- Navigation and buttons use consistent Malay labels.

## Publishing rule

Do not remove the BM draft banner until a human reviewer has signed off the pages or the glossary and representative modules have been reviewed.
