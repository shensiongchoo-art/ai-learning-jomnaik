# Simplified Chinese translation guide

## Locale and audience

- Use Simplified Chinese and the locale code `zh-CN`.
- Label the switcher `简体中文` in English pages and `English` in Chinese pages.
- Write for Mandarin-speaking beginners, using clear conversational Chinese rather than academic or word-for-word translation.

## Terminology policy

Keep product names and widely recognised abbreviations in English. On first mention, introduce the Chinese term together with its English term or abbreviation. Use the shorter Chinese term or abbreviation afterwards.

| English source | Preferred Simplified Chinese | Usage note |
| --- | --- | --- |
| Large Language Model (LLM) | 大语言模型（Large Language Model，LLM） | Use `LLM` after the first mention. |
| token (language unit) | 词元（token） | Do not use `令牌`, which is reserved for authentication tokens. |
| access token | 访问令牌（access token） | Security credential, distinct from a language-model token. |
| context | 上下文 | Use consistently for model input and conversation context. |
| context window | 上下文窗口（context window） | Keep the English term on first mention. |
| prompt | 提示词（prompt） | Use `提示词` afterwards. |
| system prompt | 系统提示词（system prompt） | Do not translate as a generic system notice. |
| temperature | 温度（temperature） | Explain that this is a model setting, not physical heat. |
| hallucination | 幻觉（hallucination） | Explain as plausible but unsupported output. |
| inference | 推理（inference） | Add English where it could be confused with reasoning. |
| reasoning | 推理过程（reasoning） | Distinguish from model-serving inference when relevant. |
| alignment | 对齐（alignment） | AI-safety context. |
| agent | 智能体（agent） | Use `AI 智能体` when the subject may be unclear. |
| agentic workflow | 智能体工作流（agentic workflow） | Avoid awkward literal variants. |
| tool calling | 工具调用（tool calling） | Keep exact API or UI labels unchanged in examples. |
| Model Context Protocol (MCP) | 模型上下文协议（Model Context Protocol，MCP） | Use `MCP` afterwards. |
| Application Programming Interface (API) | 应用程序编程接口（API） | Use `API` afterwards. |
| fine-tuning | 微调（fine-tuning） | Use `微调` afterwards. |
| embedding | 嵌入向量（embedding） | Use `嵌入` only when the context is unambiguous. |
| retrieval-augmented generation (RAG) | 检索增强生成（RAG） | Keep the abbreviation. |
| memory | 记忆 | Product-specific feature names remain capitalised in English when quoted. |
| Skills | 技能（Skills） | Preserve `Skills` when referring to an exact product feature or file format. |

Product and company names stay unchanged: ChatGPT, Claude, Claude Code, Codex, OpenAI, Anthropic, GitHub Copilot, Cursor, DALL·E, and MorphMind.

## Translation rules

1. Translate meaning, teaching intent, jokes, and analogies rather than mirroring English sentence structure.
2. Keep commands, code, filenames, URLs, API fields, keyboard shortcuts, and exact interface labels unchanged. Add a Chinese explanation beside them when useful.
3. Translate example prompts when the lesson is about prompting. Show the English original only when comparison or token behaviour depends on English wording.
4. Use Chinese punctuation and spacing. Keep a space between Chinese text and Latin product names, abbreviations, or numbers where it improves readability.
5. Preserve uncertainty and safety qualifications. Do not strengthen a tentative English claim in translation.
6. Mark time-sensitive product descriptions with a last-reviewed date and verify them before translating.
7. Review quizzes independently so the correct answer and feedback still align after translation.

## Publishing structure

- English remains at the repository root.
- Simplified Chinese pages live under `zh-CN/` with matching filenames.
- Every language switch links to the corresponding page, not merely the language home page.
- Use `lang="en"` or `lang="zh-CN"`, plus reciprocal `hreflang` links.
- Chinese navigation stays within `zh-CN/`; English navigation stays at the root.
- The Chinese learning hub links to the existing Chinese-first AI news reader.

## Quality gates

- Terminology review against this glossary.
- Native-language readability review, especially analogies and quiz feedback.
- Factual review for product capabilities that can change over time.
- Automated checks for matching page pairs, valid internal links, correct `lang` attributes, and accidental untranslated interface text.
- Browser checks at desktop and mobile widths.
