"""Tests for refresh_retirements.py, run against saved copies of the sources.

    python -m unittest discover scripts/tools-data/tests
"""

import copy
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

import refresh_retirements as rr  # noqa: E402
from common import parse_date  # noqa: E402

FIX = HERE / "fixtures"
TODAY = "2026-11-02"


def load(name):
    return (FIX / name).read_text(encoding="utf-8")


TEXTS = {p: load(s["fixture"]) for p, s in rr.SOURCES.items()}


def build(previous=None, overrides=None, today=TODAY):
    return rr.build(TEXTS, previous, overrides or {}, {}, today, today)


def by_slug(doc):
    # A dict comprehension: {key_expr: value_expr for item in iterable}
    return {m["slug"]: m for m in doc["models"]}


class ParseDateTests(unittest.TestCase):
    def test_formats(self):
        self.assertEqual(parse_date("November 30, 2026"), "2026-11-30")
        self.assertEqual(parse_date("Apr 1, 2027"), "2027-04-01")
        self.assertEqual(parse_date("2026-09-24"), "2026-09-24")
        # Non-breaking hyphens (U+2011) used on the OpenAI page.
        self.assertEqual(parse_date("2026‑03‑26"), "2026-03-26")
        self.assertEqual(parse_date("Not sooner than June 9, 2027"), "2027-06-09")
        self.assertIsNone(parse_date("To be announced"))
        self.assertIsNone(parse_date("No shutdown date announced"))


class SplitRowTests(unittest.TestCase):
    def test_escaped_pipe_stays_in_cell(self):
        cells = rr.split_row("| Dec 11, 2026 | `gpt-5` \\| `gpt-5-2025-08-07` | `gpt-5.6-sol` |")
        self.assertEqual(len(cells), 3)
        self.assertEqual(rr.backtick_ids(cells[1]), ["gpt-5", "gpt-5-2025-08-07"])


class AnthropicTests(unittest.TestCase):
    def setUp(self):
        self.models = {m["slug"]: m for m in rr.parse_anthropic(TEXTS["anthropic"], "u")}

    def test_sonnet_4_5(self):
        m = self.models["claude-sonnet-4-5"]
        self.assertEqual(m["ids"], ["claude-sonnet-4-5-20250929"])
        self.assertEqual(m["status"], "deprecated")
        self.assertEqual(m["announced"], "2026-09-30")
        self.assertEqual(m["shutdown"], "2026-11-30")
        self.assertEqual(m["shutdown_kind"], "exact")
        self.assertEqual(m["replacement"]["ids"], ["claude-sonnet-5-5"])

    def test_active_floor_is_not_a_retirement(self):
        m = self.models["claude-opus-5-5"]
        self.assertEqual(m["status"], "active")
        self.assertEqual(m["shutdown_kind"], "not_before")

    def test_to_be_announced(self):
        m = self.models["claude-mythos-preview"]
        self.assertEqual(m["status"], "deprecated")
        self.assertIsNone(m["shutdown"])
        self.assertEqual(m["shutdown_kind"], "none")

    def test_snapshots_merge(self):
        m = self.models["claude-3-5-sonnet"]
        self.assertEqual(
            sorted(m["ids"]), ["claude-3-5-sonnet-20240620", "claude-3-5-sonnet-20241022"]
        )


class OpenAITests(unittest.TestCase):
    def setUp(self):
        self.models = {m["slug"]: m for m in rr.parse_openai(TEXTS["openai"], "u")}

    def test_gpt5_family_dec_11(self):
        for slug in ["gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-5-pro", "o3", "o3-pro"]:
            with self.subTest(slug=slug):
                self.assertEqual(self.models[slug]["shutdown"], "2026-12-11")
        self.assertEqual(self.models["o3"]["ids"], ["o3", "o3-2025-04-16"])
        self.assertEqual(self.models["gpt-5"]["replacement"]["ids"], ["gpt-5.6-sol"])

    def test_gpt4o_family_jan_14(self):
        for slug in ["gpt-4o", "gpt-4o-mini", "gpt-4-1", "gpt-4-1-mini"]:
            with self.subTest(slug=slug):
                self.assertEqual(self.models[slug]["shutdown"], "2027-01-14")
                self.assertEqual(self.models[slug]["replacement"]["ids"], ["gpt-6-luna"])
        self.assertEqual(self.models["gpt-4o"]["name"], "GPT-4o")
        self.assertEqual(self.models["gpt-4o"]["ids"], ["gpt-4o-2024-08-06", "gpt-4o-2024-11-20"])

    def test_older_gpt4o_snapshot_keeps_its_own_slug(self):
        self.assertEqual(self.models["gpt-4o-2024-05-13"]["shutdown"], "2026-10-23")

    def test_systems_and_endpoints_skipped(self):
        all_ids = {i for m in self.models.values() for i in m["ids"]}
        self.assertNotIn("/v1/edits", all_ids)
        self.assertFalse(any("Assistants" in i for i in all_ids))

    def test_same_tts_alias_rows_merge(self):
        self.assertEqual(len(self.models["gpt-4o-mini-tts"]["ids"]), 3)

    def test_dated_snapshots_fold_into_alias(self):
        self.assertIn("sora-2-2025-10-06", self.models["sora-2"]["ids"])
        self.assertNotIn("sora-2-2025-10-06", self.models)

    def test_newest_announcement_wins(self):
        # gpt-4-0314 appears in 2023 ("at earliest 2024-06-13") and 2025 sections.
        self.assertEqual(self.models["gpt-4-0314"]["shutdown"], "2026-03-26")


