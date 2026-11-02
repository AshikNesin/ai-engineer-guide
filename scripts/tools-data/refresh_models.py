"""Refresh data/models.json from models.dev (MIT, github.com/anomalyco/models.dev).

    python scripts/tools-data/refresh_models.py
    python scripts/tools-data/refresh_models.py --input path/to/api.json

Keeps only text-in/text-out chat models from a few providers, so the file stays
small (well under 150 KB) and can be inlined into tool pages.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import common  # noqa: E402

SOURCE_URL = "https://models.dev/api.json"
OUT_PATH = common.DATA_DIR / "models.json"
PROVIDERS = ["openai", "anthropic", "google", "xai", "deepseek", "mistral"]
MAX_BYTES = 150_000

# Official pricing pages, linked from every price we show.
PRICING_URLS = {
    "openai": "https://openai.com/api/pricing/",
    "anthropic": "https://platform.claude.com/docs/en/about-claude/pricing",
    "google": "https://ai.google.dev/gemini-api/docs/pricing",
    "xai": "https://docs.x.ai/docs/models",
    "deepseek": "https://api-docs.deepseek.com/quick_start/pricing",
    "mistral": "https://mistral.ai/pricing",
}


def claude_version(model_id: str) -> tuple[int, int] | None:
    """'claude-opus-4-7' -> (4, 7); 'claude-sonnet-5' -> (5, 0)."""
    m = re.match(r"claude-[a-z]+-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$", model_id)
    if not m:
        return None
    # `int(x or 0)` turns a missing minor version (None) into 0.
    return int(m.group(1)), int(m.group(2) or 0)


def tokenizer_for(provider: str, model_id: str) -> str:
    """Which tokenizer family the token counter should use for this model."""
    if provider == "anthropic":
        v = claude_version(model_id)
        # Anthropic's token counting docs: Claude Opus 4.7 and later use a new tokenizer.
        return "claude-new" if v and v >= (4, 7) else "claude-legacy"
    if provider == "openai":
        if re.match(r"gpt-(3\.5|4)(-|$)(?!o)", model_id) and not model_id.startswith(("gpt-4o", "gpt-4.1", "gpt-4.5")):
            return "cl100k_base"
        return "o200k_base"
    if provider == "google":
        return "gemini"
    return "other"


def is_text_chat(m: dict) -> bool:
    mods = m.get("modalities") or {}
    if mods.get("output") != ["text"] or "text" not in mods.get("input", []):
        return False
    if "embed" in (m.get("family") or "") or "embed" in m["id"]:
        return False
    limit = m.get("limit") or {}
    return bool(limit.get("context")) and m.get("cost", {}).get("input") is not None


def price(cost: dict, key: str):
    v = cost.get(key)
    return None if v is None else float(v)


def build(api: dict, checked_at: str) -> dict:
    models = []
    for provider in PROVIDERS:
        block = api.get(provider) or {}
        # `.items()` gives (key, value) pairs; sorted() makes the output stable.
        for model_id, m in sorted((block.get("models") or {}).items()):
            if not is_text_chat(m):
                continue
            cost = m.get("cost") or {}
            limit = m.get("limit") or {}
            snapshot = bool(re.search(r"-\d{8}$", model_id)) and (
                re.sub(r"-\d{8}$", "", model_id) in block["models"]
            )
            models.append(
                {
                    "id": model_id,
                    "provider": provider,
                    "name": re.sub(r"\s*\(latest\)$", "", m.get("name", model_id)),
                    "family": m.get("family"),
                    "context": limit.get("context"),
                    "max_input": limit.get("input"),
                    "max_output": limit.get("output"),
                    "price_per_mtok": {
                        "input": price(cost, "input"),
                        "output": price(cost, "output"),
                        "cache_read": price(cost, "cache_read"),
                        "cache_write": price(cost, "cache_write"),
                    },
                    "tokenizer": tokenizer_for(provider, model_id),
                    "released": m.get("release_date"),
                    "knowledge": m.get("knowledge"),
                    "reasoning": bool(m.get("reasoning")),
                    "tool_call": bool(m.get("tool_call")),
                    "open_weights": bool(m.get("open_weights")),
                    "status": m.get("status") or "active",
                    "snapshot": snapshot,
                }
            )
    return {
        "generated_at": common.now_iso(),
        "checked_at": checked_at,
        "source": SOURCE_URL,
        "source_license": "MIT (github.com/anomalyco/models.dev)",
        "pricing_urls": PRICING_URLS,
        "models": models,
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--input", type=Path, help="read a saved api.json instead of fetching")
    ap.add_argument("--out", type=Path, default=OUT_PATH)
    args = ap.parse_args(argv)

    raw = args.input.read_text(encoding="utf-8") if args.input else common.fetch_text(SOURCE_URL)
    doc = build(json.loads(raw), common.today().isoformat())

    previous = common.load_json(args.out)
    if not doc["models"]:
        print("SANITY GATE FAILED: no models after filtering", file=sys.stderr)
        return 1
    if previous and len(doc["models"]) < 0.7 * len(previous.get("models", [])):
        print("SANITY GATE FAILED: more than 30% of models vanished", file=sys.stderr)
        return 1
    if previous and previous.get("models") == doc["models"]:
        print("models.json: no changes")
        return 0

    text = common.dump_json(doc)
    if len(text.encode("utf-8")) > MAX_BYTES:
        print(f"SANITY GATE FAILED: models.json is {len(text)} bytes (> {MAX_BYTES})", file=sys.stderr)
        return 1
    common.write_if_changed(args.out, text)
    print(f"models.json: wrote {len(doc['models'])} models ({len(text) // 1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
