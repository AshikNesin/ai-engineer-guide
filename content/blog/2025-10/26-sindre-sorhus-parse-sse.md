---
title: How to parse SSE events in Fetch API with parse-sse
url: blog/sindre-sorhus-parse-sse
tags:
  - sindre-sorhus
  - sse
status: published
date: 2025-10-26T00:00:00.000Z
qblog_id: 479bb378-d4bb-43b0-8f8f-72405c64b027
---

When working with Server-Sent Events (SSE) response format in API, you have to handle lot of things especially if you're using native Fetch API.

For example, you need handle buffering, chunk boundaries, SSE metadata (data:, event:, id:), multiple `data:` lines in one event, etc

This lightweight library abstracts it away without compromising spec.

## How to get started?
You can install this from npm
```shell
npm install parse-sse
```

## Usage
```js
import {parseServerSentEvents} from 'parse-sse';

const response = await fetch('https://api.example.com/events');

for await (const event of parseServerSentEvents(response)) {
	console.log(event.type);        // Event type (default: 'message')
	console.log(event.data);        // Event data
	console.log(event.lastEventId); // Last event ID (always present as string)
	console.log(event.retry);       // Retry interval in ms (if specified)
}
```

## Reference
- [GitHub - sindresorhus/parse-sse: Parse Server-Sent Events (SSE) from a Response](https://github.com/sindresorhus/parse-sse)

Happy parsing SSE!