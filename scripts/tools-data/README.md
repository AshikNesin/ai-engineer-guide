# tools-data

Python 3.12, standard library only. These scripts refresh the data behind
`/tools/` and never call an LLM.

| Script | Writes | Source |
|---|---|---|
| `refresh_models.py` | `data/models.json` | models.dev (`https://models.dev/api.json`, MIT) |
| `refresh_retirements.py` | `data/retirements.json` | Official deprecation pages of Anthropic, OpenAI and the Gemini API |

```bash
python scripts/tools-data/refresh_models.py
python scripts/tools-data/refresh_retirements.py            # live
python scripts/tools-data/refresh_retirements.py --offline  # saved fixtures
python -m unittest discover scripts/tools-data/tests
```

The `.github/workflows/tools-data.yml` Action runs both daily and opens a PR on
the `bot/tools-data` branch. A `needs-review` label means a model with its own
page got a new or changed shutdown date.

## Rules

- Never hand-edit `data/retirements.json` or `data/models.json`. Put fixes in
  `data/retirements_overrides.json` (`models` patches fields by slug, `exclude`
  drops slugs, `add` appends full entries). It's JSON, not YAML, because the
  standard library can't read YAML.
- A run fails instead of writing when a sanity gate trips: a provider returns no
  rows, more than 30% of a provider's rows vanish, a date moves into the past
  for a model still marked deprecated, slugs collide, or an anchor row
  (`claude-sonnet-4-5-20250929` retiring 2026-11-30) is missing before
  2026-12-01.
- Slugs (page URLs) never change. Each `.ics` event keeps its first `ics_uid`;
  `ics_sequence` goes up when a date moves so subscribed calendars update.
- Only models whose shutdown is on/after `PAGE_CUTOFF` (2026-01-01) get a page.

## When a parser test fails

Providers change their page layout now and then. Save the new page into
`tests/fixtures/`, point `SOURCES[...]["fixture"]` at it, and fix the parser
until `python -m unittest` passes again.
