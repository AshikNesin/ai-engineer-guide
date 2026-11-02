// Token counter: exact OpenAI counts with gpt-tokenizer (loaded on first use),
// documented estimates for Claude and Gemini, cost and context per model.
import { estimate, charCount, wordCount } from "./shared/estimate.js";
import { fmtInt, fmtMoney, fmtPct } from "./shared/format.js";
import { copyText } from "./shared/copy.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "token-counter";
const app = document.getElementById("tc-app");
const text = document.getElementById("tc-text");
const fileInput = document.getElementById("tc-file");
const drop = document.getElementById("tc-drop");
const stats = document.getElementById("tc-stats");
const status = document.getElementById("tc-status");
const modelSelect = document.getElementById("tc-model");
const costBox = document.getElementById("tc-cost");
const view = document.getElementById("tc-view");
const tokensBox = document.getElementById("tc-tokens");

const data = JSON.parse(document.getElementById("models-data").textContent);
const models = data.models.filter((m) => m.status !== "deprecated");
const sampleText = text.value;
const sampleCounts = {
  o200k_base: Number(app.dataset.sampleO200k),
  cl100k_base: Number(app.dataset.sampleCl100k),
};

// Tokenizer modules are big, so we import them only when needed.
const encoders = {};
function loadEncoder(name) {
  if (!encoders[name]) {
    const url = name === "o200k_base" ? app.dataset.o200k : app.dataset.cl100k;
    encoders[name] = import(url);
  }
  return encoders[name];
}

const counts = {};

function setCount(key, n) {
  counts[key] = n;
  const cell = app.querySelector(`tr[data-key="${key}"] [data-count]`);
  if (cell) cell.textContent = n == null ? "…" : fmtInt(n);
}

let generation = 0;
async function recount() {
  const value = text.value;
  const gen = ++generation;
  stats.textContent = `${fmtInt(charCount(value))} characters · ${fmtInt(wordCount(value))} words`;
  for (const k of ["claude-new", "claude-legacy", "gemini"]) setCount(k, estimate(k, value));

  if (value === sampleText) {
    setCount("o200k_base", sampleCounts.o200k_base);
    setCount("cl100k_base", sampleCounts.cl100k_base);
  } else {
    setCount("o200k_base", null);
    setCount("cl100k_base", null);
    status.textContent = "Loading the OpenAI tokenizer…";
    try {
      const [o, c] = await Promise.all([loadEncoder("o200k_base"), loadEncoder("cl100k_base")]);
      if (gen !== generation) return; // a newer edit superseded this one
      setCount("o200k_base", o.countTokens(value));
      setCount("cl100k_base", c.countTokens(value));
      status.textContent = "OpenAI counts are exact. Claude and Gemini counts are estimates.";
    } catch (err) {
      status.textContent = "Couldn't load the OpenAI tokenizer. Check your connection and edit the text to retry.";
      encoders.o200k_base = encoders.cl100k_base = undefined;
    }
  }
  renderCost();
  if (view.open) renderTokens();
}

function countFor(model) {
  return model.tokenizer in counts ? counts[model.tokenizer] : estimate(model.tokenizer, text.value);
}

