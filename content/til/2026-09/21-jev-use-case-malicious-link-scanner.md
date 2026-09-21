---
title: Jev use case -  Malicious link scanner
url: til/jev-use-case-malicious-link-scanner
tags:
  - jev
  - use-cases
status: published
date: 2026-09-21T00:00:00.000Z
qblog_id: 5a37d7b5-15d5-46cb-ad4a-b5c4a7d05317
---

One of the best use case for Jev is using that to scan for malicious links if you're getting input from the user

For example, here is an example by Steven Tey who has used Jev to built url scanner for his short link service dub.sh

The way it works is by passing the needed context in the prompt (state) to Jev and get the output from it. Based on it we can take a call whether it's malicious or not.

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">Weekend project: Building a malicious link scanner for <a href="https://x.com/dubdotco?ref_src=twsrc%5Etfw">@dubdotco</a> with Jev.<br><br>Our free <a href="https://t.co/8Tg5MknxcH">https://t.co/8Tg5MknxcH</a> link shortener is a great lead gen tool, but it gets its fair share of abuse from bad actors.<br><br>So I decided to feed a list of 10K+ malicious domains we’ve caught in the… <a href="https://t.co/yU8dnmHEnC">pic.twitter.com/yU8dnmHEnC</a></p>&mdash; Steven Tey (@steventey) <a href="https://x.com/steventey/status/2101706435898069093?ref_src=twsrc%5Etfw">September 20, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

## Reference
- https://x.com/steventey/status/2101706435898069093