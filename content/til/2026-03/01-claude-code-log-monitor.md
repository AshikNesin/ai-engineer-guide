---
title: How to monitor your logs using Claude Code
url: til/claude-code-log-monitor
tags:
  - claude-code
status: published
date: 2026-03-01T00:00:00.000Z
qblog_id: 67de341c-c607-4608-8bfb-bdfd48a129ae
---

If you ever wondered to use Claude Code as your 24x7 on-call engineer who can alert you as if something needs you further attention.

Here is the code snippet on how to do that based on Kamran Ahmed's X post

```bash
#!/bin/bash
# AI-powered log monitor → Slack alerts using Claude CLI
# Analyzes logs every 5 min, deduplicates, notifies on issues

SLACK_WEBHOOK="https://hooks.slack.com/services/XXX"
LOG_FILE="/var/log/syslog"
INTERVAL=300
LAST_HASH=""

PROMPT='Analyze these logs. If there are errors or concerning patterns, give a short summary. If all good, respond: OK'

while true; do
  LOGS=$(tail -n 200 "$LOG_FILE")

  # Skip if logs unchanged (also saves API calls)
  HASH=$(echo "$LOGS" | md5sum | cut -d' ' -f1)
  [ "$HASH" = "$LAST_HASH" ] && sleep "$INTERVAL" && continue
  LAST_HASH="$HASH"

  ANALYSIS=$(echo "$LOGS" | claude -p "$PROMPT")
  [ "$ANALYSIS" = "OK" ] && sleep "$INTERVAL" && continue

  curl -s -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "$(jq -n --arg text "🚨 *$(hostname)*\n$ANALYSIS" '{text: $text}')"

  sleep "$INTERVAL"
done
```

Beware of signal to noise ratio and your cost though!

## Reference
- https://x.com/kamrify/status/2027998424176411034/photo/1
