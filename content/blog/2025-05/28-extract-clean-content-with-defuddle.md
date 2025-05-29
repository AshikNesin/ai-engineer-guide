---
title: Extract Clean Content from Web Pages Using Defuddle
date: 2025-05-28
description: 
tags:
  - tools
url: blog/extract-clean-content-with-defuddle
via_url: https://github.com/kepano/defuddle?tab=readme-ov-file
---
When building a RAG application or adding real time context to LLM we might need to extract main content from the web page.

However, web pages usually content lots of noises like header, side bar, footer, etc

So we need to do little bit of parsing and cleaning up the content before we can use it.

[Defuddle](https://github.com/kepano/defuddle?tab=readme-ov-file) is Node.js / Javascript library which does it.

Unlike [Mozilla Readability](https://github.com/mozilla/readability) it provides consistent output for code blocks, footnotes, etc.

And also it extracts more metadata from the page (including schema.org data).

## Dependency

```shell
npm install defuddle
# For Node.js usage, we'll also need to install jsdom
npm install jsdom
```


## Usage - Browser Example

Browser support will be really useful if you're using this inside a browser extension to extract clean content from currently viewed page. 

In fact, the author has built this for [Obsidian Web Clipper](https://github.com/obsidianmd/obsidian-clipper) 

```js
// Initialize with the current document
const defuddle = new Defuddle(document);

// Parse content and metadata
const result = defuddle.parse();

console.log('Title:', result.title);
console.log('Author:', result.author);
console.log('Content:', result.content);
```
## Usage - Node.js

Defuddle can also be used in Node.js, especially useful for web scraping or automation tasks


### 📄 1. Parse Raw HTML String

```js
import { Defuddle } from 'defuddle/node';

const html = '<html><body><article><h1>Hello World</h1><p>This is a test.</p></article></body></html>';
const result = await Defuddle(html);

console.log('Title:', result.title);
console.log('Content:', result.content);
```

**Use case:** Ideal for processing HTML from databases, file systems, or crawlers.

### 🌐 2. Parse Remote URL

```js
import { JSDOM } from 'jsdom';
import { Defuddle } from 'defuddle/node';

const dom = await JSDOM.fromURL('https://example.com/article');
const result = await Defuddle(dom);

console.log('Title:', result.title);
console.log('Author:', result.author);
console.log('Content:', result.content);
```
**Use case:** Fetch and parse live content from a website.

### ⚙️ 3. Parse with Options (Markdown + Debug)

```js
import { JSDOM } from 'jsdom';
import { Defuddle } from 'defuddle/node';

const url = 'https://example.com/article';
const dom = await JSDOM.fromURL(url);
const result = await Defuddle(dom, url, {
  debug: true,     // Logs parsing steps
  markdown: true,  // Outputs Markdown instead of HTML
});

console.log('Markdown Content:', result.content);

```

**Use case:** Extract content and convert to markdown
## Credits
- Snippets are based on defuddle's [README](https://github.com/kepano/defuddle?tab=readme-ov-file#usage) + ChatGPT

Happy scraping web-pages!