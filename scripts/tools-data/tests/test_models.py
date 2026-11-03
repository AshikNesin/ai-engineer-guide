"""Tests for refresh_models.py using a tiny hand-made models.dev sample."""

import json
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

import refresh_models as rm  # noqa: E402

SAMPLE = json.loads((HERE / "fixtures" / "models-dev-sample.json").read_text(encoding="utf-8"))


class ModelsTests(unittest.TestCase):
    def setUp(self):
        self.doc = rm.build(SAMPLE, "2026-11-02")
        self.by_id = {m["id"]: m for m in self.doc["models"]}

    def test_filters_non_text_and_other_providers(self):
        self.assertIn("claude-sonnet-5-5", self.by_id)
        self.assertNotIn("gpt-image-2", self.by_id)          # image output
        self.assertNotIn("text-embedding-3-small", self.by_id)  # embeddings
        self.assertNotIn("some-model", self.by_id)            # provider not kept

    def test_prices_and_limits(self):
        m = self.by_id["claude-sonnet-5-5"]
        self.assertEqual(m["context"], 1000000)
        self.assertEqual(m["price_per_mtok"]["input"], 2.0)
        self.assertIsNone(self.by_id["gpt-4o"]["price_per_mtok"]["cache_write"])

    def test_tokenizers(self):
        self.assertEqual(rm.tokenizer_for("anthropic", "claude-sonnet-4-5-20250929"), "claude-legacy")
        self.assertEqual(rm.tokenizer_for("anthropic", "claude-opus-4-7"), "claude-new")
        self.assertEqual(rm.tokenizer_for("anthropic", "claude-sonnet-5-5"), "claude-new")
        self.assertEqual(rm.tokenizer_for("anthropic", "claude-sonnet-5"), "claude-new")
        self.assertEqual(rm.tokenizer_for("openai", "gpt-4o"), "o200k_base")
        self.assertEqual(rm.tokenizer_for("openai", "gpt-4.1-mini"), "o200k_base")
        self.assertEqual(rm.tokenizer_for("openai", "gpt-4-turbo"), "cl100k_base")
        self.assertEqual(rm.tokenizer_for("openai", "gpt-3.5-turbo"), "cl100k_base")
        self.assertEqual(rm.tokenizer_for("openai", "gpt-5.6-sol"), "o200k_base")
        self.assertEqual(rm.tokenizer_for("google", "gemini-3.8-flash"), "gemini")

    def test_snapshot_flag(self):
        self.assertTrue(self.by_id["claude-sonnet-4-5-20250929"]["snapshot"])
        self.assertFalse(self.by_id["claude-sonnet-4-5"]["snapshot"])


if __name__ == "__main__":
    unittest.main()
