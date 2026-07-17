# AI learning content update plan

This project should stay current without turning every lesson into a news feed. The rule is simple: fundamentals are mandatory and stable; news is a signal for review.

## Mandatory fundamentals

These topics must stay covered even if product names and model rankings change:

- LLM basics
- token
- context and context window
- temperature
- hallucination and verification
- prompting
- system prompts and prompt injection
- memory, Projects, RAG, and retrieval
- APIs and API keys
- agents and coding agents
- AI safety, privacy, and source checking
- model/product comparison literacy

Do not replace these fundamentals with daily product news. Update the examples when needed, but keep the concepts stable.

## Review cadence

| Area | Cadence | Reason |
| --- | --- | --- |
| Modules 01-05 | Quarterly | Mostly stable fundamentals; examples may need refresh. |
| Modules 06-09 | Quarterly | Product framing and safety language can shift. |
| Modules 10-14 | Monthly | Coding agents, ChatGPT features, Codex/API, and product comparisons change quickly. |
| News feed sources | Monthly | RSS feeds break, drift, or become noisy. |
| Translation terminology | Quarterly | Terminology should stay consistent across languages. |

## Revision triggers

Update a lesson when at least one trigger is met:

- Official product documentation changes a capability explained in the lesson.
- A feature becomes mainstream enough that beginners need to know it.
- A repeated news trend appears across multiple credible sources.
- A safety, privacy, copyright, or regulation change affects beginner guidance.
- A hard-coded model name, context size, price, plan, or benchmark becomes stale.
- A learner would likely make a bad decision if the current page stayed unchanged.

One headline is not enough to rewrite a lesson. Put one-off events in the AI News Hub.

## Source policy

Use this hierarchy for lesson updates:

1. Official documentation for product capabilities, APIs, plans, tools, and safety controls.
2. Primary research papers or standards for technical concepts.
3. Reputable educational sources for stable beginner explanations.
4. News sources for trend detection and examples, not as the sole basis for fundamental claims.

For OpenAI, Anthropic, Google, Meta, Microsoft, and similar product claims, use official docs first. Avoid copying model rankings, prices, context limits, or launch claims into lessons unless the page has a visible last-reviewed date.

## Topic map

| Topic | Related files | Sensitivity |
| --- | --- | --- |
| LLM fundamentals | Modules 01-05 | Low |
| Prompting and system behavior | Modules 07, 09 | Medium |
| Claude and Anthropic workflows | Modules 06, 08, 10, 14 | High |
| ChatGPT and OpenAI workflows | Modules 11, 12, 13, 14 | High |
| Agents and coding | Modules 10, 13 | High |
| APIs and app building | Module 13 | High |
| Comparison literacy | Module 14 | High |
| Current events | `news.html`, `news-reader.html`, `data/news-feed.json` | High |

## News-to-learning workflow

1. Scheduled feed updates `data/news-feed.json`.
2. Review recurring topics monthly.
3. Mark each recurring topic as:
   - `watch`: interesting but no lesson change.
   - `example-refresh`: useful as a new example.
   - `module-review`: lesson may be stale.
   - `major-update`: beginner guidance must change.
4. Update lessons manually with official sources.
5. Run locale validation and review translations.

The feed should help decide what to review. It should not automatically rewrite the curriculum.

## Future automation

Useful future additions:

- Add topic tags to each news item: `models`, `agents`, `coding`, `hardware`, `policy`, `safety`, `multimodal`, `open-source`, `enterprise`, `education`.
- Add `learningImpact`: `none`, `watch`, `example-refresh`, `module-review`, `major-update`.
- Add `relatedModules`, for example `["module_10_claude_code.html", "module_13_codex_api.html"]`.
- Generate a monthly `docs/CURRENT_AI_REVIEW.md` report.
- Add visible module metadata: `Last reviewed`, `Update sensitivity`, and `Related topics`.
