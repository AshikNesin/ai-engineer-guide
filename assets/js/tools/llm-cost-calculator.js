// LLM API cost calculator. Five tabs share one copy of data/models.json:
// monthly cost, token count, context fit, prompt caching and old -> new model.
import { readHash, writeHash } from "./shared/share.js";
import { track } from "./shared/track.js";
import { initCost } from "./calculator/cost.js";
import { initTokens } from "./calculator/tokens.js";
import { initContext } from "./calculator/context.js";
import { initCache } from "./calculator/cache.js";
import { initDiff } from "./calculator/diff.js";

const app = document.getElementById("calc-app");
const data = JSON.parse(document.getElementById("models-data").textContent);
const defaultTab = app.dataset.defaultTab || "cost";
const tabs = [...app.querySelectorAll('[role="tab"]')];
const panels = [...app.querySelectorAll(".calc-panel")];

const inits = { cost: () => initCost(data), tokens: () => initTokens(data), context: () => initContext(), cache: () => initCache(data), diff: () => initDiff(data) };
const started = {};
function start(key) {
  if (!started[key] && inits[key]) {
    started[key] = true;
    inits[key]();
  }
}

function show(key, { save = true } = {}) {
  if (!inits[key]) key = defaultTab;
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === key)));
  panels.forEach((p) => { p.hidden = p.dataset.tab !== key; });
  start(key);
  if (save) {
    writeHash({ tab: key === defaultTab ? "" : key });
    track("tab", { tool: "llm-cost-calculator", tab: key });
  }
}

tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));
// Arrow keys move between tabs (WAI-ARIA tabs pattern).
app.querySelector('[role="tablist"]').addEventListener("keydown", (e) => {
  const i = tabs.indexOf(document.activeElement);
  if (i < 0 || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
  next.focus();
  show(next.dataset.tab);
});

show(readHash().tab || defaultTab, { save: false });