function renderCost() {
  const m = models.find((x) => x.id === modelSelect.value);
  if (!m) return;
  const n = countFor(m);
  if (n == null) return;
  const exact = m.tokenizer === "o200k_base" || m.tokenizer === "cl100k_base";
  const limit = m.max_input || m.context;
  const parts = [
    `<strong>${fmtInt(n)} tokens</strong> on ${m.name} (${exact ? "exact" : "estimate"})`,
    `as input: <strong>${fmtMoney((n * m.price.input) / 1e6)}</strong> (${fmtMoney((n * m.price.input) / 1e3)} per 1,000 requests)`,
    `as output: <strong>${fmtMoney((n * m.price.output) / 1e6)}</strong> (${fmtMoney((n * m.price.output) / 1e3)} per 1,000)`,
  ];
  if (limit) parts.push(`uses <strong>${fmtPct(n / limit)}</strong> of the ${fmtInt(limit)}-token ${m.max_input ? "input limit" : "context window"}`);
  costBox.innerHTML = parts.join(" · ") +
    `<br><span class="helptext">Prices from <a href="${data.source}" rel="noopener">models.dev</a>, checked ${data.checked_at}. ` +
    `Confirm on the <a href="${data.pricing_urls[m.provider]}" rel="noopener">official pricing page</a>.</span>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

async function renderTokens() {
  const enc = app.querySelector('input[name="tc-enc"]:checked').value;
  tokensBox.textContent = "Loading…";
  const mod = await loadEncoder(enc);
  const ids = mod.encode(text.value).slice(0, 2000);
  // A character such as an emoji can span several tokens. Group those tokens
  // into one block so we never show half a character ("\uFFFD").
  const blocks = [];
  let pending = [];
  for (const id of ids) {
    pending.push(id);
    const piece = mod.decode(pending);
    if (!piece.includes("\uFFFD")) {
      blocks.push({ ids: pending, piece });
      pending = [];
    }
  }
  if (pending.length) blocks.push({ ids: pending, piece: mod.decode(pending) });
  tokensBox.innerHTML = blocks
    .map((b) => `<span title="${b.ids.join(", ")}${b.ids.length > 1 ? ` (${b.ids.length} tokens)` : ""}">${escapeHtml(b.piece)}</span>`)
    .join("");
}

function fillModels() {
  const pre = app.dataset.preselect;
  const providerOf = { claude: "anthropic", gemini: "google", openai: "openai" };
  const order = ["openai", "anthropic", "google", "xai", "deepseek", "mistral"];
  const sorted = [...models].sort((a, b) =>
    order.indexOf(a.provider) - order.indexOf(b.provider) || (b.released || "").localeCompare(a.released || ""));
  modelSelect.innerHTML = sorted.map((m) => `<option value="${m.id}">${escapeHtml(m.name)} (${m.provider})</option>`).join("");
  const first = sorted.find((m) => m.provider === (providerOf[pre] || "openai"));
  if (first) modelSelect.value = first.id;
}

let timer;
text.addEventListener("input", () => {
  trackUsedOnce(TOOL);
  clearTimeout(timer);
  timer = setTimeout(recount, 150);
});
// Warm the tokenizer as soon as the visitor shows intent.
text.addEventListener("focus", () => { loadEncoder("o200k_base"); loadEncoder("cl100k_base"); }, { once: true });
modelSelect.addEventListener("change", () => { trackUsedOnce(TOOL); renderCost(); });
view.addEventListener("toggle", () => { if (view.open) renderTokens(); });
app.querySelectorAll('input[name="tc-enc"]').forEach((r) => r.addEventListener("change", renderTokens));

async function readFile(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    status.textContent = "That file is over 5 MB. Paste a smaller part of it.";
    return;
  }
  text.value = await file.text();
  trackUsedOnce(TOOL);
  track("file_loaded", { tool: TOOL });
  recount();
}
fileInput.addEventListener("change", () => readFile(fileInput.files[0]));
drop.addEventListener("dragover", (e) => { e.preventDefault(); });
drop.addEventListener("drop", (e) => { e.preventDefault(); readFile(e.dataTransfer.files[0]); });

document.getElementById("tc-copy").addEventListener("click", (e) => {
  const lines = [...app.querySelectorAll("#tc-results tbody tr")].map((tr) =>
    `${tr.querySelector("strong").textContent}: ${tr.querySelector("[data-count]").textContent} (${tr.querySelector(".badge").textContent})`);
  copyText(lines.join("\n"), e.currentTarget);
  track("copy", { tool: TOOL });
});
document.getElementById("tc-clear").addEventListener("click", () => { text.value = ""; recount(); text.focus(); });

fillModels();
recount();
