---
title: Vercel AI Elements - Prebuilt React Components for AI Apps
url: til/vercel-ai-elements
tags:
  - vercel
  - react
  - ai-elements
status: published
date: 2025-08-22T00:00:00.000Z
qblog_id: 2f67450e-0670-4871-9430-14200b24ac22
---

Vercel has released **React UI Components** that is focused on building AI app - [AI Elements](https://ai-sdk.dev/elements/overview)

## What is AI Elements?
It's pre-built **React components library** that is built on top of [shadcn/ui](https://ui.shadcn.com/)

It has all the common UI components that you would need to build an AI app.

So if you're building an app that has AI features, component libraries like this are huge time savers 😅

![2025-08-22-at-23.44.012x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/kfhqgrydrapomudteipi)

And it has the following components right now
![2025-08-22-at-23.41.482x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/rrzsyygmcdpf3wics7ix)

## How to get started?

### Prerequisites
- `shadcn/ui` initialized in your project
- Tailwind CSS configured (AI Elements supports CSS Variables mode only)

### Installation
```shell
# Use directly (recommended)
npx ai-elements@latest
```
It'll setup `shadcn/ui` if not done already.

Similar to shadcn ui components, these components are also installed in your components directory.

If you want to install the components separately, you can do so by running the following command

```shell
npx ai-elements@latest add <component-name>
```
## Reference
- [GitHub - vercel/ai-elements](https://github.com/vercel/ai-elements?tab=readme-ov-file)
- [Introducing AI Elements: Prebuilt, composable AI SDK components - Vercel](https://vercel.com/changelog/introducing-ai-elements)

Happy building AI!