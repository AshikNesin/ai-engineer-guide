"""Refresh data/retirements.json from the three official deprecation pages.

    python scripts/tools-data/refresh_retirements.py            # fetch + write
    python scripts/tools-data/refresh_retirements.py --offline  # use saved fixtures

Deterministic parsing only, no LLM. The script refuses to write when a sanity
gate fails (see `check_gates`), because a wrong retirement date is worse than a
late one. Hand fixes go in data/retirements_overrides.json, never in the
generated file.
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

# Make `import common` work no matter which folder the script is run from:
# sys.path is the list of folders Python searches for modules.
sys.path.insert(0, str(Path(__file__).resolve().parent))

import common  # noqa: E402  (import after the sys.path tweak on purpose)
from common import parse_date, slugify  # noqa: E402

OUT_PATH = common.DATA_DIR / "retirements.json"
OVERRIDES_PATH = common.DATA_DIR / "retirements_overrides.json"
MODELS_PATH = common.DATA_DIR / "models.json"
FIXTURES = Path(__file__).resolve().parent / "tests" / "fixtures"

SOURCES = {
    "anthropic": {
        "fetch": "https://platform.claude.com/docs/en/about-claude/model-deprecations.md",
        "url": "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "fixture": "anthropic-2026-11-02.md",
    },
    "openai": {
        "fetch": "https://developers.openai.com/api/docs/deprecations.md",
        "url": "https://developers.openai.com/api/docs/deprecations",
        "fixture": "openai-2026-11-02.md",
    },
    "gemini": {
        "fetch": "https://ai.google.dev/gemini-api/docs/deprecations",
        "url": "https://ai.google.dev/gemini-api/docs/deprecations",
        "fixture": "gemini-2026-11-02.md",
    },
}

PLATFORM_NOTES = {
    "anthropic": (
        "Dates apply to the Claude API and other Anthropic-operated platforms. "
        "Amazon Bedrock and Claude Models on Google Cloud (Google managed) set "
        "their own retirement schedules, so check those model tables separately."
    ),
    "openai": (
        "Dates apply to the OpenAI API. Fine-tuned models follow the same shutdown "
        "schedule as their base model. If you use OpenAI models through another "
        "platform, check that platform's own retirement schedule."
    ),
    "gemini": (
        "Dates apply to the Gemini API and are the earliest possible shutdown dates "
        "Google publishes. If you use Gemini through another platform, check that "
        "platform's own schedule."
    ),
}

# Models whose shutdown is on/after this date get their own page. A fixed date
# (not "today minus N months") means a page, once created, never disappears.
PAGE_CUTOFF = "2026-01-01"

# Known rows that must be present, or the run fails. (slug, id, shutdown, until)
ANCHORS = [
    ("claude-sonnet-4-5", "claude-sonnet-4-5-20250929", "2026-11-30", "2026-12-01"),
]

STATUSES = ("active", "legacy", "deprecated", "retired")
CALENDAR_KINDS = ("exact", "earliest")


# --------------------------------------------------------------------------
# Markdown table helpers
# --------------------------------------------------------------------------

_BACKTICK_RE = re.compile(r"`([^`]+)`")
_DATE_SUFFIX_RE = re.compile(r"-(\d{8}|\d{4}-\d{2}-\d{2})$")


def split_row(line: str) -> list[str]:
    """Split one "| a | b \\| c |" Markdown table row into cells.

    `(?<!\\\\)\\|` is a regex "negative lookbehind": split on "|" only when the
    character before it is not a backslash, so escaped "\\|" stays inside a cell.
    """
    inner = line.strip().strip("|")
    return [c.strip().replace("\\|", "|") for c in re.split(r"(?<!\\)\|", inner)]


def iter_md_tables(lines: list[str]):
    """Yield (start_line_index, header_cells, rows) for every pipe table."""
    i = 0
    while i < len(lines):
        line = lines[i]
        nxt = lines[i + 1] if i + 1 < len(lines) else ""
        if line.lstrip().startswith("|") and re.match(r"^\s*\|[\s:|-]+\|\s*$", nxt):
            header = split_row(line)
            rows = []
            j = i + 2
            while j < len(lines) and lines[j].lstrip().startswith("|"):
                rows.append(split_row(lines[j]))
                j += 1
            # `yield` makes this a generator: callers loop over it lazily.
            yield i, header, rows
            i = j
        else:
            i += 1


def clean_text(cell: str) -> str:
    """Strip Markdown links/backticks: "[x](u) `y`" -> "x y"."""
    cell = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cell)
    return cell.replace("`", "").strip()


def backtick_ids(cell: str) -> list[str]:
    return [m.strip() for m in _BACKTICK_RE.findall(cell)]


def replacement_from(cell: str) -> dict | None:
    text = clean_text(cell)
    if not text or text in {"---", "-", "N/A"}:
        return None
    ids = [i for i in backtick_ids(cell) if not i.startswith("reasoning.")]
    return {"ids": ids, "text": text}


# --------------------------------------------------------------------------
# Name helpers
# --------------------------------------------------------------------------

_UPPER_WORDS = {"tts": "TTS", "hd": "HD", "gpt": "GPT", "er": "ER"}


def pretty_name(model_id: str) -> str:
    """Best-effort display name from an ID. Overrides/models.json win."""
    base = _DATE_SUFFIX_RE.sub("", model_id)
    parts = base.split("-")
    if parts[0] == "claude":
        words, nums = [], []
        for p in parts[1:]:
            if p.isdigit():
                nums.append(p)
                continue
            if nums:
                words.append(".".join(nums))
                nums = []
            words.append(p.capitalize())
        if nums:
            words.append(".".join(nums))
        return "Claude " + " ".join(words)
    if parts[0] == "gpt" and len(parts) > 1 and parts[1][:1].isdigit():
        rest = " ".join(_UPPER_WORDS.get(p, p) for p in parts[2:])
        return (f"GPT-{parts[1]} {rest}").strip()
    if parts[0] in {"gemini", "veo", "imagen"}:
        return " ".join(_UPPER_WORDS.get(p, p.capitalize()) for p in parts)
    return base


def model_names_from_models_json() -> dict[str, str]:
    data = common.load_json(MODELS_PATH, default={}) or {}
    names = {}
    for m in data.get("models", []):
        names[m["id"]] = re.sub(r"\s*\((latest|preview)\)$", "", m["name"])
    return names


# --------------------------------------------------------------------------
# Anthropic
# --------------------------------------------------------------------------


def anthropic_slug(model_id: str) -> str:
    # "claude-sonnet-4-5-20250929" -> "claude-sonnet-4-5"
    return slugify(_DATE_SUFFIX_RE.sub("", model_id))


def parse_anthropic(text: str, source_url: str) -> list[dict]:
    lines = text.splitlines()
    models: dict[str, dict] = {}  # keyed by model id

    # 1) Deprecation history sections: "### 2026-09-30: Claude Sonnet 4.5 model"
    section_date, section_title = None, None
    heading_at = {}
    for idx, line in enumerate(lines):
        m = re.match(r"^###\s+(\d{4}-\d{2}-\d{2}):\s*(.+)$", line)
        if m:
            section_date, section_title = m.group(1), m.group(2).strip()
        heading_at[idx] = (section_date, section_title)

    status_table = None
    for start, header, rows in iter_md_tables(lines):
        h = [c.lower() for c in header]
        if h and h[0].startswith("api model name"):
            status_table = rows
            continue
        if h and h[0].startswith("retirement date"):
            announced, _title = heading_at.get(start, (None, None))
            for row in rows:
                if len(row) < 3:
                    continue
                for mid in backtick_ids(row[1]):
                    models[mid] = {
                        "id": mid,
                        "announced": announced,
                        "shutdown": parse_date(row[0]),
                        "shutdown_kind": "exact" if parse_date(row[0]) else "none",
                        "shutdown_text": clean_text(row[0]),
                        "replacement": replacement_from(row[2]),
                        "status": None,
                    }

    # 2) "Model status" table wins for status and current dates.
    for row in status_table or []:
        if len(row) < 4:
            continue
        mid = clean_text(row[0])
        state = row[1].strip().lower()
        retire_cell = row[3].strip()
        entry = models.setdefault(
            mid, {"id": mid, "announced": None, "replacement": None}
        )
        entry["status"] = state if state in STATUSES else None
        deprecated_on = parse_date(row[2])
        if deprecated_on and not entry.get("announced"):
            entry["announced"] = deprecated_on
        retire_date = parse_date(retire_cell)
        if retire_cell.lower().startswith("not sooner than"):
            entry["shutdown"], entry["shutdown_kind"] = retire_date, "not_before"
        elif retire_date:
            entry["shutdown"], entry["shutdown_kind"] = retire_date, "exact"
        else:
            entry["shutdown"], entry["shutdown_kind"] = None, "none"
        entry["shutdown_text"] = retire_cell

    out = []
    for mid, e in models.items():
        out.append(
            {
                "slug": anthropic_slug(mid),
                "provider": "anthropic",
                "name": pretty_name(mid),
                "ids": [mid],
                "status": e.get("status"),
                "announced": e.get("announced"),
                "shutdown": e.get("shutdown"),
                "shutdown_kind": e.get("shutdown_kind", "none"),
                "shutdown_text": e.get("shutdown_text", ""),
                "replacement": e.get("replacement"),
                "source_url": source_url,
            }
        )
    # Two snapshots of one model (claude-3-5-sonnet-20240620 and -20241022)
    # share a slug and date, so they become one entry with two IDs.
    return merge_rows(out)


# --------------------------------------------------------------------------
# OpenAI
# --------------------------------------------------------------------------


def openai_slug(ids: list[str], display_name: str | None) -> str:
    if display_name:
        return slugify(display_name)
    undated = [i for i in ids if not re.search(r"-\d{4}(-\d{2}-\d{2})?$", i)]
    # Prefer the shortest alias without a snapshot date ("o3" over "o3-2025-04-16").
    pick = min(undated, key=len) if undated else ids[0]
    return slugify(pick)


def parse_openai(text: str, source_url: str) -> list[dict]:
    lines = text.splitlines()
    # Remember the "### YYYY-MM-DD: Title" heading in force at every line.
    heading_at, section_date, section_title = {}, None, None
    for idx, line in enumerate(lines):
        m = re.match(r"^###\s+(.+)$", line)
        if m:
            section_title = m.group(1).strip()
            dm = re.match(r"(\d{4}-\d{2}-\d{2}):", section_title)
            section_date = dm.group(1) if dm else None
        heading_at[idx] = (section_date, section_title)

    rows_out = []
    for start, header, rows in iter_md_tables(lines):
        if not header or "shutdown date" not in header[0].lower():
            continue
        announced, title = heading_at.get(start, (None, None))
        if title and "fine-tun" in title.lower():
            continue  # training-only changes, not model shutdowns
        for row in rows:
            if len(row) < 3:
                continue
            date_cell, id_cell, repl_cell = row[0], row[1], row[-1]
            if id_cell.lower().startswith("new fine-tuning"):
                continue
            ids = [i for i in backtick_ids(id_cell) if not i.startswith("/")]
            if not ids:
                continue  # an API/system ("Assistants API"), not a model
            # "GPT-4o (`gpt-4o-2024-08-06`, ...)" -> display name "GPT-4o"
            display = None
            lead = id_cell.split("`", 1)[0].strip()
            if lead.endswith("("):
                display = lead[:-1].strip()
            shutdown = parse_date(date_cell)
            kind = "exact"
            if "earliest" in date_cell.lower():
                kind = "earliest"
            if not shutdown:
                kind = "none"
            rows_out.append(
                {
                    "slug": openai_slug(ids, display),
                    "provider": "openai",
                    "name": display or pretty_name(openai_slug_source(ids)),
                    "_named": bool(display),  # explicit name from the page wins
                    "ids": ids,
                    "status": None,
                    "announced": announced,
                    "shutdown": shutdown,
                    "shutdown_kind": kind,
                    "shutdown_text": clean_text(date_cell).replace("‑", "-"),
                    "replacement": replacement_from(repl_cell),
                    "source_url": source_url,
                }
            )

    # Newest announcement first, so when an ID shows up twice the newest wins.
    # sorted() is stable: rows with equal keys keep their page order.
    rows_out.sort(key=lambda r: r["announced"] or "", reverse=True)
    return fold_snapshots(merge_rows(rows_out))


def openai_slug_source(ids: list[str]) -> str:
    undated = [i for i in ids if not re.search(r"-\d{4}(-\d{2}-\d{2})?$", i)]
    return min(undated, key=len) if undated else ids[0]


def merge_rows(rows: list[dict]) -> list[dict]:
    """Merge rows that share a slug and shutdown; drop IDs already claimed."""
    by_slug: dict[str, dict] = {}
    claimed: set[str] = set()
    for r in rows:
        r["ids"] = [i for i in r["ids"] if i not in claimed]
        if not r["ids"]:
            continue
        existing = by_slug.get(r["slug"])
        if existing:
            if existing["shutdown"] == r["shutdown"]:
                existing["ids"] += r["ids"]
                claimed.update(r["ids"])
                continue
            # Same slug, different date: give the older row a unique slug.
            r["slug"] = slugify(r["ids"][0])
            if r["slug"] in by_slug:
                continue
        by_slug[r["slug"]] = r
        claimed.update(r["ids"])
    return list(by_slug.values())


def fold_snapshots(rows: list[dict]) -> list[dict]:
    """Fold "sora-2-2025-10-06" into "sora-2" when both retire on the same day."""
    by_slug = {r["slug"]: r for r in rows}
    out = []
    for r in rows:
        if len(r["ids"]) == 1:
            base = _DATE_SUFFIX_RE.sub("", r["ids"][0])
            parent = by_slug.get(slugify(base))
            if parent is not None and parent is not r and parent["shutdown"] == r["shutdown"]:
                parent["ids"] += r["ids"]
                continue
        out.append(r)
    return out


# --------------------------------------------------------------------------
# Gemini (Markdoc "{% table %}" blocks)
# --------------------------------------------------------------------------


def iter_markdoc_tables(lines: list[str]):
    """Yield (start_index, header, rows) for each {% table %} ... {% /table %}."""
    i = 0
    while i < len(lines):
        if lines[i].strip() == "{% table %}":
            j = i + 1
            rows, current, cell = [], [], None
            while j < len(lines) and lines[j].strip() != "{% /table %}":
                s = lines[j].strip()
                if s == "---":
                    if cell is not None:
                        current.append(cell)
                    rows.append(current)
                    current, cell = [], None
                elif s.startswith("*"):
                    if cell is not None:
                        current.append(cell)
                    cell = s[1:].strip()
                elif s and cell is not None:
                    cell += " " + s  # wrapped continuation line
                j += 1
            if cell is not None:
                current.append(cell)
            if current:
                rows.append(current)
            if rows:
                yield i, rows[0], rows[1:]
            i = j + 1
        else:
            i += 1


def parse_gemini(text: str, source_url: str, today: str) -> list[dict]:
    lines = text.splitlines()
    heading_at, title, anchor = {}, "", None
    for idx, line in enumerate(lines):
        m = re.match(r'^#{2,3}\s+(.+?)\s*(?:\{%\s*id="([^"]+)"\s*%\})?\s*$', line)
        if m:
            title, anchor = m.group(1).strip(), m.group(2)
        heading_at[idx] = (title, anchor)

    out = []
    for start, header, rows in iter_markdoc_tables(lines):
        h = [c.lower() for c in header]
        if not h or h[0] not in {"model", "agent"} or "shutdown date" not in h:
            continue
        col = {name: h.index(name) for name in h}
        section, anchor = heading_at.get(start, ("", None))
        in_deprecated = "deprecated" in section.lower()
        for row in rows:
            if len(row) < len(h):
                row = row + [""] * (len(h) - len(row))
            ids = backtick_ids(row[0])
            if not ids:
                continue
            mid = ids[0]
            cell = row[col["shutdown date"]].strip()
            shutdown = parse_date(cell)
            repl_idx = col.get("recommended replacement")
            replacement = replacement_from(row[repl_idx]) if repl_idx is not None else None
            if shutdown:
                kind = "earliest"
                if in_deprecated or shutdown < today:
                    status, kind = "retired", "exact"
                else:
                    status = "deprecated" if replacement else "active"
            elif cell.upper() == "N/A":
                kind, status = "none", "legacy"  # alias that routes elsewhere
            else:
                kind, status = "none", "retired" if in_deprecated else "active"
            out.append(
                {
                    "slug": slugify(mid),
                    "provider": "gemini",
                    "name": pretty_name(mid),
                    "ids": [mid],
                    "status": status,
                    "announced": None,
                    "released": parse_date(row[col.get("release date", 1)]),
                    "shutdown": shutdown,
                    "shutdown_kind": kind,
                    "shutdown_text": clean_text(cell),
                    "replacement": replacement,
                    "source_url": f"{source_url}#{anchor}" if anchor else source_url,
                }
            )
    return merge_rows(out)


# --------------------------------------------------------------------------
# Build the final document
# --------------------------------------------------------------------------


def finalize(models: list[dict], today: str, names: dict[str, str]) -> list[dict]:
    for m in models:
        # Status from dates when the source doesn't state one (OpenAI).
        if not m.get("status"):
            if m["shutdown"] and m["shutdown"] <= today:
                m["status"] = "retired"
            elif m["shutdown"] or m["announced"]:
                m["status"] = "deprecated"
            else:
                m["status"] = "active"
        # A dated row whose date has passed is retired, whatever the table says.
        if m["shutdown_kind"] in CALENDAR_KINDS and m["shutdown"] and m["shutdown"] <= today:
            if m["status"] == "deprecated":
                m["status"] = "retired"
        if not m.pop("_named", False):
            # Prefer the undated alias's name ("gpt-5-mini" over a snapshot).
            for mid in sorted(m["ids"], key=len):
                if mid in names:
                    m["name"] = names[mid]
                    break
        repl = m.get("replacement")
        if repl and repl.get("ids"):
            slug_fn = anthropic_slug if m["provider"] == "anthropic" else slugify
            repl["slug"] = slug_fn(repl["ids"][0])
        m["platform_note"] = PLATFORM_NOTES[m["provider"]]
        m["page"] = bool(
            m["status"] in {"deprecated", "retired"}
            and (m["shutdown"] is None or m["shutdown"] >= PAGE_CUTOFF)
        )
    return models


def apply_overrides(models: list[dict], overrides: dict) -> list[dict]:
    """Overrides file: {"models": {slug: {field: value}}, "exclude": [...], "add": [...]}"""
    excluded = set(overrides.get("exclude", []))
    patch = overrides.get("models", {})
    result = []
    for m in models:
        if m["slug"] in excluded:
            continue
        # `{**a, **b}` merges two dicts; keys in b win.
        result.append({**m, **patch.get(m["slug"], {})})
    result.extend(overrides.get("add", []))
    return result


FIELD_ORDER = [
    "slug", "provider", "name", "ids", "status", "announced", "released",
    "shutdown", "shutdown_kind", "shutdown_text", "replacement",
    "platform_note", "source_url", "page", "ics_uid", "ics_sequence",
]


def ordered(m: dict) -> dict:
    out = {k: m.get(k) for k in FIELD_ORDER if k in m or k in {"released"}}
    return out


def carry_history(models: list[dict], previous: dict | None, today: str):
    """Keep calendar UIDs stable, bump SEQUENCE on date changes, log RSS events."""
    prev_models = {m["slug"]: m for m in (previous or {}).get("models", [])}
    events = list((previous or {}).get("events", []))
    seen_guids = {e["guid"] for e in events}

    def add_event(slug, kind, date, **extra):
        guid = f"{slug}-{kind}-{date}"
        if guid not in seen_guids:
            seen_guids.add(guid)
            events.append({"guid": guid, "slug": slug, "event": kind, "date": date, **extra})

    for m in models:
        old = prev_models.get(m["slug"])
        if old and old.get("ics_uid"):
            m["ics_uid"] = old["ics_uid"]
            m["ics_sequence"] = old.get("ics_sequence", 0)
            if old.get("shutdown") != m["shutdown"]:
                m["ics_sequence"] += 1
        else:
            m["ics_uid"] = f"{m['slug']}-{m['shutdown'] or 'tba'}@aiengineerguide.com"
            m["ics_sequence"] = 0
        if not m["page"]:
            continue
        if old is None:
            if previous is None:
                # First run: seed the feed with upcoming shutdowns only, dated
                # by their announcement (or today when the source gives none).
                if m["status"] == "deprecated":
                    add_event(m["slug"], "announced", m.get("announced") or today,
                              shutdown=m["shutdown"])
            else:
                add_event(m["slug"], "announced", today, shutdown=m["shutdown"])
        elif old.get("shutdown") != m["shutdown"]:
            add_event(
                m["slug"], "date-changed", today,
                old_shutdown=old.get("shutdown"), shutdown=m["shutdown"],
            )
        elif old.get("status") != m["status"] and m["status"] == "retired":
            add_event(m["slug"], "retired", m["shutdown"] or today, shutdown=m["shutdown"])

    events.sort(key=lambda e: (e["date"] or "", e["guid"]), reverse=True)
    return models, events[:200]


class GateError(Exception):
    pass


def check_gates(models: list[dict], previous: dict | None, today: str) -> None:
    by_provider: dict[str, int] = {}
    for m in models:
        by_provider[m["provider"]] = by_provider.get(m["provider"], 0) + 1
        if m["status"] not in STATUSES:
            raise GateError(f"{m['slug']}: bad status {m['status']!r}")
    for p in SOURCES:
        if not by_provider.get(p):
            raise GateError(f"{p}: parser returned no models (page format changed?)")

    slugs = [m["slug"] for m in models]
    dupes = {s for s in slugs if slugs.count(s) > 1}
    if dupes:
        raise GateError(f"duplicate slugs: {sorted(dupes)}")

    if previous:
        prev_count: dict[str, int] = {}
        for m in previous.get("models", []):
            prev_count[m["provider"]] = prev_count.get(m["provider"], 0) + 1
        for p, n in prev_count.items():
            if n >= 5 and by_provider.get(p, 0) < 0.7 * n:
                raise GateError(f"{p}: {n} -> {by_provider.get(p, 0)} models (>30% vanished)")
        prev = {m["slug"]: m for m in previous.get("models", [])}
        for m in models:
            old = prev.get(m["slug"])
            if (
                old and m["shutdown"] and old.get("shutdown") != m["shutdown"]
                and m["shutdown"] < today and m["status"] == "deprecated"
            ):
                raise GateError(
                    f"{m['slug']}: shutdown moved to {m['shutdown']} (in the past) "
                    "but the model is still marked deprecated"
                )

    ids = {i: m for m in models for i in m["ids"]}
    for slug, mid, shutdown, until in ANCHORS:
        if today >= until:
            continue
        m = ids.get(mid)
        if not m or m["shutdown"] != shutdown or m["slug"] != slug:
            raise GateError(f"anchor row missing or changed: {mid} {shutdown}")


def build(texts: dict[str, str], previous: dict | None, overrides: dict,
          names: dict[str, str], today: str, checked_at: str) -> dict:
    models = []
    models += parse_anthropic(texts["anthropic"], SOURCES["anthropic"]["url"])
    models += parse_openai(texts["openai"], SOURCES["openai"]["url"])
    models += parse_gemini(texts["gemini"], SOURCES["gemini"]["url"], today)
    models = finalize(models, today, names)
    models = apply_overrides(models, overrides)
    # Stable order: soonest shutdown first, undated last, then by slug.
    models.sort(key=lambda m: (m["shutdown"] or "9999", m["provider"], m["slug"]))
    check_gates(models, previous, today)
    models, events = carry_history(models, previous, today)
    sources = {
        p: {"url": s["url"], "checked_at": checked_at, "sha256": common.sha256(texts[p])}
        for p, s in SOURCES.items()
    }
    return {
        "generated_at": common.now_iso(),
        "page_cutoff": PAGE_CUTOFF,
        "sources": sources,
        "models": [ordered(m) for m in models],
        "events": events,
    }


def same_content(a: dict | None, b: dict) -> bool:
    """Compare ignoring timestamps and hashes, so prose-only edits don't churn."""
    if not a:
        return False
    return a.get("models") == b["models"] and a.get("events") == b["events"]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--offline", action="store_true", help="parse saved fixtures")
    ap.add_argument("--out", type=Path, default=OUT_PATH)
    args = ap.parse_args(argv)

    today = common.today().isoformat()
    texts = {}
    for provider, src in SOURCES.items():
        if args.offline:
            texts[provider] = (FIXTURES / src["fixture"]).read_text(encoding="utf-8")
        else:
            texts[provider] = common.fetch_text(src["fetch"])

    previous = common.load_json(args.out)
    overrides = common.load_json(OVERRIDES_PATH, default={}) or {}
    try:
        doc = build(texts, previous, overrides, model_names_from_models_json(),
                    today, today)
    except GateError as exc:
        print(f"SANITY GATE FAILED: {exc}", file=sys.stderr)
        return 1

    if same_content(previous, doc):
        print("retirements.json: no changes")
        common.github_output("retirements_changed", "false")
        return 0

    common.write_if_changed(args.out, common.dump_json(doc))
    changed_pages = needs_review(previous, doc)
    print(f"retirements.json: wrote {len(doc['models'])} models")
    common.github_output("retirements_changed", "true")
    common.github_output("needs_review", "true" if changed_pages else "false")
    for slug in changed_pages:
        print(f"  needs review: {slug}")
    return 0


def needs_review(previous: dict | None, doc: dict) -> list[str]:
    """Slugs with a page whose shutdown date is new or changed."""
    prev = {m["slug"]: m for m in (previous or {}).get("models", [])}
    out = []
    for m in doc["models"]:
        if not m.get("page"):
            continue
        old = prev.get(m["slug"])
        if old is None or old.get("shutdown") != m["shutdown"]:
            out.append(m["slug"])
    return out


if __name__ == "__main__":
    # `raise SystemExit(code)` exits with that status code, which CI checks.
    raise SystemExit(main())
