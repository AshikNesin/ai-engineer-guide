---
title: AWS Lambda Gets MicroVM Support for Sandboxed Code Execution
url: til/aws-lambda-microvm
tags:
  - aws
  - sandbox
status: published
date: 2026-06-23T00:00:00.000Z
qblog_id: 75fefa8c-5c59-4e7e-93e9-1892559ffb09
---

AWS now has support for running untrusted code similar to model.com, Vercel Box, etc called [AWS Lambda MicroVM](https://aws.amazon.com/lambda/lambda-microvms/)

It is powered by [Firecracker](https://firecracker-microvm.github.io/) the same tech which powers AWS Lambda.

![2026-06-23-at-22.49.50.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/ml02vf0cbrtuj6tedout)

The main problem it tries to solve is running **AI generated code** without having to worry about the security.

> Each MicroVM gives a single end user or session its own isolated environment that launches rapidly, retains memory and disk state for the length of the session, and pauses to a low idle cost when the user steps away. 

## Reference
- https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/