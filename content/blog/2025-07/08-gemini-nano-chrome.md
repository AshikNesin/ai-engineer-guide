---
title: Gemini Nano in Chrome 138+
date: 2025-07-08
description: 
tags:
  - gemini-nano
url: blog/gemini-nano-chrome
via_url: https://github.com/swyxio/swyxdotio/issues/536
---
Gemini Nano will be getting shipped with Google Chrome starting from version 138.

This in browser LLM is good for the use cases in which you don't powerful intelligence like:
- Summarizing
- Classification
- Rephrasing text

And it is `NOT` useful to get factual information (getting answer for a question)

## How to enable it?
By default, it may not be enabled so you'll need to enable it feature flag `chrome://flags/#prompt-api-for-gemini-nano`

You may need to restart the browser post updating it.
![2025-07-08 at 23.17.51@2x.png](/images/2025-07-08-at-23.17.51-at-2x.png)
And once that is enabled you'll to download the model which you can do by running the following in the console.

```js
const session = await LanguageModel.create({
monitor(m) {
  m.addEventListener("downloadprogress", (e) => {
    console.log(`Downloaded ${e.loaded * 100}%`);
  });
}
})
```

- The model comes with `6144` context window -- you can get this info by running `session.inputQuota` 
- It is likely 4-6B model at a 4-8bit quantization

## Usage
You can interact with the model using [The Prompt API](https://developer.chrome.com/docs/ai/prompt-api) 

### Check if model is available
```js
await LanguageModel.availability()
```

| Response       | Description                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "unavailable"  | The implementation does not support the requested options, or does not support prompting a language model at all.                                            |
| "downloadable" | The implementation supports the requested options, but it will have to download something before it can create a session using those options.                |
| "downloading"  | The implementation supports the requested options, but will need to finish an ongoing download operation before it can create a session using those options. |
| "available"    | The implementation supports the requested options without requiring any new downloads.                                                                       |
### Configuring model parameters
The `params()` function in `LanguageModel` will let us know the available model's parameters.

| Parameter | Default Value | Maximum Value | Notes |
| --- | --- | --- | --- |
| defaultTopK | 3 | 8 |  |
| defaultTemperature | 1.0 | 2.0 | Temperature value must be between 0.0 and 2.0 |
| maxTemperature |  | 2.0 |  |
| maxTopK |  | 8 |  |
```js
await LanguageModel.params();
// {defaultTopK: 3, maxTopK: 8, defaultTemperature: 1, maxTemperature: 2}
```

### Function Calling / JSON Output
```js
const JSONschema = `<schema>
{
    "description": "Correctly extracted \`UserDetail\` with all the required parameters with correct types",
    "name": "UserDetail",
    "parameters": {
        "properties": {
            "age": {
                "title": "Age",
                "type": "integer"
            },
            "name": {
                "title": "Name",
                "type": "string"
            }
        },
        "required": [
            "age",
            "name"
        ],
        "type": "object"
    }
}
</schema>`
const JSONsession = await LanguageModel.create({
  initialPrompts: [
    { role: 'system', content: 'You are a helpful LLM that only responds in valid JSON fitting a schema: ' + JSONschema },
    { role: 'user', content: "Extract Jason is 35 years old" },
    { role: 'assistant', content: '{age: 35, name: Jason}'},
  ]
});

const result1 = await JSONsession.prompt("Extract Sarah is 22 years old");
console.log(result1);
// {age: 22, name: Sarah}
```

Wrappers like [GitHub - kstonekuan/simple-chromium-ai](https://github.com/kstonekuan/simple-chromium-ai) make it easy to work with Chrome's Prompt API.

You can read about creating session, multimodal capabilities, etc in the [The Prompt API  |  AI on Chrome](https://developer.chrome.com/docs/ai/prompt-api) blog post.
###  What doesn't work as expected (yet)
- Required fields are not strictly followed.
![2025-07-08 at 23.54.58@2x.png](/images/2025-07-08-at-23.54.58-at-2x.png)
- Sessions are stateful by default.
## Credits
[Gemini Nano in Chrome 138: notes for AI Engineers](https://github.com/swyxio/swyxdotio/issues/536)
## References
- [Chrome is adding `window.ai` – a Gemini Nano AI model right inside the browser | Hacker News](https://news.ycombinator.com/item?id=40834600)

Happy in-browser inference!