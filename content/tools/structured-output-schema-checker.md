---
title: "Structured Output Schema Checker"
seo_title: "Structured Output Schema Checker for OpenAI Strict Mode, Claude and Gemini (Free, runs in your browser) | AIEngineerGuide"
h1: "Structured output schema checker"
breadcrumb: "Schema checker"
app_name: "Structured output schema checker and tool converter"
description: "Check a JSON Schema for OpenAI strict mode, Claude strict tools and Gemini, auto-fix it, validate outputs and convert tool definitions. No signup."
promise: "Check a JSON Schema against OpenAI strict mode, Claude strict tools or Gemini, get an auto-fixed version, and convert tool definitions between providers and MCP."
tool: structured-output-schema-checker
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste a JSON Schema, an OpenAI `response_format`, or a tool definition (OpenAI, Anthropic or MCP). The schema is pulled out automatically."
  - "Pick the provider. Each finding quotes the official limit; copy the auto-fixed schema, then fix anything marked \"fix by hand\"."
  - "Paste a real model output to validate it, or switch to **Convert tool definitions** to move tools between OpenAI, Anthropic, Gemini and MCP."
faq:
  - q: "Why does OpenAI say my schema is invalid for strict mode?"
    a: "The usual causes: an object without `additionalProperties: false`, a property missing from `required`, a root that isn't an object or uses `anyOf`, or `allOf`/`not`/`if`. To keep a field optional in strict mode, keep it in `required` and make its type nullable, for example `[\"string\", \"null\"]`."
  - q: "What JSON Schema features does Claude's strict mode not support?"
    a: "Recursive schemas, numeric constraints (`minimum`, `maximum`, `multipleOf`), `minLength`/`maxLength`, array constraints beyond `minItems` of 0 or 1, external `$ref`, complex enums and `allOf` with `$ref`. There are also request-wide limits: 20 strict tools, 24 optional parameters and 16 union-typed parameters."
  - q: "I'm replacing forced tool_choice on Claude Sonnet 5.5 with strict tools. What do I need?"
    a: "Mark the tool `strict: true` and make its schema strict-compatible: `additionalProperties: false` on every object and only supported keywords. Check it here with the Claude target, then use the [request migration linter](/tools/model-migration-linter/) for the rest of the request."
  - q: "Does Gemini enforce minLength and maxLength?"
    a: "No. Google's docs say `minLength`, `maxLength`, `minProperties`, `maxProperties`, `uniqueItems` and `contains` aren't enforced; the API strips them. `minItems` and `maxItems` are enforced. Validate the rest in your code."
  - q: "How do I convert an OpenAI function to an Anthropic tool or MCP tool?"
    a: "Use the Convert tab. OpenAI's `parameters` becomes Anthropic's `input_schema` and MCP's `inputSchema`. The converter warns about fields that don't carry over, such as MCP `annotations` or Anthropic `cache_control`."
---

## How the checker works

The checker walks every subschema and applies the rules for the provider you pick. Every rule quotes the provider's own docs with the date we checked it. **Errors** are documented as rejected; **warnings** won't fail the request but won't behave as you expect (Gemini, for example, silently ignores `maxLength`).

The auto-fix only does what's safe and documented: it sets `additionalProperties: false`, makes optional fields required-but-nullable for OpenAI strict mode, moves unsupported Claude constraints into the description (like Anthropic's SDK helpers), and removes constraints Gemini ignores. Validate those constraints in your code after parsing.

Request-wide limits, such as Claude's 24 optional parameters across all strict tools in a request, are checked per schema here, so add them up if you send several strict tools.

### Sources

- OpenAI: [Structured model outputs, supported schemas](https://developers.openai.com/api/docs/guides/structured-outputs) and [function calling strict mode](https://developers.openai.com/api/docs/guides/function-calling) (checked 2026-11-02)
- Anthropic: [Structured outputs, JSON Schema limitations and schema complexity limits](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) (checked 2026-11-02)
- Google: [Gemini API structured output](https://ai.google.dev/gemini-api/docs/structured-output) and [function calling](https://ai.google.dev/gemini-api/docs/function-calling) (checked 2026-11-02)
- MCP: [Tools specification, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) (checked 2026-11-02)
