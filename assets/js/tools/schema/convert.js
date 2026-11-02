// Convert tool definitions between OpenAI Responses, OpenAI Chat Completions,
// Anthropic Messages, Gemini API (Interactions) and MCP tools/list entries.
// Formats documented in data/schema_rules.json -> formats.

const EMPTY = { type: "object", properties: {} };

function detect(t) {
  if (!t || typeof t !== "object") return null;
  if (t.type === "function" && t.function) return "openai-chat";
  if ("inputSchema" in t) return "mcp";
  if ("input_schema" in t) return "anthropic";
  if (t.type === "function" && t.name) return "openai-responses";
  if (t.name && "parameters" in t) return "gemini-legacy";
  return null;
}

/** Returns { tools: [normalized], from: format, errors: [] } */
export function parseTools(input) {
  let list = input;
  if (input && !Array.isArray(input)) {
    if (Array.isArray(input.tools)) list = input.tools;
    else if (Array.isArray(input.functionDeclarations)) list = input.functionDeclarations;
    else list = [input];
  }
  // Gemini generateContent: tools: [{ functionDeclarations: [...] }]
  list = list.flatMap((t) => (t && Array.isArray(t.functionDeclarations) ? t.functionDeclarations : [t]));
  const tools = [];
  const errors = [];
  const formats = new Set();
  list.forEach((t, i) => {
    const fmt = detect(t);
    if (!fmt) { errors.push(`Item ${i + 1} isn't a recognised tool definition.`); return; }
    formats.add(fmt);
    const f = fmt === "openai-chat" ? t.function : t;
    const schema = f.parameters || f.input_schema || f.inputSchema || f.parametersJsonSchema || EMPTY;
    const known = new Set(["type", "function", "name", "description", "parameters", "input_schema", "inputSchema", "strict", "title", "outputSchema", "annotations", "parametersJsonSchema"]);
    const extra = Object.fromEntries(Object.entries(t).filter(([k]) => !known.has(k)));
    tools.push({ name: f.name, description: f.description, title: t.title, schema, strict: f.strict ?? t.strict, outputSchema: t.outputSchema, annotations: t.annotations, extra });
  });
  return { tools, from: formats.size === 1 ? [...formats][0] : formats.size ? "mixed" : null, errors };
}

export function toFormat(tools, fmt) {
  const warnings = [];
  const lost = (tool, field, why) => warnings.push(`${tool.name}: \`${field}\` ${why}`);
  const out = tools.map((t) => {
    if (fmt !== "mcp") {
      if (t.outputSchema) lost(t, "outputSchema", "has no equivalent and was dropped");
      if (t.annotations) lost(t, "annotations", "has no equivalent and was dropped");
      if (t.title) lost(t, "title", "has no equivalent and was dropped");
    }
    for (const k of Object.keys(t.extra || {})) lost(t, k, "is specific to the source format and was dropped");
    const desc = t.description !== undefined ? { description: t.description } : {};
    switch (fmt) {
      case "openai-responses":
        return { type: "function", name: t.name, ...desc, parameters: t.schema, ...(t.strict !== undefined ? { strict: t.strict } : {}) };
      case "openai-chat":
        return { type: "function", function: { name: t.name, ...desc, parameters: t.schema, ...(t.strict !== undefined ? { strict: t.strict } : {}) } };
      case "anthropic":
        return { name: t.name, ...desc, input_schema: t.schema, ...(t.strict !== undefined ? { strict: t.strict } : {}) };
      case "gemini":
        if (t.strict !== undefined) lost(t, "strict", "isn't part of Gemini's documented function format and was dropped");
        return { type: "function", name: t.name, ...desc, parameters: t.schema };
      case "mcp":
        if (t.strict !== undefined) lost(t, "strict", "isn't part of an MCP tool definition and was dropped");
        return { name: t.name, ...(t.title ? { title: t.title } : {}), ...desc, inputSchema: t.schema, ...(t.outputSchema ? { outputSchema: t.outputSchema } : {}), ...(t.annotations ? { annotations: t.annotations } : {}) };
      default:
        throw new Error(`Unknown format ${fmt}`);
    }
  });
  return { output: out.length === 1 ? out[0] : out, warnings };
}
