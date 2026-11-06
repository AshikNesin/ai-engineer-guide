---
title: Claude Platform - User Profiles API
url: til/claude-platform-user-profiles-api
tags:
  - bookmark
status: published
date: 2026-11-06T00:00:00.000Z
noindex: true
qblog_id: 147c5139-2276-428f-893d-0cfbd55b09fa
---

If you're using Claude Platform and wants to tag a user who is making their request then you can use their user profile api endpoint.

> You register each end customer once with POST /v1/user_profiles and store the uprof_ ID it returns. Then you send that ID in the anthropic-user-profile-id header on every request you make on that end customer’s behalf.

One of the advantage of doing so is that any **safety enforcement action** like bans is taken agaist that user not to your whole organization.

## Reference
- https://platform.claude.com/docs/en/manage-claude/user-profiles
- https://x.com/cjav_dev/status/2118468119563825655?a=xmszAdZc70d_yiAMwec&s=20