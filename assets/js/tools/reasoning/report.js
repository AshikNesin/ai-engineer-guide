// Markdown report for the prefix checker (copy / download as .md). Pure.
import { OUTCOMES } from "./verdict.js";

const API = { anthropic: "Anthropic Messages", openai: "OpenAI Responses" };

export function markdownReport({ result, verdicts, fix, rules, labels = {} }) {
  const lines = [`# Reasoning prefix check (${API[result.api] || result.api})`, ""];
  lines.push("## Verdict", "");
  const sorted = Object.entries(verdicts).sort((a, b) => OUTCOMES[a[1].outcome].rank - OUTCOMES[b[1].outcome].rank);
  for (const [id, v] of sorted) lines.push(`- ${OUTCOMES[v.outcome].icon} **${labels[id] || id}**: ${OUTCOMES[v.outcome].label}. ${v.why}`);
  lines.push("");
  const fc = result.firstChange;
  lines.push("## First change", "");
  if (fc) {
    lines.push(`- Kind: ${fc.kind} (${fc.detail})`);
    if (fc.pathA) lines.push(`- In A: \`${fc.pathA}\``);
    if (fc.pathB) lines.push(`- In B: \`${fc.pathB}\``);
    if (fc.confirmed === false) lines.push("- May count (unconfirmed in the docs)");
  } else lines.push("No change before any thinking block or reasoning item.");
  lines.push("");
  if (result.blocks && result.blocks.length) {
    lines.push("## Thinking blocks / reasoning items in B", "", "| Path | After the change | Status |", "|---|---|---|");
    for (const b of result.blocks) lines.push(`| \`${b.path}\` | ${b.invalid || b.afterItemChange ? "yes" : "no"} | ${!b.aEra ? "not checked (produced after A's response)" : b.invalid || (result.invalidPaths || []).includes(b.path) ? "invalid" : b.unconfirmed ? "may be invalid (unconfirmed)" : "valid"} |`);
    lines.push("");
  }
  if (fix) {
    lines.push("## Fix", "", stripMd(fix.summary));
    if (fix.snippet) lines.push("", "```json", JSON.stringify(fix.snippet, null, 2), "```");
    const src = fix.sources && fix.sources[0];
    if (src) lines.push("", `Source: ${sourceUrl(src, rules)}`);
    lines.push("");
  }
  if (result.changes && result.changes.length > 1) {
    lines.push("## Other changes", "");
    result.changes.slice(1).forEach((c) => lines.push(`- ${c.kind}: ${c.detail}`));
    lines.push("");
  }
  if (result.notCompared && result.notCompared.length) {
    lines.push("## Not compared (these never count)", "");
    result.notCompared.forEach((n) => lines.push(`- \`${n.field}\`${n.detail ? `: ${n.detail}` : ""}`));
    lines.push("");
  }
  lines.push("Checked with https://aiengineerguide.com/tools/reasoning-prefix-checker/ (runs in your browser).");
  return lines.join("\n");
}

export function sourceUrl(src, rules) {
  if (src.url) return src.url;
  const base = rules.sources[src.ref];
  return base ? base.url + (src.anchor || "") : "";
}

const stripMd = (s) => String(s || "");
