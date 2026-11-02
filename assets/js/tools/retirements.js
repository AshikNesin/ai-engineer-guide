// Model retirement calendar, provider and per-model pages.
// Everything is server-rendered; this script only refreshes "days left" in the
// visitor's timezone, filters the table and builds single-event .ics files.
import { daysUntil } from "./lib/format.js";
import { readHash, writeHash } from "./lib/share.js";
import { copyText } from "./lib/copy.js";
import { singleEventIcs } from "./lib/ics.js";
import { track, trackUsedOnce } from "./lib/track.js";

const TOOL = "model-retirements";

function badgeFor(days, kind) {
  if (days < 0) return { cls: "retired", text: "retired" };
  const est = kind === "earliest" ? " (earliest)" : "";
  if (days === 0) return { cls: "soon", text: "today" + est };
  const cls = days <= 30 ? "soon" : days <= 90 ? "later" : "far";
  return { cls, text: `${days} day${days === 1 ? "" : "s"} left${est}` };
}

function refreshBadges() {
  document.querySelectorAll("[data-days-left]").forEach((el) => {
    const { cls, text } = badgeFor(daysUntil(el.dataset.daysLeft), el.dataset.kind);
    el.className = `badge ${cls}`;
    el.textContent = text;
  });
  const box = document.querySelector(".days-left[data-shutdown]");
  if (box) {
    const days = daysUntil(box.dataset.shutdown);
    const count = box.querySelector("[data-count]");
    const label = box.querySelector("[data-count-label]");
    const pretty = new Date(box.dataset.shutdown + "T00:00:00").toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
    if (days < 0) {
      box.classList.add("is-retired");
      count.textContent = "Retired";
      label.textContent = `on ${pretty}`;
    } else {
      count.textContent = String(days);
      label.textContent = `day${days === 1 ? "" : "s"} left until ${pretty}${box.dataset.kind === "earliest" ? " (earliest possible date)" : ""}`;
    }
  }
}

function setupFilters() {
  const provider = document.getElementById("f-provider");
  const status = document.getElementById("f-status");
  const search = document.getElementById("f-search");
  if (!provider || !status || !search) return;
  const upcoming = document.getElementById("upcoming-section");
  const retired = document.getElementById("retired-section");
  const empty = document.getElementById("no-results");

  const state = readHash();
  if (state.provider) provider.value = state.provider;
  if (state.status) status.value = state.status;
  if (state.q) search.value = state.q;

  function apply() {
    const p = provider.value;
    const s = status.value;
    const q = search.value.trim().toLowerCase();
    upcoming.hidden = s === "retired";
    retired.hidden = s === "upcoming";
    let shown = 0;
    document.querySelectorAll("#t-upcoming tbody tr, #t-retired tbody tr").forEach((tr) => {
      const inSection = !tr.closest("section").hidden;
      const ok = inSection && (!p || tr.dataset.provider === p) && (!q || tr.dataset.search.includes(q));
      tr.classList.toggle("is-hidden", !ok);
      if (ok) shown += 1;
    });
    empty.hidden = shown > 0;
    writeHash({ provider: p, status: s === "upcoming" ? "" : s, q });
  }

  let debounce;
  const onChange = () => {
    trackUsedOnce(TOOL);
    clearTimeout(debounce);
    debounce = setTimeout(apply, 80);
  };
  [provider, status].forEach((el) => el.addEventListener("change", onChange));
  search.addEventListener("input", onChange);
  apply();
}

function setupButtons() {
  const copy = document.getElementById("copy-ics-url");
  if (copy) {
    copy.addEventListener("click", () => {
      copyText(copy.dataset.url, copy);
      track("copy", { tool: TOOL, what: "ics_url" });
    });
  }
  const add = document.getElementById("add-to-calendar");
  if (add) {
    add.addEventListener("click", () => {
      const d = add.dataset;
      const ics = singleEventIcs({
        uid: d.uid, sequence: Number(d.seq || 0), date: d.date,
        title: d.title, description: `${d.desc}\nDetails: ${d.url}`, url: d.url,
      });
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${d.uid.split("@")[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      track("subscribe_ics", { tool: TOOL, kind: "single" });
    });
  }
}

refreshBadges();
setupFilters();
setupButtons();
