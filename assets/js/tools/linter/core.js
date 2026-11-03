// Request migration linter: run data/breaking_changes.json rules against a
// request and build a fixed copy. Pure functions (no DOM), unit-tested.

const clone = (x) => JSON.parse(JSON.stringify(x));
const SAMPLING = ["temperature", "top_p", "top_k"];

export function targetMatches(pattern, target) {
  if (pattern.endsWith("*")) return target.startsWith(pattern.slice(0, -1));
  return pattern === target;
}

function effortOf(body, api) {
  if (api === "responses") return body.reasoning?.effort;
  return body.reasoning_effort ?? body.reasoning?.effort;
}

function betasOf(body, headers) {
  const list = [...(Array.isArray(body.betas) ? body.betas : [])];
  for (const h of headers || []) if (h) list.push(h);
  return list.map((b) => String(b).trim()).filter(Boolean);
}

function textBlocks(content) {
  return Array.isArray(content) ? content : [];
}

// Each check returns the list of offending field paths ([] = rule passes).
export const CHECKS = {
  sampling: (b) => SAMPLING.filter((k) => k in b),
  prefill: (b) => {
    const msgs = b.messages || [];
    return msgs.length && msgs[msgs.length - 1].role === "assistant" ? [`messages[${msgs.length - 1}]`] : [];
  },
  forcedToolChoice: (b) => (["any", "tool"].includes(b.tool_choice?.type) ? ["tool_choice"] : []),
  thinkingEnabled: (b) => (b.thinking?.type === "enabled" || b.thinking?.budget_tokens != null ? ["thinking"] : []),
  thinkingDisabled: (b) => (b.thinking?.type === "disabled" ? ["thinking"] : []),
  thinkingDefault: (b) => (b.thinking === undefined ? ["thinking (not set)"] : []),
  outputFormat: (b, ctx) => ("output_format" in b && !ctx.betas.includes("structured-outputs-2025-11-13") ? ["output_format"] : []),
  oldComputerTool: (b) => (b.tools || []).flatMap((t, i) => (t.type === "computer_20250124" ? [`tools[${i}].type`] : [])),
  // Returns a 400 next to a toolset entry; otherwise it's replaced by eager_input_streaming.
  fineGrainedHeader: (b, ctx) => (ctx.betas.includes("fine-grained-tool-streaming-2025-05-14") ? ["anthropic-beta: fine-grained-tool-streaming-2025-05-14"] : []),
  legacyBetas: (b, ctx) => ctx.betas.filter((x) => x === "interleaved-thinking-2025-05-14" || /^context-/.test(x)).map((x) => `anthropic-beta: ${x}`),
  documentInAssistant: (b) => (b.messages || []).flatMap((m, i) =>
    m.role === "assistant" && textBlocks(m.content).some((c) => c.type === "document") ? [`messages[${i}].content`] : []),
  citationsInUserText: (b) => (b.messages || []).flatMap((m, i) =>
    m.role === "user" && textBlocks(m.content).some((c) => hasCitations(c)) ? [`messages[${i}].content`] : []),
  maxTokens: (b) => ("max_tokens" in b ? ["max_tokens"] : []),
  stop: (b) => ("stop" in b ? ["stop"] : []),
  chatTools: (b) => ((b.tools || []).length ? ["tools"] : []),
  chatToolsEffortNone: (b) => ((b.tools || []).length && b.reasoning_effort !== "none" ? ["reasoning_effort"] : []),
  effortNone: (b, ctx) => (effortOf(b, ctx.api) === "none" ? [ctx.api === "responses" ? "reasoning.effort" : "reasoning_effort"] : []),
  effortNoneMinimal: (b, ctx) => (["none", "minimal"].includes(effortOf(b, ctx.api)) ? [ctx.api === "responses" ? "reasoning.effort" : "reasoning_effort"] : []),
  gpt6Sampling: (b, ctx) => {
    if (effortOf(b, ctx.api) === "none") return [];
    const keys = ["temperature", "top_p", "top_logprobs"];
    if (ctx.api === "chat") keys.push("logprobs");
    return keys.filter((k) => k in b);
  },
  gpt5Sampling: (b, ctx) => {
    if (/^gpt-5\.(2|4)/.test(ctx.target) && effortOf(b, ctx.api) === "none") return [];
    return ["temperature", "top_p", "logprobs"].filter((k) => k in b);
  },
  promptCacheRetention: (b) => ("prompt_cache_retention" in b ? ["prompt_cache_retention"] : []),
};

function hasCitations(block) {
  if (block.type === "text" && Array.isArray(block.citations) && block.citations.length) return true;
  if (block.type === "search_result") return textBlocks(block.content).some(hasCitations);
  return false;
}

