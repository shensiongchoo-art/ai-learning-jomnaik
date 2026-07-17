# Simplified Chinese AI glossary

This glossary is the terminology anchor for the `zh-CN/` pages. It targets Mainland Simplified Chinese learners and should be used together with `docs/TRANSLATION_GUIDE.md`.

## Source hierarchy

Use this order when deciding Chinese AI terminology:

1. China national standards and official terminology bodies, especially GB/T 41867-2022 and 全国科学技术名词审定委员会 / 术语在线.
2. Official Simplified Chinese product documentation from OpenAI, Anthropic, Google, Microsoft, AWS, and similar vendors for current product/API labels.
3. Reputable technical glossaries and educational sources for fast-moving GenAI usage when official national terminology is not yet settled.
4. AI translation only as a first draft, not the final authority.

## China/Simplified Chinese terminology anchors

| English | Simplified Chinese used here | Source note |
| --- | --- | --- |
| artificial intelligence / AI | 人工智能 / AI | GB/T 41867-2022 is the current national standard for information technology and AI terminology. |
| large language model / LLM | 大语言模型（large language model，LLM） | Used by Google Cloud Simplified Chinese docs; Anthropic Chinese docs use `大型语言模型`. This project uses `大语言模型` for concision and common Mainland GenAI usage. |
| token | 词元（token） | 全国科学技术名词审定委员会 released `词元` as the trial Chinese name for AI-field `token` in 2026. Keep `token` on first mention because learners see it in product/API docs. |
| access token | 访问令牌（access token） | Security credential; keep distinct from model `词元`. |
| context window | 上下文窗口（context window） | Used consistently in Google Cloud and Anthropic Simplified Chinese docs. |
| prompt | 提示词 / 提示 | Google Cloud uses `提示`; `提示词` is common in Chinese GenAI learning material. Use `提示词` for beginner lessons and `提示` when referring to the formal API/documentation object. |
| prompt engineering | 提示工程 | Used by Google Cloud, Anthropic, AWS, and Google for Developers Chinese docs. |
| system prompt | 系统提示词（system prompt） | Keep English on first mention; explain as high-priority developer/system instruction. |
| temperature | 温度（temperature） | Used by official Chinese model docs as a generation parameter. |
| hallucination | 幻觉（hallucination） | Used by Google for Developers, Google Cloud, Anthropic, and common Chinese GenAI docs; explain that this is a metaphor for unsupported/false output. |
| agent | AI 智能体 / 智能体（agent） | Google Cloud Chinese docs use `AI 智能体`; use `代理` only when matching a vendor UI label or network/software meaning. |
| grounding | 接地 / 基于依据 | Google Cloud Chinese docs use `接地`; for beginner teaching, explain it as grounding answers in verifiable sources. |
| retrieval-augmented generation / RAG | 检索增强生成（RAG） | Used by Google Cloud and Anthropic Simplified Chinese docs. |
| Model Context Protocol / MCP | 模型上下文协议（Model Context Protocol，MCP） | Used by Anthropic Chinese docs; keep `MCP` after first mention. |
| embedding | 嵌入 / 嵌入向量（embedding） | Use `嵌入向量` when the vector representation matters; use `嵌入` when context is clear. |

## Product and API labels retained in English

Keep these unchanged unless an official UI label is being quoted:

- ChatGPT
- Claude
- Claude Code
- Codex
- OpenAI
- Anthropic
- GitHub Copilot
- Cursor
- DALL·E
- API
- MCP
- RAG
- token
- prompt
- system prompt
- temperature

## Review notes

- The existing `zh-CN/` pages already use the preferred core terms: `大语言模型`, `词元`, `上下文窗口`, `提示词`, `系统提示词`, `温度`, `幻觉`, `智能体`, and `检索增强生成`.
- Do not replace all occurrences of `token` with `词元`; keep bilingual first mentions and product/API examples.
- Do not replace `智能体` with `代理` globally. In Chinese AI education, `智能体` is clearer for AI agents, while `代理` can imply proxy/network agents.
- Do not remove English product names. Learners will encounter those exact names in official docs and interfaces.

## References used

- GB/T 41867-2022 `信息技术 人工智能 术语`: https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=195F522C14AD9A1A0094FF66D0B1EF1B
- 全国科学技术名词审定委员会 token / `词元` announcement: https://www.cnctst.cn/news/tzgg/202603/t20260325_827999.html
- 全国科学技术名词审定委员会 overview: https://cnterm.cn/jggk/wyhjj/
- Google Cloud Simplified Chinese generative AI glossary: https://docs.cloud.google.com/docs/generative-ai/glossary?hl=zh-cn
- Google for Developers Simplified Chinese generative AI glossary: https://developers.google.com/machine-learning/glossary/generative?hl=zh-CN
- Anthropic Claude Simplified Chinese glossary: https://platform.claude.com/docs/zh-CN/about-claude/glossary
