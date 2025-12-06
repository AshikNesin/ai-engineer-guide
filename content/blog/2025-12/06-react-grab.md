---
title: React Grab - Give AI Exact Component Context
url: blog/react-grab
tags:
  - tools
status: published
date: 2025-12-06T00:00:00.000Z
qblog_id: 3ec26090-664e-4fb0-ae27-eb8768378700
---

[React Grab](https://www.react-grab.com/) makes it easy to work on frontend projects. 

Instead of letting the AI figure out where it needs to make the change. You can give explict context easily and that helps the LLM to avoid trying to figure out where it needs to make the change - effectively saving time & money (tokens)

As the name suggest it currently works only on React framework for now.

![2025-12-06-at-21.34.442x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/wo5qm4uip7dsgkwywyde)

## How to get started?
You can set this up using their dedicated CLI
```
npx @react-grab/cli@latest
```

If that doesn't workout you can install it manually as well.

In my case, I'm setting this up in my vite 

```shell
npm install react-grab
```

Add I've added this in the `index.html`

```html
<script type="module">
      // first npm i react-grab
      // then in head:
      if (import.meta.env.DEV) {
        import("react-grab");
      }
</script>
```

That's pretty much it.

You should be now able to select the element in your react app by pressing `CMD + C`

![2025-12-06-at-21.32.312x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/ieb07ugq22o5fxhtnft9)

```
<div class="h-full border border...">
  <div ...>
  Calendar

calendar • schedule • bills
</div>
  in Bookmarks (at //localhost:3000/src/pages/Bookmarks.tsx)
  in Layout (at //localhost:3000/src/components/Layout.tsx)
  in ProtectedRoute (at //localhost:3000/src/components/ProtectedRoute.tsx)
```

Happy building frontend-app!