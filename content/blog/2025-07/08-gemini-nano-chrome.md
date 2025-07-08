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
},
// // uncomment if want multimodal input https://developer.chrome.com/docs/ai/prompt-api#multimodal_capabilities 
// expectedInputs: [
//  { type: "audio" },
//  { type: "image" }
//  ]
})
```

- The model comes with `6144` context window -- you can get this info by running `session.inputQuota` 
- It is likely 4-6B model at a 4-8bit quantization

## Usage
You can interact with the model using [The Prompt API](https://developer.chrome.com/docs/ai/prompt-api) 

Here are some common things:

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

###  What doesn't work as expected (yet)
- Required fields are not strictly followed.
![2025-07-08 at 23.54.58@2x.png](/images/2025-07-08-at-23.54.58-at-2x.png)

## Credits
[Gemini Nano in Chrome 138: notes for AI Engineers](https://github.com/swyxio/swyxdotio/issues/536)

Happy in-browser inference!