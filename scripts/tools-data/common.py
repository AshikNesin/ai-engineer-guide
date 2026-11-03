"""Small helpers shared by the tools-data refresh scripts.

Standard library only (Python 3.12). Nothing here talks to an LLM.
"""

# `from __future__ import annotations` lets us write type hints like
# `str | None` and `list[dict]` without evaluating them at runtime.
from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import re
import urllib.request
from pathlib import Path

# Path(__file__) is this file. `.resolve().parents[2]` walks up two folders:
# scripts/tools-data/common.py -> scripts/tools-data -> scripts -> repo root.
REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "data"

USER_AGENT = "aiengineerguide-tools-data/1.0 (+https://aiengineerguide.com/tools/)"


def fetch_text(url: str, timeout: int = 60) -> str:
    """Download a URL and return its body as text (UTF-8)."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    # `with` closes the connection for us when the block ends, even on errors.
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8")


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def today() -> dt.date:
    """Today's date in UTC, overridable for tests with TOOLS_DATA_TODAY=YYYY-MM-DD."""
    forced = os.environ.get("TOOLS_DATA_TODAY")
    if forced:
        return dt.date.fromisoformat(forced)
    return dt.datetime.now(dt.timezone.utc).date()


def now_iso() -> str:
    forced = os.environ.get("TOOLS_DATA_TODAY")
    if forced:
        return f"{forced}T00:00:00Z"
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# Month names and abbreviations -> month number. A dict comprehension builds
# {"january": 1, "jan": 1, ...} in one expression.
_MONTHS = {
    name.lower(): i
    for i, names in enumerate(
        [
            ("January", "Jan"), ("February", "Feb"), ("March", "Mar"),
            ("April", "Apr"), ("May", "May"), ("June", "Jun"),
            ("July", "Jul"), ("August", "Aug"), ("September", "Sep", "Sept"),
            ("October", "Oct"), ("November", "Nov"), ("December", "Dec"),
        ],
        start=1,
    )
    for name in names
}

# Matches "2026-11-30" and also "2026‑11‑30" written with non-breaking hyphens
# (U+2011), which the OpenAI page uses in a few rows.
_ISO_RE = re.compile(r"(\d{4})[-‑‐–](\d{2})[-‑‐–](\d{2})")
# Matches "November 30, 2026", "Nov 30, 2026" and "Nov 30 2026".
_LONG_RE = re.compile(r"([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})")


def parse_date(text: str) -> str | None:
    """Return the first date found in `text` as "YYYY-MM-DD", or None."""
    if not text:
        return None
    m = _ISO_RE.search(text)
    if m:
        year, month, day = (int(g) for g in m.groups())
        return dt.date(year, month, day).isoformat()
    m = _LONG_RE.search(text)
    if m:
        month = _MONTHS.get(m.group(1).lower())
        if month:
            return dt.date(int(m.group(3)), month, int(m.group(2))).isoformat()
    return None


def slugify(text: str) -> str:
    """URL slug: lowercase, every run of non [a-z0-9] characters becomes one '-'."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def load_json(path: Path, default=None):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(obj) -> str:
    # sort_keys=False keeps our chosen field order; ensure_ascii=False keeps
    # characters like "’" readable instead of "’".
    return json.dumps(obj, indent=2, ensure_ascii=False) + "\n"


def write_if_changed(path: Path, text: str) -> bool:
    """Write `text` to `path` only if it differs. Returns True if written."""
    if path.exists() and path.read_text(encoding="utf-8") == text:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return True


def github_output(name: str, value: str) -> None:
    """Expose a value to later GitHub Actions steps (no-op when run locally)."""
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as fh:
            fh.write(f"{name}={value}\n")
