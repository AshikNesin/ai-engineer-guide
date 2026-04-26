---
title: voipi - Free text-to-speech for your AI Agents or CLI
url: til/voipi-text-to-speech
tags:
  - tools
  - tts
status: published
date: 2026-04-26T00:00:00.000Z
qblog_id: 52b42fa1-87e4-4c81-9f34-622fdfe8ac81
---

[voipi](https://voipi.vercel.app) lets you quickly convert **text-to-speech** which you can use in your app for free.

Under the hood, it uses multiple providers. And it is pretty fast as well.

![2026-04-26-at-17.08.512x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/aysmsgfy4d93vxgsa2oz)

![2026-04-26-at-17.08.512x.png](https://raw.githubusercontent.com/pithings/voipi/main/website/demo.svg)

👉 https://voipi.vercel.app

## How to get started?

```shell
# Speak
npx voipi speak 'Hello world'

# Write to a file
npx voipi speak 'Hi' -o hello.mp3
```

You can also use it programatically (based on docs)

```js
import { VoiPi } from "voipi";

const voice = new VoiPi();

// Speak text
await voice.speak("Hello world!");

// With a prioritized voice list (first available wins)
await voice.speak("Hello!", { voice: ["Samantha", "en-US-AriaNeural"], rate: 1.5 });

// Save to file
await voice.save("Hello!", "output.mp3");

// Get audio data with duration
const audio = await voice.toAudio("Hello world!");
console.log(`Duration: ${audio.duration}s`);

// List available voices
const voices = await voice.listVoices();
```

## Reference
- https://github.com/pithings/voipi