class GeminiTests(unittest.TestCase):
    def setUp(self):
        self.models = {m["slug"]: m for m in rr.parse_gemini(TEXTS["gemini"], "u", TODAY)}

    def test_tts_preview_nov_17(self):
        m = self.models["gemini-3-1-flash-tts-preview"]
        self.assertEqual(m["shutdown"], "2026-11-17")
        self.assertEqual(m["shutdown_kind"], "earliest")
        self.assertEqual(m["status"], "deprecated")
        self.assertTrue(m["source_url"].endswith("#gemini-3-preview-models"))

    def test_no_date_announced(self):
        m = self.models["gemini-3-8-flash"]
        self.assertEqual(m["shutdown_kind"], "none")
        self.assertEqual(m["status"], "active")

    def test_na_alias_is_legacy(self):
        m = self.models["gemini-3-5-flash"]
        self.assertEqual(m["status"], "legacy")
        self.assertEqual(m["replacement"]["ids"][0], "gemini-3.6-flash")

    def test_deprecated_section_is_retired(self):
        m = self.models["gemini-2-0-flash"]
        self.assertEqual(m["status"], "retired")
        self.assertEqual(m["shutdown"], "2026-06-01")


class BuildTests(unittest.TestCase):
    def test_calendar_anchor_dates(self):
        doc = build()
        m = by_slug(doc)
        self.assertEqual(m["claude-sonnet-4-5"]["shutdown"], "2026-11-30")
        self.assertEqual(m["o3"]["shutdown"], "2026-12-11")
        self.assertEqual(m["gpt-4o"]["shutdown"], "2027-01-14")
        for slug in ["claude-sonnet-4-5", "o3", "gpt-4o"]:
            self.assertTrue(m[slug]["page"])
        # Active models never get a page and never hit the calendar.
        self.assertFalse(m["claude-opus-5-5"]["page"])

    def test_replacement_slug(self):
        m = by_slug(build())
        self.assertEqual(m["claude-sonnet-4-5"]["replacement"]["slug"], "claude-sonnet-5-5")
        self.assertEqual(m["gpt-4-1"]["replacement"]["slug"], "gpt-6-luna")

    def test_past_shutdown_is_retired(self):
        m = by_slug(build())
        self.assertEqual(m["gpt-4-turbo"]["status"], "retired")
        self.assertEqual(m["claude-opus-4-1"]["status"], "retired")

    def test_ics_uid_stable_and_sequence_bumps(self):
        first = build()
        prev = copy.deepcopy(first)
        texts = dict(TEXTS)
        texts["anthropic"] = TEXTS["anthropic"].replace(
            "| November 30, 2026 | `claude-sonnet-4-5", "| December 15, 2026 | `claude-sonnet-4-5"
        ).replace(
            "| September 30, 2026 | November 30, 2026 ", "| September 30, 2026 | December 15, 2026 "
        )
        # The anchor gate would (rightly) fail on this edit, so skip it here.
        saved = rr.ANCHORS
        rr.ANCHORS = []
        try:
            second = rr.build(texts, prev, {}, {}, TODAY, TODAY)
        finally:
            rr.ANCHORS = saved
        a = by_slug(first)["claude-sonnet-4-5"]
        b = by_slug(second)["claude-sonnet-4-5"]
        self.assertEqual(b["shutdown"], "2026-12-15")
        self.assertEqual(a["ics_uid"], b["ics_uid"])
        self.assertEqual(a["ics_uid"], "claude-sonnet-4-5-2026-11-30@aiengineerguide.com")
        self.assertEqual(b["ics_sequence"], a["ics_sequence"] + 1)
        guids = [e["guid"] for e in second["events"]]
        self.assertIn(f"claude-sonnet-4-5-date-changed-{TODAY}", guids)
        self.assertEqual(rr.needs_review(prev, second), ["claude-sonnet-4-5"])

    def test_rebuild_is_stable(self):
        first = build()
        second = build(previous=copy.deepcopy(first))
        self.assertTrue(rr.same_content(first, second))

    def test_overrides(self):
        doc = build(overrides={"models": {"o3": {"name": "OpenAI o3"}}, "exclude": ["tts-1"]})
        m = by_slug(doc)
        self.assertEqual(m["o3"]["name"], "OpenAI o3")
        self.assertNotIn("tts-1", m)


class GateTests(unittest.TestCase):
    def test_anchor_missing_fails(self):
        texts = dict(TEXTS)
        texts["anthropic"] = TEXTS["anthropic"].replace("November 30, 2026", "December 1, 2026")
        with self.assertRaises(rr.GateError):
            rr.build(texts, None, {}, {}, TODAY, TODAY)

    def test_anchor_ignored_after_expiry(self):
        texts = dict(TEXTS)
        texts["anthropic"] = TEXTS["anthropic"].replace("November 30, 2026", "December 1, 2026")
        rr.build(texts, None, {}, {}, "2026-12-02", "2026-12-02")  # no exception

    def test_rows_vanishing_fails(self):
        prev = build()
        texts = dict(TEXTS)
        # Drop every OpenAI table row: the parser "breaks".
        texts["openai"] = TEXTS["openai"].split("## Past deprecations")[0]
        with self.assertRaises(rr.GateError):
            rr.build(texts, prev, {}, {}, TODAY, TODAY)

    def test_empty_provider_fails(self):
        texts = dict(TEXTS)
        texts["gemini"] = "# nothing here"
        with self.assertRaises(rr.GateError):
            rr.build(texts, None, {}, {}, TODAY, TODAY)

    def test_date_moved_into_past_fails(self):
        prev = build()
        models = copy.deepcopy(prev["models"])
        for m in models:
            if m["slug"] == "gpt-5":
                m["shutdown"] = "2026-10-01"
                m["status"] = "deprecated"
        with self.assertRaises(rr.GateError):
            rr.check_gates(models, prev, TODAY)


if __name__ == "__main__":
    unittest.main()
