---
title: All Code Is Slop (Except Mine) by Lauren Tan
url: til/all-code-is-slop-except-mine-by-lauren-tan
tags:
  - bookmark
status: published
date: 2026-11-15T00:00:00.000Z
qblog_id: 1ad2f02e-08bc-473e-9c63-6503d8493f48
---

Lauren Tan has a pretty interesting talk about how she and her team code with AI (for their Grok Bot).

Some of the highlights from the talk:

The main takeaway is that we should focus on the **environment** around the code that helps us to improve our trust.

To improve our agents, we need to focus on improving these things:

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/cjw1uatr8kmqwv0x8ska)

**1. Codebase improvements**: We should focus on better architecture, good api designs, stronger types and invariants, clear boundaries.

> Your codebase is the agent's largest input; anything in it gets copied as "the established pattern."
![2026-11-15-at-00.24.42.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/yresc2rt7jc0mdyjrjqi)


**2. Static analysis**: Have strict lint rules, tests, CI, and other usual things that we do to catch issues like in the good old days :)

**3. Verification**: Runtime and formal

**4. Prose**: skills, AGENTS.md, Comments - anything that can't be enforced and requires agent judgement.

> Rule: every time you correct an agent, don't add a line to AGENTS.md — make it a deterministic check, or better, design the invalid choice away entirely.

And in the Grok Bot codebase:
- They banned the APIs like React's useEffect which has caused lot of issue/confusion in their Dune framework.
- Context via directory structure - They've explictly seperated the `electron-main` and `electron-renderer` in their electron based app. And have explictly banned the cross-imports.
- They've banned comments (which agents adds a lot for quick fixes)
![2026-11-15-at-00.25.12.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/otvwsf5cmjtufxmdudlp)

![2026-11-15-at-00.26.42.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/pecss7azr3lzjudoakub)
![2026-11-15-at-00.49.47.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/pdhwv0rzguewergc7tsk)
![2026-11-15-at-00.52.00.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/ddfawxjqrmoctrkiw9pe)
![2026-11-15-at-00.53.19.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/uc6yjrwhsrvlq3el5wh9)
![2026-11-15-at-00.53.27.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/pmonqrbyxnqbolk5nnke)
![2026-11-15-at-00.54.32.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/erassmwjczxqgtvfcmiu)
![2026-11-15-at-00.54.42.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/ekhwl05xxxwhqy0oic1c)
![2026-11-15-at-00.55.35.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/q3577x16twwtg7jghdou)
![2026-11-15-at-00.56.14.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/bazq0dlwe1iq40bbzfnq)
![2026-11-15-at-00.56.46.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/yqbz9zx6jqfbslvvpflu)
![2026-11-15-at-00.58.07.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/dqff0pkwat93fay1jpts)
![2026-11-15-at-00.59.11.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/nryeuofklkkixncnug65)
![2026-11-15-at-00.59.26.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/uniwdtmqwb90jfvwbkrd)

And her full talk
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/O_zcc6Xl12g?si=MpFaKKBPoFpjc3Jb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Related
- https://x.com/poteto/status/2111133080526495985