function stripCitations(block) {
  if (block.type === "text" && block.citations) {
    const { citations, ...rest } = block;
    return rest;
  }
  if (block.type === "search_result" && Array.isArray(block.content)) return { ...block, content: block.content.map(stripCitations) };
  return block;
}

// Fixes return a new body. Rules without a fix are reported but left as is.
export const FIXES = {
  sampling: (b) => { SAMPLING.forEach((k) => delete b[k]); },
  prefill: (b) => {
    while (b.messages?.length && b.messages[b.messages.length - 1].role === "assistant") b.messages.pop();
  },
  forcedToolChoice: (b) => {
    b.tool_choice = { type: "auto" };
    b.tools = (b.tools || []).map((t) => (!t.type || t.type === "custom" ? { ...t, strict: true } : t));
  },
  thinkingEnabled: (b) => {
    b.thinking = { type: "adaptive" };
    b.output_config = { ...(b.output_config || {}), effort: b.output_config?.effort || "high" };
  },
  thinkingDisabled: (b) => { b.thinking = { type: "between_tools" }; },
  outputFormat: (b) => {
    b.output_config = { ...(b.output_config || {}), format: b.output_format };
    delete b.output_format;
  },
  fineGrainedHeader: (b) => dropBetas(b, (x) => x === "fine-grained-tool-streaming-2025-05-14"),
  legacyBetas: (b) => dropBetas(b, (x) => x === "interleaved-thinking-2025-05-14" || /^context-/.test(x)),
  citationsInUserText: (b) => {
    b.messages = b.messages.map((m) => (m.role === "user" && Array.isArray(m.content) ? { ...m, content: m.content.map(stripCitations) } : m));
  },
  maxTokens: (b) => {
    b.max_completion_tokens = b.max_tokens;
    delete b.max_tokens;
  },
  stop: (b) => { delete b.stop; },
  chatToolsEffortNone: (b) => { b.reasoning_effort = "none"; },
  effortNone: (b, ctx) => setEffort(b, ctx.api, "low"),
  effortNoneMinimal: (b, ctx) => setEffort(b, ctx.api, "medium"),
  gpt6Sampling: (b, ctx) => {
    ["temperature", "top_p", "top_logprobs"].forEach((k) => delete b[k]);
    if (ctx.api === "chat") delete b.logprobs;
  },
  gpt5Sampling: (b) => { ["temperature", "top_p", "logprobs"].forEach((k) => delete b[k]); },
  promptCacheRetention: (b) => {
    b.prompt_cache_options = { ...(b.prompt_cache_options || {}), ttl: b.prompt_cache_retention };
    delete b.prompt_cache_retention;
  },
};

function dropBetas(b, pred) {
  if (!Array.isArray(b.betas)) return;
  b.betas = b.betas.filter((x) => !pred(x));
  if (!b.betas.length) delete b.betas;
}

function setEffort(b, api, value) {
  if (api === "responses" || (b.reasoning && !("reasoning_effort" in b))) b.reasoning = { ...(b.reasoning || {}), effort: value };
  else b.reasoning_effort = value;
}

/**
 * @param {object} body     parsed request
 * @param {object} opts     { rules, target, api, apiVersion, headers: [betas], raw }
 * @returns {Array<{rule, paths}>}
 */
export function lint(body, { rules, target, api, apiVersion = "2023-06-01", headers = [], raw = "" }) {
  const ctx = { target, api, apiVersion, betas: betasOf(body, headers), raw };
  const findings = [];
  for (const rule of rules) {
    if (!rule.apis.includes(api)) continue;
    if (!rule.targets.some((p) => targetMatches(p, target))) continue;
    if (rule.api_version && rule.api_version !== apiVersion) continue;
    const check = CHECKS[rule.check];
    if (!check) continue;
    const paths = check(body, ctx);
    if (paths.length) findings.push({ rule, paths });
  }
  return findings;
}

export function readsFirstBlock(raw) {
  return /content\s*\[\s*0\s*\]\s*\.\s*text/.test(raw || "");
}

export function applyFixes(body, findings, { target, api }) {
  const out = clone(body);
  const done = new Set();
  for (const f of findings) {
    const fix = FIXES[f.rule.check];
    if (!fix || f.rule.autofix === false || done.has(f.rule.check)) continue;
    done.add(f.rule.check);
    fix(out, { target, api });
  }
  out.model = target;
  return out;
}

export function isAutoFixable(rule) {
  return Boolean(FIXES[rule.check]) && rule.autofix !== false;
}
