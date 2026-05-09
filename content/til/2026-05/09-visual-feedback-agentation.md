---
title: How Do I Tell AI Agents Exactly Which UI Element to Change?
url: til/visual-feedback-agentation
tags:
  - tools
status: published
date: 2026-05-09T00:00:00.000Z
qblog_id: d2d88b96-d914-439f-b14f-b30a245188fd
---

[Agentation](https://www.agentation.com/) allows you to easily add visual feedback in the frontend. Once you've added the needed feedbacks, you can just copy them in one go.

![2026-05-09-at-22.50.492x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/ie18b4blaz7homtou8jz)

## How to get started?

```
npm install agentation -D
```

And then add it in your app

```jsx
import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}
```

Make sure that you've enabled it only in development mode alone.

Once that's done. You'll be seeing an widget to add feedbacks in your web app. 

The feedbacks will be something like this which you can pass it to your AI agents

```markdown
## Page Feedback: /
**Viewport:** 1492×892

### 1. "agents."
**Location:** header > .heading-container > h1 > .pen-underline
**Source:** _next/static/chunks/app/layout-59af6aa2ff365102.js:1:265623
**Feedback:** Add slick animation for the word
```

Instead of copy-pasting the feedbacks, you can also use the [MCP](https://www.agentation.com/mcp) to handle that for you

```shell
npx add-mcp "npx -y agentation-mcp server"
```

## Reference
- https://x.com/housecor/status/2052504763690832318