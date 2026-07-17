# Simplified Chinese translation review workflow

The current `zh-CN/` pages are suitable as Simplified Chinese learning material, but terminology should still be reviewed periodically because AI terminology is moving quickly.

## Current status

- Core page terminology has been cross-checked against Mainland/Simplified Chinese sources where feasible.
- The current wording is not a raw machine translation; it is adapted for Mandarin-speaking beginners.
- The pages should still receive native-reader review before being treated as professionally reviewed Chinese course material.

## Source hierarchy

1. China national standards and official terminology bodies:
   - GB/T 41867-2022, `信息技术 人工智能 术语`
   - 全国科学技术名词审定委员会 / 术语在线
2. Official Simplified Chinese vendor docs:
   - OpenAI, Anthropic, Google Cloud, Google for Developers, Microsoft Learn, AWS
3. Reputable education/technical glossaries for unsettled fast-moving GenAI terms.
4. AI translation or AI rewrite as draft support only.

## Review checklist

- Uses Mainland Simplified Chinese, not Traditional Chinese or region-specific phrasing.
- Uses the project glossary in `docs/CHINESE_AI_GLOSSARY.md`.
- Preserves English product names and API labels that learners will see in real interfaces.
- Distinguishes model `词元（token）` from security `访问令牌（access token）`.
- Uses `AI 智能体 / 智能体` for AI agents unless a vendor label specifically says `代理`.
- Explains `幻觉` as a metaphor for plausible but unsupported or false output.
- Keeps time-sensitive product details out of lesson prose unless there is a visible review date.
- Checks quiz answers after any wording change.

## Publishing rule

Do not mark the Chinese version as professionally reviewed until a native Simplified Chinese reviewer has reviewed the glossary and representative modules.

## Last terminology pass

- Date: 2026-07-18
- Scope: glossary, documentation, and consistency scan across `zh-CN/`
- Outcome: existing lesson terminology is broadly aligned; documentation was strengthened and minor translation-guide consistency issues were corrected.
- References: see `docs/CHINESE_AI_GLOSSARY.md#references-used`.
