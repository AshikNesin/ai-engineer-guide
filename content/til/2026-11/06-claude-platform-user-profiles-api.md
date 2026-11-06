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

![2026-11-06-at-23.58.432x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/v45uk4o07iwqafkpnzyg)

A sample request will be something like this

```shell
curl https://api.anthropic.com/v1/user_profiles \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2026-10-21" \
  -H "content-type: application/json" \
  -d '{
    "name": "John Doe",
    "access_type": "passthrough",
    "external_user_details": {
      "reference_id": "cust-123",
      "country": "US"
    }
  }'
```

And your response would be
```json
{
  "type": "user_profile",
  "id": "uprof_011CZkZCu8hGbp5mYRQgUmz9",
  "name": "John Doe",
  "access_type": "passthrough",
  "external_user_details": {
    "reference_id": "cust-123",
    "onboarded_at": null,
    "account_status": null,
    "entity_type": null,
    "country": "US",
    "name_hash": null,
    "email_hash": null
  },
  "metadata": {},
  "programs": {
    "cyber": null,
    "efs": null
  },
  "created_at": "2026-03-15T10:00:00Z",
  "updated_at": "2026-03-15T10:00:00Z"
}
```

## Reference
- https://platform.claude.com/docs/en/manage-claude/user-profiles
- https://x.com/cjav_dev/status/2118468119563825655?a=xmszAdZc70d_yiAMwec&s=20